"use client";

import Link from "next/link";
import Image from "next/image";
import { useCart } from "@/context/CartContext";
import { formatPrice } from "@/lib/utils";

export default function RecentlyViewed() {
  const { recentlyViewed, loaded } = useCart();

  if (!loaded || recentlyViewed.length === 0) return null;

  return (
    <section className="py-12">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <h2 className="text-xl font-bold text-slate-800">Recently Viewed</h2>
        <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-4">
          {recentlyViewed.map((product) => (
            <Link
              key={product._id}
              href={`/products/${product.slug}`}
              className="rounded-2xl bg-white p-3 shadow-sm ring-1 ring-sky-100 transition hover:shadow-md"
            >
              <div className="relative aspect-square overflow-hidden rounded-xl bg-sky-50">
                {product.image ? (
                  <Image src={product.image} alt={product.name} fill className="object-cover" sizes="150px" />
                ) : (
                  <div className="flex h-full items-center justify-center bg-sky-100" />
                )}
              </div>
              <p className="mt-2 line-clamp-1 text-sm font-medium text-slate-800">{product.name}</p>
              <p className="text-sm font-bold text-sky-600">{formatPrice(product.price)}</p>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
