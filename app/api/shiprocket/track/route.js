import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import Order from "@/models/Order";
import { normalizePhoneDigits } from "@/lib/utils";
import {
  isShiprocketConfigured,
  syncOrderTracking,
  hasExistingShipment,
  DELIVERY_STATUS_LABELS,
} from "@/lib/shiprocket";

export async function GET(request) {
  try {
    await connectDB();
    const { searchParams } = new URL(request.url);
    const orderNumber = searchParams.get("orderNumber");
    const phone = searchParams.get("phone");
    const refresh = searchParams.get("refresh") !== "false";

    if (!orderNumber) {
      return NextResponse.json({ error: "Order number is required" }, { status: 400 });
    }

    let order = await Order.findOne({ orderNumber });

    if (!order && phone) {
      const digits = normalizePhoneDigits(phone);
      order = await Order.findOne({
        orderNumber,
        phone: { $regex: `${digits}$` },
      });
    }

    if (!order) {
      return NextResponse.json(
        { error: "Order not found. Check your order ID and phone number." },
        { status: 404 }
      );
    }

    if (phone) {
      const digits = normalizePhoneDigits(phone);
      const orderDigits = normalizePhoneDigits(order.phone);
      if (digits !== orderDigits) {
        return NextResponse.json(
          { error: "Phone number does not match this order." },
          { status: 403 }
        );
      }
    }

    let syncError = null;
    let statusMessage = "";

    if (refresh && isShiprocketConfigured() && (hasExistingShipment(order) || order.awbCode)) {
      const syncResult = await syncOrderTracking(order);
      if (syncResult.success) {
        order = await Order.findByIdAndUpdate(order._id, syncResult.updates, { new: true });
        statusMessage = syncResult.resolved?.statusMessage || "";
      } else {
        syncError = syncResult.error;
      }
    }

    const status = order.currentStatus || order.deliveryStatus;
    const timeline = order.trackingHistory?.length
      ? order.trackingHistory
      : order.trackingEvents || [];

  const latestEvent = timeline[0];
  if (!statusMessage && latestEvent?.description) {
    statusMessage = latestEvent.description;
  }

    return NextResponse.json({
      order: {
        orderNumber: order.orderNumber,
        orderStatus: order.orderStatus,
        deliveryStatus: status,
        currentStatus: status,
        deliveryStatusLabel:
          statusMessage ||
          DELIVERY_STATUS_LABELS[status] ||
          order.orderStatus?.replace(/_/g, " "),
        statusMessage,
        customerName: order.customerName,
        total: order.total,
        paymentMethod: order.paymentMethod,
        awbCode: order.awbCode,
        courierName: order.courierName,
        trackingUrl: order.trackingUrl,
        shiprocketOrderId: order.shiprocketOrderId,
        shipmentId: order.shipmentId || order.shiprocketShipmentId,
        trackingEvents: timeline,
        lastTrackingSync: order.lastTrackingSync,
        createdAt: order.createdAt,
        hasShipment: hasExistingShipment(order) || !!order.awbCode,
      },
      timeline,
      syncError,
    });
  } catch (error) {
    console.error("[Shiprocket] track route error:", error.message);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
