"use client";

import { useEffect, useState } from "react";
import { formatPrice } from "@/lib/utils";
import Link from "next/link";

function StatCard({ label, value, color }) {
  return (
    <div className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
      <p className="text-sm text-slate-500">{label}</p>
      <p className={`mt-2 text-3xl font-bold ${color || "text-slate-800"}`}>{value}</p>
    </div>
  );
}

function FunnelBar({ label, value, max, color }) {
  const pct = max > 0 ? Math.round((value / max) * 100) : 0;
  return (
    <div>
      <div className="flex justify-between text-sm">
        <span className="text-slate-600">{label}</span>
        <span className="font-semibold text-slate-800">{value.toLocaleString("en-IN")}</span>
      </div>
      <div className="mt-1.5 h-2 overflow-hidden rounded-full bg-slate-100">
        <div className={`h-full rounded-full ${color}`} style={{ width: `${Math.max(pct, 2)}%` }} />
      </div>
    </div>
  );
}

export default function AdminDashboardPage() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/admin/dashboard")
      .then((r) => r.json())
      .then((d) => { setData(d); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  if (loading) return <p className="text-slate-500">Loading dashboard...</p>;
  if (!data?.stats) return <p className="text-red-500">Failed to load dashboard</p>;

  const { stats, funnel, lowStockProducts, recentOrders, topProducts } = data;

  const seedData = async () => {
    const res = await fetch("/api/admin/seed", { method: "POST" });
    const result = await res.json();
    alert(result.message || result.error);
  };

  return (
    <div>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Dashboard</h1>
          <p className="text-slate-500">Funnel analytics & store overview (last 30 days)</p>
        </div>
        <button onClick={seedData} className="rounded-xl bg-slate-800 px-4 py-2 text-sm font-medium text-white hover:bg-slate-700">
          Seed Sample Data
        </button>
      </div>

      <div className="mt-8 rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
        <h2 className="font-bold text-slate-800">Conversion Funnel</h2>
        <div className="mt-4 space-y-4">
          <FunnelBar label="Visitors" value={funnel?.visitors || 0} max={funnel?.visitors || 1} color="bg-sky-500" />
          <FunnelBar label="Product Views" value={funnel?.productViews || 0} max={funnel?.visitors || 1} color="bg-cyan-500" />
          <FunnelBar label="Add to Cart" value={funnel?.addToCart || 0} max={funnel?.visitors || 1} color="bg-indigo-500" />
          <FunnelBar label="Checkout Started" value={funnel?.checkoutStarted || 0} max={funnel?.visitors || 1} color="bg-violet-500" />
          <FunnelBar label="Orders" value={funnel?.orders || 0} max={funnel?.visitors || 1} color="bg-emerald-500" />
        </div>
        <p className="mt-4 text-sm text-slate-500">
          Conversion rate: <span className="font-bold text-emerald-600">{stats.conversionRate || 0}%</span>
          {" · "}
          Abandoned checkouts: <span className="font-bold text-orange-600">{stats.abandonedCarts || 0}</span>
        </p>
      </div>

      <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Total Orders" value={stats.totalOrders} />
        <StatCard label="Visitors (30d)" value={stats.visitors || 0} color="text-sky-600" />
        <StatCard label="Product Views" value={stats.productViews || 0} color="text-cyan-600" />
        <StatCard label="Add to Cart" value={stats.addToCartCount || 0} color="text-indigo-600" />
      </div>

      <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Pending Orders" value={stats.pendingOrders} color="text-yellow-600" />
        <StatCard label="Total Revenue" value={formatPrice(stats.totalRevenue)} color="text-emerald-600" />
        <StatCard label="Pending Reviews" value={stats.pendingReviews} color="text-amber-600" />
        <StatCard label="Abandoned Carts" value={stats.abandonedCarts || 0} color="text-orange-600" />
      </div>

      <div className="mt-8 grid gap-6 lg:grid-cols-2">
        <div className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
          <h2 className="font-bold text-slate-800">Top Products (30d)</h2>
          {topProducts?.length === 0 ? (
            <p className="mt-4 text-sm text-slate-500">No product view data yet</p>
          ) : (
            <div className="mt-4 space-y-3">
              {topProducts?.map((p) => (
                <div key={p._id} className="flex items-center justify-between rounded-xl bg-slate-50 px-4 py-3">
                  <span className="text-sm font-medium">{p._id}</span>
                  <span className="text-sm text-sky-600">{p.views} views</span>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
          <h2 className="font-bold text-slate-800">Recent Orders</h2>
          <div className="mt-4 space-y-3">
            {recentOrders?.map((order) => (
              <div key={order._id} className="flex items-center justify-between rounded-xl bg-slate-50 px-4 py-3">
                <div>
                  <p className="text-sm font-medium">{order.orderNumber}</p>
                  <p className="text-xs text-slate-500">{order.customerName}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-semibold">{formatPrice(order.total)}</p>
                  <p className="text-xs capitalize text-slate-500">{order.orderStatus?.replace(/_/g, " ")}</p>
                </div>
              </div>
            ))}
          </div>
          <Link href="/admin/orders" className="mt-4 inline-block text-sm text-sky-500">View all →</Link>
        </div>

        <div className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-200 lg:col-span-2">
          <h2 className="font-bold text-slate-800">Low Stock Products</h2>
          {lowStockProducts?.length === 0 ? (
            <p className="mt-4 text-sm text-slate-500">All products well stocked</p>
          ) : (
            <div className="mt-4 grid gap-3 sm:grid-cols-2">
              {lowStockProducts.map((p) => (
                <div key={p._id} className="flex items-center justify-between rounded-xl bg-orange-50 px-4 py-3">
                  <p className="text-sm font-medium">{p.name}</p>
                  <span className="rounded-lg bg-orange-200 px-2 py-0.5 text-xs font-semibold text-orange-700">{p.stock} left</span>
                </div>
              ))}
            </div>
          )}
          <Link href="/admin/products" className="mt-4 inline-block text-sm text-sky-500">Manage products →</Link>
        </div>
      </div>
    </div>
  );
}
