import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import Order from "@/models/Order";
import { requireAdmin } from "@/lib/auth";
import {
  isShiprocketConfigured,
  syncOrderTracking,
  hasExistingShipment,
} from "@/lib/shiprocket";

export const maxDuration = 30;

export async function POST(request) {
  try {
    await requireAdmin();
    await connectDB();

    if (!isShiprocketConfigured()) {
      return NextResponse.json({ error: "Shiprocket not configured" }, { status: 503 });
    }

    const body = await request.json().catch(() => ({}));
    const { orderId, syncAll } = body;

    if (syncAll) {
      const orders = await Order.find({
        $or: [
          { shiprocketOrderId: { $ne: "" } },
          { shipmentId: { $ne: "" } },
          { awbCode: { $ne: "" } },
        ],
        deliveryStatus: { $nin: ["DELIVERED", "CANCELLED", "RTO"] },
      }).limit(50).lean();

      const results = [];
      for (const order of orders) {
        const result = await syncOrderTracking(order);
        if (result.success) {
          await Order.findByIdAndUpdate(order._id, result.updates);
          results.push({ orderNumber: order.orderNumber, success: true });
        } else {
          await Order.findByIdAndUpdate(order._id, { shiprocketError: result.error });
          results.push({ orderNumber: order.orderNumber, success: false, error: result.error });
        }
      }

      return NextResponse.json({ success: true, synced: results.length, results });
    }

    if (!orderId) {
      return NextResponse.json({ error: "orderId is required" }, { status: 400 });
    }

    const order = await Order.findById(orderId).lean();
    if (!order) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }

    if (!hasExistingShipment(order) && !order.awbCode) {
      return NextResponse.json({ error: "No Shiprocket shipment linked to this order" }, { status: 400 });
    }

    const result = await syncOrderTracking(order);

    if (!result.success) {
      await Order.findByIdAndUpdate(orderId, { shiprocketError: result.error });
      return NextResponse.json({ success: false, error: result.error }, { status: 502 });
    }

    const updatedOrder = await Order.findByIdAndUpdate(orderId, result.updates, {
      new: true,
      runValidators: false,
    });

    return NextResponse.json({
      success: true,
      message: "Tracking synced",
      statusMessage: result.resolved?.statusMessage || "",
      order: updatedOrder,
      timeline: result.timeline,
    });
  } catch (error) {
    if (error.message === "Unauthorized") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    console.error("[Shiprocket Sync] Route error:", error.message);
    return NextResponse.json({ error: error.message || "Sync failed" }, { status: 500 });
  }
}
