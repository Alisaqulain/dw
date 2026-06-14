"use client";

import Link from "next/link";
import ProductCard from "@/components/product/ProductCard";
import { RevealSection } from "@/hooks/useReveal";

export default function BestSellersSection({ products }) {
  const items = products?.length >= 8 ? products.slice(0, 8) : products;

  if (!items?.length) return null;

  return (
    <section className="bg-gradient-to-b from-white to-sky-50/40 py-12 sm:py-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <RevealSection className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <span className="text-xs font-bold uppercase tracking-widest text-amber-600">🔥 Best Sellers</span>
            <h2 className="mt-2 text-2xl font-bold text-slate-900 sm:text-3xl">Most Loved Products</h2>
            <p className="mt-1 text-slate-500">Top picks with COD, discreet packaging & fast delivery</p>
          </div>
          <Link href="/shop?sort=bestseller" className="rounded-full bg-[#0c1929] px-6 py-2.5 text-sm font-semibold text-white hover:bg-[#1e3a5f]">
            View All →
          </Link>
        </RevealSection>

        <div className="mt-8 grid grid-cols-2 gap-3 sm:gap-5 md:grid-cols-3 lg:grid-cols-4">
          {items.map((p, i) => (
            <RevealSection key={p._id} delay={i * 40}>
              <ProductCard product={p} variant="bestseller" />
            </RevealSection>
          ))}
        </div>
      </div>
    </section>
  );
}
