"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useCart } from "@/context/CartContext";
import { useToast } from "@/context/ToastContext";
import { isLowStock } from "@/lib/utils";
import { getProductColors, getProductSizes } from "@/lib/productVariants";
import Stars from "@/components/ui/Stars";
import PriceDisplay, { getDiscountPercent } from "@/components/product/PriceDisplay";
import ProductImageSlider from "@/components/product/ProductImageSlider";
import VariantSelector, { validateVariantSelection } from "@/components/product/VariantSelector";

export default function QuickViewModal() {
  const { quickViewProduct, setQuickViewProduct, addToCart } = useCart();
  const { showToast } = useToast();
  const [qty, setQty] = useState(1);
  const [selectedColor, setSelectedColor] = useState("");
  const [selectedSize, setSelectedSize] = useState("");

  useEffect(() => {
    setQty(1);
    if (!quickViewProduct) {
      setSelectedColor("");
      setSelectedSize("");
      return;
    }
    const colors = getProductColors(quickViewProduct);
    const sizes = getProductSizes(quickViewProduct);
    setSelectedColor(colors.length === 1 ? colors[0].name : "");
    setSelectedSize(sizes.length === 1 ? sizes[0] : "");
  }, [quickViewProduct]);

  if (!quickViewProduct) return null;

  const p = quickViewProduct;
  const discount = getDiscountPercent(p.price, p.comparePrice);

  const handleAdd = () => {
    if (p.stock <= 0) { showToast("Out of stock", "error"); return; }
    const variantError = validateVariantSelection(p, selectedColor, selectedSize);
    if (variantError) { showToast(variantError, "error"); return; }
    addToCart(p, qty, { color: selectedColor, size: selectedSize });
    showToast("Added to bag!");
    setQuickViewProduct(null);
  };

  return (
    <>
      <div className="fixed inset-0 z-[80] bg-black/50 backdrop-blur-sm animate-fade-in" onClick={() => setQuickViewProduct(null)} />
      <div className="fixed inset-x-4 top-1/2 z-[90] mx-auto max-h-[90vh] max-w-lg -translate-y-1/2 overflow-y-auto rounded-3xl bg-white shadow-2xl animate-slide-up sm:inset-x-auto">
        <button onClick={() => setQuickViewProduct(null)} className="absolute right-4 top-4 z-10 flex h-8 w-8 items-center justify-center rounded-full bg-white/90 shadow hover:bg-white" aria-label="Close">
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
        </button>
        <div className="relative aspect-square bg-gradient-to-br from-sky-50 to-slate-50">
          <ProductImageSlider
            images={p.images}
            alt={p.name}
            sizes="500px"
            variant="detail"
            className="h-full w-full"
            badge={
              discount > 0 ? (
                <span className="rounded-full bg-red-500 px-3 py-1 text-xs font-bold text-white">{discount}% OFF</span>
              ) : null
            }
          />
        </div>
        <div className="p-6">
          <p className="text-xs font-semibold uppercase tracking-wider text-sky-500">{p.shopCollection || p.category}</p>
          <h2 className="mt-1 text-xl font-bold text-slate-900">{p.name}</h2>
          <div className="mt-2 flex items-center gap-2">
            <Stars rating={p.avgRating || 5} size="sm" showValue alwaysShow />
            <span className="text-xs text-slate-500">
              {p.reviewCount > 0 ? `(${p.reviewCount} reviews)` : "(5.0)"}
            </span>
          </div>
          <div className="mt-3">
            <PriceDisplay price={p.price} originalPrice={p.comparePrice} size="md" />
          </div>
          <p className="mt-3 line-clamp-3 text-sm text-slate-600">{p.shortDescription}</p>

          <div className="mt-4">
            <VariantSelector
              product={p}
              selectedColor={selectedColor}
              selectedSize={selectedSize}
              onColorChange={setSelectedColor}
              onSizeChange={setSelectedSize}
              compact
            />
          </div>

          {isLowStock(p.stock) && <p className="mt-2 text-xs font-medium text-orange-600">Only {p.stock} left!</p>}
          <div className="mt-5 flex items-center gap-3">
            <div className="flex items-center rounded-full border border-slate-200">
              <button onClick={() => setQty(Math.max(1, qty - 1))} className="px-3 py-2 text-slate-500">−</button>
              <span className="min-w-[32px] text-center font-medium">{qty}</span>
              <button onClick={() => setQty(Math.min(p.stock, qty + 1))} className="px-3 py-2 text-slate-500">+</button>
            </div>
            <button onClick={handleAdd} disabled={p.stock <= 0} className="flex-1 rounded-full bg-sky-500 py-2.5 text-sm font-semibold text-white hover:bg-sky-600 disabled:opacity-50">
              Add to Bag
            </button>
          </div>
          <Link href={`/products/${p.slug}`} onClick={() => setQuickViewProduct(null)} className="mt-3 block text-center text-sm font-medium text-sky-600 hover:text-sky-700">
            View Full Details →
          </Link>
        </div>
      </div>
    </>
  );
}
