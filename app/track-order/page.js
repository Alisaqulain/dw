"use client";

import { useState, Suspense, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { formatPrice } from "@/lib/utils";
import { StatusBadge, DeliveryTimeline } from "@/components/shiprocket/DeliveryTimeline";

function TrackContent() {
  const searchParams = useSearchParams();
  const [orderNumber, setOrderNumber] = useState(searchParams.get("order") || "");
  const [phone, setPhone] = useState("");
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const fetchTracking = async (num, ph) => {
    setLoading(true);
    setError("");
    setResult(null);
    const params = new URLSearchParams({ orderNumber: num });
    if (ph) params.set("phone", ph);
    const res = await fetch(`/api/shiprocket/track?${params}`);
    const data = await res.json();
    setLoading(false);
    if (res.ok) {
      setResult(data);
    } else {
      setError(data.error || "Order not found");
    }
  };

  useEffect(() => {
    const order = searchParams.get("order");
    if (order) setOrderNumber(order);
  }, [searchParams]);

  const handleTrack = (e) => {
    e.preventDefault();
    if (!phone.trim()) {
      setError("Phone number is required for verification");
      return;
    }
    fetchTracking(orderNumber, phone);
  };

  const order = result?.order;
  const timeline = result?.timeline?.length ? result.timeline : order?.trackingEvents || [];

  return (
    <div className="mx-auto max-w-2xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="text-center">
        <span className="text-xs font-bold uppercase tracking-widest text-sky-500">Order Tracking</span>
        <h1 className="mt-2 text-3xl font-bold text-slate-900">Track Your Order</h1>
        <p className="mt-2 text-slate-500">Enter your order ID and phone number to see delivery status</p>
      </div>

      <form onSubmit={handleTrack} className="mt-8 rounded-2xl bg-white p-6 shadow-sm ring-1 ring-sky-100">
        <div className="space-y-4">
          <div>
            <label className="text-xs font-semibold text-slate-600">Order ID *</label>
            <input required value={orderNumber} onChange={(e) => setOrderNumber(e.target.value)} placeholder="TS-XXXXXX" className="mt-1.5 w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-sky-400 focus:ring-2 focus:ring-sky-100" />
          </div>
          <div>
            <label className="text-xs font-semibold text-slate-600">Phone Number *</label>
            <input required value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="10-digit mobile used at checkout" className="mt-1.5 w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-sky-400 focus:ring-2 focus:ring-sky-100" />
          </div>
        </div>
        <button type="submit" disabled={loading} className="mt-6 w-full rounded-full bg-[#0c1929] py-3.5 text-sm font-semibold text-white hover:bg-[#1e3a5f] disabled:opacity-50">
          {loading ? "Tracking..." : "Track Order"}
        </button>
      </form>

      {error && (
        <div className="mt-4 rounded-xl bg-red-50 px-4 py-3 text-center text-sm text-red-600 ring-1 ring-red-100">{error}</div>
      )}

      {order && (
        <div className="mt-8 space-y-6">
          <div className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-sky-100">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <p className="text-xs text-slate-500">Order ID</p>
                <p className="text-xl font-bold text-slate-900 font-mono">{order.orderNumber}</p>
              </div>
              <div className="flex flex-wrap gap-2">
                <StatusBadge status={order.orderStatus} />
                {order.deliveryStatus && <StatusBadge status={order.deliveryStatus} type="delivery" />}
              </div>
            </div>

            <div className="mt-5 grid grid-cols-2 gap-4 text-sm border-t border-slate-50 pt-5">
              <div><p className="text-slate-500">Total</p><p className="font-semibold">{formatPrice(order.total)}</p></div>
              <div><p className="text-slate-500">Payment</p><p className="font-semibold">{order.paymentMethod}</p></div>
              {order.courierName && <div><p className="text-slate-500">Courier</p><p className="font-semibold">{order.courierName}</p></div>}
              {order.awbCode && <div><p className="text-slate-500">AWB Code</p><p className="font-mono font-semibold">{order.awbCode}</p></div>}
            </div>

            {order.trackingUrl && (
              <a href={order.trackingUrl} target="_blank" rel="noopener noreferrer" className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-sky-600 hover:text-sky-700">
                View on courier website →
              </a>
            )}
          </div>

          <div className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-sky-100">
            <h3 className="font-bold text-slate-900">Delivery Timeline</h3>
            <div className="mt-5">
              <DeliveryTimeline events={[...timeline].reverse()} currentStatus={order.deliveryStatus} />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default function TrackOrderPage() {
  return (
    <Suspense fallback={<div className="py-20 text-center">Loading...</div>}>
      <TrackContent />
    </Suspense>
  );
}
