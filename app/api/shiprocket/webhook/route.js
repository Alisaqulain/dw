import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import Order from "@/models/Order";
import {
  normalizeDeliveryStatus,
  mapDeliveryStatusToOrderStatus,
  DELIVERY_STATUS_LABELS,
} from "@/lib/shiprocket";
import {
  sendOrderShipped,
  sendOutForDelivery,
  sendOrderDelivered,
} from "@/lib/email";

function verifyWebhookSecret(request) {
  const secret = process.env.SHIPROCKET_WEBHOOK_SECRET;
  if (!secret) return true; // allow if not configured (dev)

  const headerSecret =
    request.headers.get("x-shiprocket-secret") ||
    request.headers.get("x-webhook-secret") ||
    request.headers.get("authorization")?.replace("Bearer ", "");

  return headerSecret === secret;
}

export async function POST(request) {
  try {
    if (!verifyWebhookSecret(request)) {
      return NextResponse.json({ error: "Unauthorized webhook" }, { status: 401 });
    }

    await connectDB();
    const payload = await request.json();

    const orderIdRef = payload.order_id || payload.orderId || payload.channel_order_id;
    const awbCode = payload.awb || payload.awb_code || payload.awbCode;
    const rawStatus =
      payload.current_status ||
      payload.current_status_id ||
      payload.status ||
      payload.shipment_status ||
      payload.scans?.[0]?.status ||
      "";
    const courierName = payload.courier_name || payload.courier || "";
    const location = payload.location || payload.scans?.[0]?.location || "";

    let order = null;

    if (orderIdRef) {
      order = await Order.findOne({
        $or: [
          { orderNumber: String(orderIdRef) },
          { shiprocketOrderId: String(orderIdRef) },
          { shiprocketShipmentId: String(orderIdRef) },
        ],
      });
    }
    if (!order && awbCode) {
      order = await Order.findOne({ awbCode: String(awbCode) });
    }

    if (!order) {
      return NextResponse.json({ message: "Order not found, webhook acknowledged" });
    }

    const deliveryStatus = normalizeDeliveryStatus(String(rawStatus));
    const orderStatus = mapDeliveryStatusToOrderStatus(deliveryStatus);

    const updates = {
      deliveryStatus,
      orderStatus,
      shiprocketError: "",
    };

    if (awbCode) {
      updates.awbCode = String(awbCode);
      updates.trackingUrl = `https://shiprocket.co/tracking/${awbCode}`;
    }
    if (courierName) updates.courierName = courierName;

    updates.$push = {
      trackingEvents: {
        status: deliveryStatus,
        description: DELIVERY_STATUS_LABELS[deliveryStatus] || String(rawStatus),
        location,
        timestamp: new Date(),
      },
    };

    const previousStatus = order.deliveryStatus;
    const updatedOrder = await Order.findByIdAndUpdate(order._id, updates, { new: true });

    // Send status emails on key transitions
    if (deliveryStatus !== previousStatus) {
      if (
        ["SHIPPED", "IN_TRANSIT", "PICKED_UP"].includes(deliveryStatus) &&
        !updatedOrder.statusEmailsSent?.shipped
      ) {
        sendOrderShipped(updatedOrder).catch(console.error);
        await Order.findByIdAndUpdate(order._id, { "statusEmailsSent.shipped": true });
      }
      if (deliveryStatus === "OUT_FOR_DELIVERY" && !updatedOrder.statusEmailsSent?.outForDelivery) {
        sendOutForDelivery(updatedOrder).catch(console.error);
        await Order.findByIdAndUpdate(order._id, { "statusEmailsSent.outForDelivery": true });
      }
      if (deliveryStatus === "DELIVERED" && !updatedOrder.statusEmailsSent?.delivered) {
        sendOrderDelivered(updatedOrder).catch(console.error);
        await Order.findByIdAndUpdate(order._id, { "statusEmailsSent.delivered": true });
      }
    }

    return NextResponse.json({
      success: true,
      deliveryStatus,
      orderStatus,
      orderNumber: order.orderNumber,
    });
  } catch (error) {
    console.error("Shiprocket webhook error:", error.message);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
