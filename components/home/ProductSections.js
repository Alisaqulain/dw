"use client";

import { useRef } from "react";
import Link from "next/link";
import ProductCard from "@/components/product/ProductCard";
import { RevealSection } from "@/hooks/useReveal";

export default function ProductCarousel({ title, subtitle, products, viewAllHref = "/shop" }) {
  const scrollRef = useRef(null);

  const scroll = (dir) => {
    if (!scrollRef.current) return;
    scrollRef.current.scrollBy({ left: dir * 280, behavior: "smooth" });
  };

  if (!products?.length) return null;

  return (
    <section className="py-12 sm:py-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <RevealSection className="flex items-end justify-between">
          <div>
            <h2 className="text-2xl font-bold text-slate-900 sm:text-3xl">{title}</h2>
            {subtitle && <p className="mt-1 text-slate-500">{subtitle}</p>}
          </div>
          <div className="hidden items-center gap-2 sm:flex">
            <button onClick={() => scroll(-1)} className="flex h-10 w-10 items-center justify-center rounded-full bg-white text-slate-700 shadow-md ring-1 ring-slate-200 transition hover:bg-sky-50 hover:text-sky-600 hover:ring-sky-200" aria-label="Previous">
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
            </button>
            <button onClick={() => scroll(1)} className="flex h-10 w-10 items-center justify-center rounded-full bg-white text-slate-700 shadow-md ring-1 ring-slate-200 transition hover:bg-sky-50 hover:text-sky-600 hover:ring-sky-200" aria-label="Next">
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
            </button>
            <Link href={viewAllHref} className="ml-2 text-sm font-semibold text-sky-600 hover:text-sky-700">View All →</Link>
          </div>
        </RevealSection>

        <div ref={scrollRef} className="-mx-1 mt-8 flex gap-3 overflow-x-auto px-1 pb-3 scrollbar-hide snap-x snap-mandatory sm:gap-4">
          {products.map((p) => (
            <div key={p._id} className="w-[44vw] max-w-[200px] shrink-0 snap-start sm:w-[240px] sm:max-w-none">
              <ProductCard product={p} />
            </div>
          ))}
        </div>

        <div className="mt-4 text-center sm:hidden">
          <Link href={viewAllHref} className="text-sm font-semibold text-sky-600">View All →</Link>
        </div>
      </div>
    </section>
  );
}

export function ProductGrid({ title, subtitle, products, viewAllHref, columns = 4 }) {
  if (!products?.length) return null;
  const cols = { 3: "lg:grid-cols-3", 4: "lg:grid-cols-4" };

  return (
    <section className="py-12 sm:py-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <RevealSection className="flex items-end justify-between">
          <div>
            <h2 className="text-2xl font-bold text-slate-900 sm:text-3xl">{title}</h2>
            {subtitle && <p className="mt-1 text-slate-500">{subtitle}</p>}
          </div>
          {viewAllHref && <Link href={viewAllHref} className="text-sm font-semibold text-sky-600 hover:text-sky-700">View All →</Link>}
        </RevealSection>
        <div className={`mt-8 grid grid-cols-2 gap-4 sm:gap-5 md:grid-cols-3 ${cols[columns] || cols[4]}`}>
          {products.map((p) => <ProductCard key={p._id} product={p} />)}
        </div>
      </div>
    </section>
  );
}
