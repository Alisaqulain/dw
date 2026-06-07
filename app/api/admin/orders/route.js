import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import { requireAdmin } from "@/lib/auth";
import Order from "@/models/Order";
import {
  sendOrderShipped,
  sendOutForDelivery,
  sendOrderDelivered,
  sendReviewRequest,
} from "@/lib/email";
import { assignAWB } from "@/lib/shiprocket";

export async function GET(request) {
  try {
    await requireAdmin();
    await connectDB();
    const { searchParams } = new URL(request.url);
    const status = searchParams.get("status");
    const id = searchParams.get("id");

    if (id) {
      const order = await Order.findById(id).lean();
      return NextResponse.json({ order });
    }

    const query = {};
    if (status && status !== "all") query.orderStatus = status;

    const orders = await Order.find(query).sort({ createdAt: -1 }).lean();
    return NextResponse.json({ orders });
  } catch (error) {
    if (error.message === "Unauthorized") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function PUT(request) {
  try {
    await requireAdmin();
    await connectDB();
    const { id, orderStatus, awbCode, courierName, trackingUrl, createShipment } = await request.json();

    if (!id) {
      return NextResponse.json({ error: "Order ID required" }, { status: 400 });
    }

    const order = await Order.findById(id);
    if (!order) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }

    const previousStatus = order.orderStatus;
    const updates = {};

    if (orderStatus) updates.orderStatus = orderStatus;
    if (awbCode) updates.awbCode = awbCode;
    if (courierName) updates.courierName = courierName;
    if (trackingUrl) updates.trackingUrl = trackingUrl;

    // Create Shiprocket shipment if requested
    if (createShipment && order.shiprocketShipmentId) {
      try {
        const awbResult = await assignAWB(order.shiprocketShipmentId);
        const awbData = awbResult.response?.data || awbResult;
        if (awbData?.awb_code) {
          updates.awbCode = awbData.awb_code;
          updates.courierName = awbData.courier_name || "";
        }
      } catch (e) {
        console.error("AWB assignment failed:", e.message);
      }
    }

    if (orderStatus && orderStatus !== previousStatus) {
      updates.$push = {
        trackingEvents: {
          status: orderStatus,
          description: `Order status updated to ${orderStatus}`,
          timestamp: new Date(),
        },
      };
    }

    const updatedOrder = await Order.findByIdAndUpdate(id, updates, { new: true });

    // Send status emails
    if (orderStatus && orderStatus !== previousStatus) {
      if (orderStatus === "shipped" && !updatedOrder.statusEmailsSent?.shipped) {
        sendOrderShipped(updatedOrder).catch(console.error);
        await Order.findByIdAndUpdate(id, { "statusEmailsSent.shipped": true });
      }
      if (orderStatus === "out_for_delivery" && !updatedOrder.statusEmailsSent?.outForDelivery) {
        sendOutForDelivery(updatedOrder).catch(console.error);
        await Order.findByIdAndUpdate(id, { "statusEmailsSent.outForDelivery": true });
      }
      if (orderStatus === "delivered" && !updatedOrder.statusEmailsSent?.delivered) {
        sendOrderDelivered(updatedOrder).catch(console.error);
        await Order.findByIdAndUpdate(id, { "statusEmailsSent.delivered": true });
        if (!updatedOrder.reviewRequestSent) {
          setTimeout(() => {
            sendReviewRequest(updatedOrder).catch(console.error);
          }, 24 * 60 * 60 * 1000);
          await Order.findByIdAndUpdate(id, { reviewRequestSent: true });
        }
      }
    }

    return NextResponse.json({ order: updatedOrder });
  } catch (error) {
    if (error.message === "Unauthorized") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function DELETE(request) {
  try {
    await requireAdmin();
    await connectDB();
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json({ error: "Order ID required" }, { status: 400 });
    }

    const order = await Order.findByIdAndDelete(id);
    if (!order) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    if (error.message === "Unauthorized") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
