import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import Order from "@/models/Order";
import { requireAdmin } from "@/lib/auth";
import {
  isShiprocketConfigured,
  getShiprocketConfigStatus,
  createShipmentForOrder,
} from "@/lib/shiprocket";

export async function GET() {
  try {
    await requireAdmin();
    return NextResponse.json(getShiprocketConfigStatus());
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
          message: "Add SHIPROCKET_EMAIL, SHIPROCKET_PASSWORD, and SHIPROCKET_PICKUP_LOCATION to .env",
        },
        { status: 503 }
      );
    }

    const { orderId, retry } = await request.json();
    if (!orderId) {
      return NextResponse.json({ error: "orderId is required" }, { status: 400 });
    }

    const order = await Order.findById(orderId);
    if (!order) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }

    if (order.shiprocketOrderId && !retry) {
      return NextResponse.json(
        { error: "Shipment already exists. Use retry: true to create again.", order },
        { status: 409 }
      );
    }

    const result = await createShipmentForOrder(order);

    if (!result.success) {
      await Order.findByIdAndUpdate(orderId, { shiprocketError: result.error });
      return NextResponse.json({ success: false, error: result.error }, { status: 502 });
    }

    const updatedOrder = await Order.findByIdAndUpdate(orderId, result.updates, { new: true });

    return NextResponse.json({
      success: true,
      message: "Shipment created successfully",
      order: updatedOrder,
      shiprocket: result.shiprocket,
    });
  } catch (error) {
    if (error.message === "Unauthorized") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
