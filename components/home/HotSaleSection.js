"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import ProductCard from "@/components/product/ProductCard";
import { RevealSection } from "@/hooks/useReveal";

function getEndOfDay() {
  const end = new Date();
  end.setHours(23, 59, 59, 999);
  return end.getTime();
}

function formatCountdown(ms) {
  if (ms <= 0) return { h: "00", m: "00", s: "00" };
  const s = Math.floor(ms / 1000);
  const h = Math.floor(s / 3600);
  const m = Math.floor((s % 3600) / 60);
  const sec = s % 60;
  return {
    h: String(h).padStart(2, "0"),
    m: String(m).padStart(2, "0"),
    s: String(sec).padStart(2, "0"),
  };
}

export default function HotSaleSection({ products }) {
  const [remaining, setRemaining] = useState(0);

  useEffect(() => {
    const tick = () => setRemaining(Math.max(0, getEndOfDay() - Date.now()));
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);

  if (!products?.length) return null;

  const { h, m, s } = formatCountdown(remaining);

  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-rose-50 via-orange-50/50 to-amber-50 py-12 sm:py-16">
      <div className="pointer-events-none absolute -right-20 top-0 h-64 w-64 rounded-full bg-rose-200/40 blur-3xl" />
      <div className="pointer-events-none absolute -left-20 bottom-0 h-64 w-64 rounded-full bg-orange-200/40 blur-3xl" />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <RevealSection className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <span className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-rose-500 to-orange-500 px-4 py-1.5 text-xs font-bold uppercase tracking-wider text-white shadow-lg shadow-rose-200">
              🔥 Hot Sale
            </span>
            <h2 className="mt-4 text-3xl font-bold text-slate-900 sm:text-4xl">
              Flash Deals — Save Big Today
            </h2>
            <p className="mt-2 max-w-xl text-slate-600">
              Hand-picked wellness products at the best prices. Limited stock — grab yours before midnight.
            </p>
          </div>

          <div className="flex items-center gap-3 rounded-2xl bg-white/80 p-4 shadow-lg ring-1 ring-rose-100 backdrop-blur-sm">
            <span className="text-xs font-bold uppercase tracking-wider text-rose-600">Ends in</span>
            <div className="flex gap-2">
              {[
                { val: h, label: "Hrs" },
                { val: m, label: "Min" },
                { val: s, label: "Sec" },
              ].map((unit) => (
                <div key={unit.label} className="flex flex-col items-center">
                  <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#0c1929] text-lg font-bold text-white tabular-nums">
                    {unit.val}
                  </span>
                  <span className="mt-1 text-[10px] font-semibold text-slate-500">{unit.label}</span>
                </div>
              ))}
            </div>
          </div>
        </RevealSection>

        <div className="mt-10 grid grid-cols-2 gap-4 sm:gap-5 md:grid-cols-3 lg:grid-cols-4">
          {products.slice(0, 8).map((p, i) => (
            <RevealSection key={p._id} delay={i * 60}>
              <div className="relative">
                <div className="absolute -inset-0.5 rounded-2xl bg-gradient-to-r from-rose-400 to-orange-400 opacity-0 blur transition group-hover:opacity-20" />
                <ProductCard product={p} />
              </div>
            </RevealSection>
          ))}
        </div>

        <div className="mt-10 text-center">
          <Link
            href="/shop?sort=sale"
            className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-rose-500 to-orange-500 px-10 py-4 text-sm font-bold text-white shadow-xl shadow-rose-200/50 transition hover:scale-[1.02] hover:shadow-rose-300/60"
          >
            View All Hot Deals
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </Link>
        </div>
      </div>
    </section>
  );
}
