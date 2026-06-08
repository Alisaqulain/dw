import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import Order from "@/models/Order";
import { requireAdmin } from "@/lib/auth";
import {
  isShiprocketConfigured,
  getShiprocketConfigStatus,
  createShipmentForOrder,
  testShiprocketConnection,
  hasExistingShipment,
  canCreateShipment,
} from "@/lib/shiprocket";

export async function GET() {
  try {
    await requireAdmin();
    const config = getShiprocketConfigStatus();
    if (!config.configured) {
      return NextResponse.json(config);
    }
    const connection = await testShiprocketConnection();
    return NextResponse.json({ ...config, connection });
  } catch (error) {
    if (error.message === "Unauthorized") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    await requireAdmin();
    await connectDB();

    if (!isShiprocketConfigured()) {
      return NextResponse.json(
        {
          success: false,
          configured: false,
          error: "Shiprocket credentials not configured",
        },
        { status: 503 }
      );
    }

    const { orderId } = await request.json();
    if (!orderId) {
      return NextResponse.json({ error: "orderId is required" }, { status: 400 });
    }

    const order = await Order.findById(orderId);
    if (!order) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }

    if (hasExistingShipment(order)) {
      return NextResponse.json(
        {
          success: false,
          error: "Shipment already exists. Use Sync Tracking to refresh status.",
          order,
        },
        { status: 409 }
      );
    }

    if (!canCreateShipment(order)) {
      return NextResponse.json(
        {
          success: false,
          error:
            order.paymentMethod === "Online" && order.paymentStatus !== "paid"
              ? "Cannot ship — online payment not completed"
              : "Order is not eligible for shipment",
        },
        { status: 400 }
      );
    }

    console.log("[Shiprocket] Admin creating shipment for:", order.orderNumber);
    const result = await createShipmentForOrder(order);

    if (!result.success) {
      await Order.findByIdAndUpdate(orderId, {
        shiprocketError: result.error,
        shiprocketCreateResponse: result.shiprocket || null,
      });
      return NextResponse.json({ success: false, error: result.error }, { status: 502 });
    }

    const updatedOrder = await Order.findByIdAndUpdate(orderId, result.updates, { new: true });

    console.log("[Shiprocket] Shipment created:", updatedOrder.shiprocketOrderId, updatedOrder.shipmentId);

    return NextResponse.json({
      success: true,
      message: "Shipment created on Shiprocket",
      order: updatedOrder,
      shiprocket: result.shiprocket,
    });
  } catch (error) {
    if (error.message === "Unauthorized") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    console.error("[Shiprocket] create-order route error:", error.message);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
