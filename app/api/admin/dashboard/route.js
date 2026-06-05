import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import { requireAdmin } from "@/lib/auth";
import Product from "@/models/Product";
import Order from "@/models/Order";
import Review from "@/models/Review";
import ContactLead from "@/models/ContactLead";

export async function GET() {
  try {
    await requireAdmin();
    await connectDB();

    const [
      totalOrders,
      pendingOrders,
      shippedOrders,
      deliveredOrders,
      revenueResult,
      lowStockProducts,
      pendingReviews,
      newLeads,
    ] = await Promise.all([
      Order.countDocuments(),
      Order.countDocuments({ orderStatus: { $in: ["pending", "confirmed", "processing"] } }),
      Order.countDocuments({ orderStatus: { $in: ["shipped", "out_for_delivery"] } }),
      Order.countDocuments({ orderStatus: "delivered" }),
      Order.aggregate([
        { $match: { orderStatus: { $ne: "cancelled" } } },
        { $group: { _id: null, total: { $sum: "$total" } } },
      ]),
      Product.find({ stock: { $lte: 5, $gt: 0 }, active: true }).limit(10).lean(),
      Review.countDocuments({ approved: false }),
      ContactLead.countDocuments({ status: "new" }),
    ]);

    const totalRevenue = revenueResult[0]?.total || 0;

    const recentOrders = await Order.find()
      .sort({ createdAt: -1 })
      .limit(5)
      .lean();

    return NextResponse.json({
      stats: {
        totalOrders,
        pendingOrders,
        shippedOrders,
        deliveredOrders,
        totalRevenue,
        pendingReviews,
        newLeads,
      },
      lowStockProducts,
      recentOrders,
    });
  } catch (error) {
    if (error.message === "Unauthorized") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
