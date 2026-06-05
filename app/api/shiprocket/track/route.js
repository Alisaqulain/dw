import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import Order from "@/models/Order";
import {
  isShiprocketConfigured,
  trackShipmentByAWB,
  parseTrackingTimeline,
  DELIVERY_STATUS_LABELS,
} from "@/lib/shiprocket";

export async function GET(request) {
  try {
    await connectDB();
    const { searchParams } = new URL(request.url);
    const orderNumber = searchParams.get("orderNumber");
    const phone = searchParams.get("phone");

    if (!orderNumber) {
      return NextResponse.json({ error: "Order number is required" }, { status: 400 });
    }

    const query = { orderNumber };
    if (phone) query.phone = phone.replace(/\s/g, "");

    const order = await Order.findOne(query).lean();
    if (!order) {
      return NextResponse.json(
        { error: "Order not found. Check your order ID and phone number." },
        { status: 404 }
      );
    }

    let liveTracking = null;
    let timeline = order.trackingEvents || [];

    // Refresh from Shiprocket if AWB exists and credentials configured
    if (order.awbCode && isShiprocketConfigured()) {
      try {
        liveTracking = await trackShipmentByAWB(order.awbCode);
        const parsed = parseTrackingTimeline(liveTracking);
        if (parsed.length > 0) timeline = parsed;
      } catch (e) {
        console.error("Live tracking fetch failed:", e.message);
      }
    }

    return NextResponse.json({
      order: {
        orderNumber: order.orderNumber,
        orderStatus: order.orderStatus,
        deliveryStatus: order.deliveryStatus,
        deliveryStatusLabel: DELIVERY_STATUS_LABELS[order.deliveryStatus] || order.orderStatus,
        customerName: order.customerName,
        total: order.total,
        paymentMethod: order.paymentMethod,
        awbCode: order.awbCode,
        courierName: order.courierName,
        trackingUrl: order.trackingUrl,
        shiprocketOrderId: order.shiprocketOrderId,
        trackingEvents: order.trackingEvents,
        createdAt: order.createdAt,
      },
      timeline,
      liveTracking: liveTracking ? { available: true } : { available: false },
    });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
