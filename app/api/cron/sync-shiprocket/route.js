import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import Order from "@/models/Order";
import { isShiprocketConfigured, syncOrderTracking } from "@/lib/shiprocket";

import { verifyCronRequest } from "@/lib/cronAuth";

export async function GET(request) {
  const auth = verifyCronRequest(request);
  if (!auth.ok) {
    return NextResponse.json({ error: auth.error }, { status: auth.status });
  }

  if (!isShiprocketConfigured()) {
    return NextResponse.json({ message: "Shiprocket not configured, skipped" });
  }

  try {
    await connectDB();

    const orders = await Order.find({
      $or: [
        { shiprocketOrderId: { $ne: "" } },
        { shipmentId: { $ne: "" } },
        { awbCode: { $ne: "" } },
      ],
      deliveryStatus: { $nin: ["DELIVERED", "CANCELLED", "RTO"] },
    }).limit(200);

    let synced = 0;
    let failed = 0;

    for (const order of orders) {
      const result = await syncOrderTracking(order);
      if (result.success) {
        await Order.findByIdAndUpdate(order._id, result.updates);
        synced++;
      } else {
        await Order.findByIdAndUpdate(order._id, { shiprocketError: result.error });
        failed++;
      }
    }

    console.log(`[Shiprocket Cron] Synced ${synced}, failed ${failed} of ${orders.length}`);

    return NextResponse.json({
      success: true,
      total: orders.length,
      synced,
      failed,
    });
  } catch (error) {
    console.error("[Shiprocket Cron] Error:", error.message);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
