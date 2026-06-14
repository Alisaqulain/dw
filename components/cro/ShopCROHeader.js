"use client";

import Link from "next/link";
import { trackCTA } from "@/lib/analytics";

const STATS = [
  { value: "50K+", label: "Happy Customers" },
  { value: "4.8★", label: "Average Rating" },
  { value: "3–7 Days", label: "Fast Delivery" },
  { value: "100%", label: "Discreet Packaging" },
];

const BADGES = [
  { icon: "🔒", text: "Discreet Packaging" },
  { icon: "💰", text: "COD Available" },
  { icon: "🚚", text: "Fast Shipping" },
  { icon: "🛡", text: "Secure Checkout" },
];

export default function ShopCROHeader({ bestsellerSlug }) {
  return (
    <div className="mb-8 space-y-6">
      <div className="overflow-hidden rounded-2xl bg-gradient-to-br from-[#0c1929] via-[#1a2f4a] to-[#0c1929] p-6 text-white sm:p-8">
        <p className="text-xs font-bold uppercase tracking-widest text-sky-400">Premium Wellness Collection</p>
        <h2 className="mt-2 text-xl font-bold sm:text-2xl">Shop with Confidence — COD & Discreet Delivery</h2>
        <p className="mt-2 max-w-2xl text-sm text-slate-300">
          Body-safe silicone products trusted across India. Pay on delivery. Plain packaging guaranteed.
        </p>
        <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-4">
          {STATS.map(({ value, label }) => (
            <div key={label} className="rounded-xl bg-white/10 px-3 py-3 text-center ring-1 ring-white/10">
              <p className="text-lg font-bold text-sky-300">{value}</p>
              <p className="text-[10px] font-medium text-slate-400 sm:text-xs">{label}</p>
            </div>
          ))}
        </div>
        {bestsellerSlug && (
          <Link
            href={`/products/${bestsellerSlug}`}
            onClick={() => trackCTA("shop_bestseller_highlight", `/products/${bestsellerSlug}`)}
            className="mt-5 inline-flex items-center gap-2 rounded-full bg-emerald-500 px-5 py-2.5 text-sm font-bold text-white hover:bg-emerald-400"
          >
            🔥 Shop Best Seller →
          </Link>
        )}
      </div>

      <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
        {BADGES.map(({ icon, text }) => (
          <div key={text} className="flex items-center gap-2 rounded-xl bg-emerald-50 px-3 py-3 text-xs font-semibold text-emerald-800 ring-1 ring-emerald-100">
            <span>{icon}</span>
            <span className="leading-tight">{text}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
