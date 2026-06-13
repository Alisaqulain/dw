import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import { requireAdmin } from "@/lib/auth";
import Product from "@/models/Product";
import Order from "@/models/Order";
import Review from "@/models/Review";
import ContactLead from "@/models/ContactLead";
import AnalyticsEvent from "@/models/AnalyticsEvent";
import AbandonedCart from "@/models/AbandonedCart";

export async function GET() {
  try {
    await requireAdmin();
    await connectDB();

    const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);

    const [
      totalOrders,
      pendingOrders,
      shippedOrders,
      deliveredOrders,
      revenueResult,
      lowStockProducts,
      pendingReviews,
      newLeads,
      visitors,
      productViews,
      addToCartCount,
      checkoutStartedCount,
      abandonedCarts,
      topProductsAgg,
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
      AnalyticsEvent.distinct("sessionId", { eventType: "page_view", createdAt: { $gte: thirtyDaysAgo } }).then((s) => s.length),
      AnalyticsEvent.countDocuments({ eventType: "product_view", createdAt: { $gte: thirtyDaysAgo } }),
      AnalyticsEvent.countDocuments({ eventType: "add_to_cart", createdAt: { $gte: thirtyDaysAgo } }),
      AnalyticsEvent.countDocuments({ eventType: "initiate_checkout", createdAt: { $gte: thirtyDaysAgo } }),
      AbandonedCart.countDocuments({ converted: false, checkoutStarted: true }),
      AnalyticsEvent.aggregate([
        { $match: { eventType: "product_view", createdAt: { $gte: thirtyDaysAgo }, productName: { $ne: "" } } },
        { $group: { _id: "$productName", views: { $sum: 1 }, productSlug: { $first: "$productSlug" } } },
        { $sort: { views: -1 } },
        { $limit: 5 },
      ]),
    ]);

    const totalRevenue = revenueResult[0]?.total || 0;
    const conversionRate = visitors > 0 ? Math.round((totalOrders / visitors) * 10000) / 100 : 0;

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
        visitors,
        productViews,
        addToCartCount,
        checkoutStartedCount,
        abandonedCarts,
        conversionRate,
      },
      funnel: {
        visitors,
        productViews,
        addToCart: addToCartCount,
        checkoutStarted: checkoutStartedCount,
        orders: totalOrders,
        conversionRate,
      },
      topProducts: topProductsAgg,
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
