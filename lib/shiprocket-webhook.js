import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import Order from "@/models/Order";
import { verifyWebhookSecret, buildWebhookUpdate } from "@/lib/shiprocket";
import {
  sendOrderShipped,
  sendOutForDelivery,
  sendOrderDelivered,
} from "@/lib/email";

export async function handleShiprocketWebhook(request) {
  if (!verifyWebhookSecret(request)) {
    console.error("[Shiprocket Webhook] Unauthorized — invalid secret");
    return NextResponse.json({ error: "Unauthorized webhook" }, { status: 401 });
  }

  await connectDB();
  const payload = await request.json();
  console.log("[Shiprocket Webhook] Received:", JSON.stringify(payload).slice(0, 500));

  const orderIdRef = payload.order_id || payload.orderId || payload.channel_order_id;
  const awbCode = payload.awb || payload.awb_code || payload.awbCode;

  let order = null;

  if (orderIdRef) {
    order = await Order.findOne({
      $or: [
        { orderNumber: String(orderIdRef) },
        { shiprocketOrderId: String(orderIdRef) },
        { shiprocketShipmentId: String(orderIdRef) },
        { shipmentId: String(orderIdRef) },
      ],
    });
  }
  if (!order && awbCode) {
    order = await Order.findOne({ awbCode: String(awbCode) });
  }

  if (!order) {
    console.warn("[Shiprocket Webhook] Order not found for:", orderIdRef || awbCode);
    return NextResponse.json({ message: "Order not found, acknowledged" });
  }

  const previousStatus = order.deliveryStatus;
  const updates = buildWebhookUpdate(order, payload);
  const updatedOrder = await Order.findByIdAndUpdate(order._id, updates, { new: true });

  const deliveryStatus = updates.deliveryStatus || order.deliveryStatus;

  if (deliveryStatus && deliveryStatus !== previousStatus) {
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
    orderStatus: updatedOrder.orderStatus,
    orderNumber: order.orderNumber,
  });
}
