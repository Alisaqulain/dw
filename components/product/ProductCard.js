"use client";

import Link from "next/link";
import Image from "next/image";
import { useCart } from "@/context/CartContext";
import { useToast } from "@/context/ToastContext";
import { formatPrice, isLowStock } from "@/lib/utils";
import Stars from "@/components/ui/Stars";

export default function ProductCard({ product, variant = "default" }) {
  const { addToCart, setQuickViewProduct } = useCart();
  const { showToast } = useToast();

  const hasDiscount = product.comparePrice > product.price;
  const discountPercent = hasDiscount ? Math.round(((product.comparePrice - product.price) / product.comparePrice) * 100) : 0;

  const handleAdd = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (product.stock <= 0) { showToast("Out of stock", "error"); return; }
    addToCart(product, 1);
    showToast("Added to bag!");
  };

  const handleQuickView = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setQuickViewProduct(product);
  };

  return (
    <div className="product-card group relative flex flex-col overflow-hidden rounded-2xl bg-white ring-1 ring-slate-100 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-sky-100/60">
      <Link href={`/products/${product.slug}`} className="relative block aspect-[4/5] overflow-hidden bg-gradient-to-br from-slate-50 to-sky-50/30">
        {product.images?.[0]?.url ? (
          <Image
            src={product.images[0].url}
            alt={product.name}
            fill
            className="product-image object-cover transition-transform duration-500"
            sizes="(max-width:768px) 50vw, 25vw"
          />
        ) : (
          <div className="flex h-full items-center justify-center">
            <div className="h-20 w-20 rounded-full bg-gradient-to-br from-sky-200 to-blue-200 opacity-40" />
          </div>
        )}

        {/* Badges */}
        <div className="absolute left-2.5 top-2.5 flex flex-col gap-1">
          {discountPercent > 0 && (
            <span className="rounded-md bg-red-500 px-2 py-0.5 text-[10px] font-bold text-white shadow-sm">{discountPercent}% OFF</span>
          )}
          {product.bestseller && (
            <span className="rounded-md bg-amber-400 px-2 py-0.5 text-[10px] font-bold text-white shadow-sm">BESTSELLER</span>
          )}
          {product.dealOfDay && (
            <span className="rounded-md bg-violet-500 px-2 py-0.5 text-[10px] font-bold text-white shadow-sm">DEAL</span>
          )}
          {isLowStock(product.stock) && (
            <span className="rounded-md bg-orange-500 px-2 py-0.5 text-[10px] font-bold text-white shadow-sm">LOW STOCK</span>
          )}
        </div>

        {/* Hover actions */}
        <div className="product-actions absolute inset-x-2.5 bottom-2.5 flex gap-2 opacity-0 translate-y-2 transition-all duration-300">
          <button onClick={handleAdd} className="flex-1 rounded-full bg-[#0c1929] py-2 text-xs font-semibold text-white shadow-lg hover:bg-[#1e3a5f]">
            Add to Bag
          </button>
          <button onClick={handleQuickView} className="rounded-full bg-white/95 px-3 py-2 text-xs font-semibold text-slate-700 shadow-lg backdrop-blur hover:bg-white">
            Quick View
          </button>
        </div>
      </Link>

      <div className="flex flex-1 flex-col p-3.5 sm:p-4">
        <p className="text-[10px] font-semibold uppercase tracking-wider text-sky-500">{product.shopCollection || product.category}</p>
        <Link href={`/products/${product.slug}`}>
          <h3 className="mt-1 line-clamp-2 text-sm font-semibold leading-snug text-slate-800 transition hover:text-sky-600">{product.name}</h3>
        </Link>

        {(product.avgRating > 0 || product.reviewCount > 0) && (
          <div className="mt-1.5 flex items-center gap-1.5">
            <Stars rating={product.avgRating || 0} size="xs" />
            {product.reviewCount > 0 && <span className="text-[10px] text-slate-400">({product.reviewCount})</span>}
          </div>
        )}

        <div className="mt-auto flex items-center gap-2 pt-2.5">
          <span className="text-base font-bold text-slate-900">{formatPrice(product.price)}</span>
          {hasDiscount && <span className="text-xs text-slate-400 line-through">{formatPrice(product.comparePrice)}</span>}
        </div>

        {/* Mobile always-visible add button */}
        <button onClick={handleAdd} className="mt-2.5 w-full min-h-[40px] rounded-full bg-[#0c1929] py-2.5 text-xs font-semibold text-white transition active:scale-[0.98] lg:hidden">
          Add to Bag
        </button>
      </div>
    </div>
  );
}
