"use client";

import Link from "next/link";
import Image from "next/image";
import ProductCard from "@/components/product/ProductCard";
import { formatPrice } from "@/lib/utils";
import { RevealSection } from "@/hooks/useReveal";

export default function DealOfDay({ product }) {
  if (!product) return null;
  const discount = product.comparePrice > product.price
    ? Math.round(((product.comparePrice - product.price) / product.comparePrice) * 100) : 0;

  return (
    <section className="bg-gradient-to-br from-violet-50 via-white to-sky-50 py-12 sm:py-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <RevealSection>
          <div className="overflow-hidden rounded-3xl bg-white shadow-xl ring-1 ring-violet-100">
            <div className="grid lg:grid-cols-2">
              <div className="relative aspect-square bg-gradient-to-br from-violet-100 to-sky-100 lg:aspect-auto lg:min-h-[400px]">
                {product.images?.[0]?.url && (
                  <Image src={product.images[0].url} alt={product.name} fill className="object-cover" sizes="50vw" />
                )}
                <span className="absolute left-4 top-4 rounded-full bg-violet-600 px-4 py-1.5 text-xs font-bold text-white">⚡ DEAL OF THE DAY</span>
              </div>
              <div className="flex flex-col justify-center p-8 sm:p-12">
                <p className="text-xs font-bold uppercase tracking-widest text-violet-600">Limited Time Offer</p>
                <h2 className="mt-2 text-2xl font-bold text-slate-900 sm:text-3xl">{product.name}</h2>
                <p className="mt-3 text-slate-600">{product.shortDescription}</p>
                <div className="mt-6 flex items-baseline gap-3">
                  <span className="text-3xl font-bold text-slate-900">{formatPrice(product.price)}</span>
                  {product.comparePrice > product.price && (
                    <>
                      <span className="text-lg text-slate-400 line-through">{formatPrice(product.comparePrice)}</span>
                      <span className="rounded-full bg-red-100 px-3 py-1 text-sm font-bold text-red-600">{discount}% OFF</span>
                    </>
                  )}
                </div>
                <Link href={`/products/${product.slug}`} className="mt-8 inline-flex w-fit items-center rounded-full bg-violet-600 px-8 py-3.5 text-sm font-semibold text-white hover:bg-violet-700">
                  Grab This Deal →
                </Link>
              </div>
            </div>
          </div>
        </RevealSection>
      </div>
    </section>
  );
}

export function BundleSection({ products }) {
  if (!products?.length) return null;
  return (
    <section className="bg-[#0c1929] py-12 sm:py-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <RevealSection className="text-center">
          <span className="text-xs font-bold uppercase tracking-widest text-sky-400">Save More</span>
          <h2 className="mt-2 text-2xl font-bold text-white sm:text-3xl">Bundle & Save</h2>
          <p className="mt-2 text-slate-400">Curated combos at special prices</p>
        </RevealSection>
        <div className="mt-8 grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
          {products.map((p) => (
            <div key={p._id} className="rounded-2xl bg-white/5 p-1 ring-1 ring-white/10">
              <ProductCard product={p} />
            </div>
          ))}
        </div>
        <div className="mt-8 text-center">
          <Link href="/shop?isBundle=true" className="inline-flex rounded-full border border-sky-400/50 px-8 py-3 text-sm font-semibold text-sky-300 hover:bg-sky-400/10">
            View All Combos →
          </Link>
        </div>
      </div>
    </section>
  );
}
