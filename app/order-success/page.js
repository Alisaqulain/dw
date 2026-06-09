"use client";

import { Suspense, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { StatusBadge } from "@/components/shiprocket/DeliveryTimeline";
import { trackPurchase } from "@/lib/metaPixel";

function SuccessContent() {
  const searchParams = useSearchParams();
  const orderNumber = searchParams.get("order");
  const [order, setOrder] = useState(null);

  useEffect(() => {
    if (!orderNumber) return;
    fetch(`/api/orders?orderNumber=${orderNumber}`)
      .then((r) => r.json())
      .then((d) => { if (d.order) setOrder(d.order); })
      .catch(() => {});
  }, [orderNumber]);

  useEffect(() => {
    if (!order?.orderNumber) return;
    const key = `meta_pixel_purchase_${order.orderNumber}`;
    if (sessionStorage.getItem(key)) return;
    trackPurchase(order);
    sessionStorage.setItem(key, "1");
  }, [order]);

  return (
    <div className="mx-auto max-w-lg px-4 py-16 sm:py-20 text-center">
      <div className="mx-auto flex h-24 w-24 items-center justify-center rounded-full bg-gradient-to-br from-emerald-100 to-green-50 ring-4 ring-emerald-50">
        <svg className="h-12 w-12 text-emerald-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
        </svg>
      </div>
      <h1 className="mt-8 text-3xl font-bold text-slate-900">Order Confirmed!</h1>
      <p className="mt-3 text-slate-500 leading-relaxed">
        Thank you for shopping with TrustSilcon. Your order is confirmed and will ship in discreet packaging.
      </p>

      {orderNumber && (
        <div className="mt-8 rounded-2xl bg-gradient-to-br from-sky-50 to-blue-50 p-6 ring-1 ring-sky-100 text-left">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-sky-500">Order ID</p>
              <p className="mt-1 text-2xl font-bold text-slate-900 font-mono">{orderNumber}</p>
            </div>
            {order && <StatusBadge status={order.orderStatus} />}
          </div>
          {order?.deliveryStatus && (
            <div className="mt-4 flex items-center gap-2">
              <span className="text-xs text-slate-500">Delivery:</span>
              <StatusBadge status={order.deliveryStatus} type="delivery" />
            </div>
          )}
          {order?.awbCode && (
            <p className="mt-3 text-sm text-slate-600">AWB: <span className="font-mono font-semibold">{order.awbCode}</span></p>
          )}
        </div>
      )}

      <p className="mt-5 text-sm text-slate-400">A confirmation email has been sent to your inbox.</p>

      <div className="mt-10 flex flex-col gap-3 sm:flex-row sm:justify-center">
        <Link href={`/track-order?order=${orderNumber || ""}`} className="inline-flex items-center justify-center rounded-full bg-[#0c1929] px-8 py-3.5 text-sm font-semibold text-white hover:bg-[#1e3a5f]">
          Track Order
        </Link>
        <Link href="/shop" className="inline-flex items-center justify-center rounded-full border-2 border-sky-200 px-8 py-3.5 text-sm font-semibold text-sky-600 hover:bg-sky-50">
          Continue Shopping
        </Link>
      </div>
    </div>
  );
}

export default function OrderSuccessPage() {
  return (
    <Suspense fallback={<div className="py-20 text-center">Loading...</div>}>
      <SuccessContent />
    </Suspense>
  );
}
