"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCart } from "@/context/CartContext";
import { useToast } from "@/context/ToastContext";
import { isLowStock } from "@/lib/utils";
import { trackCTA } from "@/lib/analytics";
import Stars from "@/components/ui/Stars";
import PriceDisplay, { getDiscountPercent } from "@/components/product/PriceDisplay";
import ProductImageSlider from "@/components/product/ProductImageSlider";
import { productHasVariantOptions } from "@/lib/productVariants";

export default function ProductCard({ product, variant = "default" }) {
  const { addToCart, setQuickViewProduct } = useCart();
  const { showToast } = useToast();
  const router = useRouter();

  const discountPercent = getDiscountPercent(product.price, product.comparePrice);
  const hasVariants = productHasVariantOptions(product);
  const rating = product.avgRating || 4.8;
  const reviewCount = product.reviewCount || 0;

  const handleAdd = (e, openDrawer = true) => {
    e.preventDefault();
    e.stopPropagation();
    if (product.stock <= 0) { showToast("Out of stock", "error"); return; }
    if (hasVariants) {
      setQuickViewProduct(product);
      trackCTA("product_card_quick_view", product.slug);
      return;
    }
    addToCart(product, 1, {}, openDrawer);
    trackCTA("product_card_add_to_cart", product.slug);
    showToast("Added to bag!");
  };

  const handleBuyNow = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (product.stock <= 0) { showToast("Out of stock", "error"); return; }
    if (hasVariants) {
      setQuickViewProduct(product);
      return;
    }
    addToCart(product, 1, {}, false);
    trackCTA("product_card_buy_now", product.slug);
    router.push("/checkout");
  };

  const handleProductClick = () => {
    trackCTA("product_card_click", product.slug);
  };

  return (
    <article className="product-card group relative flex flex-col overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-slate-100 transition-all duration-300 hover:-translate-y-1.5 hover:shadow-xl hover:shadow-sky-100/80 hover:ring-sky-200">
      <Link href={`/products/${product.slug}`} onClick={handleProductClick} className="relative block aspect-[3/4] overflow-hidden bg-gradient-to-br from-slate-50 to-sky-50/40">
        <ProductImageSlider
          images={product.images}
          alt={product.name}
          variant="card"
          className="absolute inset-0 size-full transition duration-500 group-hover:scale-[1.03]"
          badge={
            <div className="absolute left-2 top-2 z-20 flex flex-col gap-1">
              {discountPercent > 0 && (
                <span className="rounded-lg bg-red-500 px-2 py-0.5 text-[10px] font-bold text-white shadow-md">Save {discountPercent}%</span>
              )}
              {product.bestseller && (
                <span className="rounded-lg bg-amber-500 px-2 py-0.5 text-[10px] font-bold text-white shadow-md">BESTSELLER</span>
              )}
            </div>
          }
        />

        <div className="absolute bottom-2 left-2 right-2 z-20 flex flex-wrap gap-1">
          <span className="rounded-md bg-emerald-500/95 px-1.5 py-0.5 text-[9px] font-bold text-white backdrop-blur-sm">COD</span>
          <span className="rounded-md bg-slate-800/85 px-1.5 py-0.5 text-[9px] font-bold text-white backdrop-blur-sm">Discreet</span>
          <span className="rounded-md bg-sky-500/95 px-1.5 py-0.5 text-[9px] font-bold text-white backdrop-blur-sm">Fast Ship</span>
        </div>

        <div className="product-actions absolute inset-x-2 bottom-12 hidden gap-2 opacity-0 transition-all duration-300 group-hover:opacity-100 lg:flex">
          <button onClick={(e) => handleAdd(e)} className="flex-1 rounded-full bg-[#0c1929] py-2.5 text-xs font-bold text-white shadow-lg hover:bg-[#1e3a5f]">
            Add to Cart
          </button>
          <button onClick={handleBuyNow} className="flex-1 rounded-full bg-emerald-500 py-2.5 text-xs font-bold text-white shadow-lg hover:bg-emerald-600">
            Quick Buy
          </button>
        </div>
      </Link>

      <div className="flex flex-1 flex-col p-3.5 sm:p-4">
        <p className="text-[10px] font-bold uppercase tracking-wider text-sky-600">{product.shopCollection || product.category}</p>
        <Link href={`/products/${product.slug}`} onClick={handleProductClick}>
          <h3 className="mt-1 line-clamp-2 min-h-[2.5rem] text-sm font-bold leading-snug text-slate-800 transition hover:text-sky-600 sm:text-[15px]">
            {product.name}
          </h3>
        </Link>

        <div className="mt-2 flex items-center gap-1.5">
          <Stars rating={rating} size="xs" alwaysShow />
          <span className="text-[10px] font-medium text-slate-500">
            {reviewCount > 0 ? `${rating} (${reviewCount})` : `${rating} ★`}
          </span>
        </div>

        <div className="mt-auto pt-3">
          <PriceDisplay price={product.price} originalPrice={product.comparePrice} size={variant === "bestseller" ? "md" : "sm"} />
        </div>

        {isLowStock(product.stock) && product.stock > 0 && (
          <p className="mt-1 text-[10px] font-semibold text-orange-600">Only {product.stock} left!</p>
        )}

        <div className="mt-3 grid grid-cols-2 gap-2 lg:hidden">
          <button
            onClick={(e) => handleAdd(e, false)}
            className="min-h-[44px] rounded-full bg-[#0c1929] py-2.5 text-xs font-bold text-white active:scale-[0.97]"
          >
            Add to Cart
          </button>
          <button
            onClick={handleBuyNow}
            className="min-h-[44px] rounded-full bg-emerald-500 py-2.5 text-xs font-bold text-white active:scale-[0.97]"
          >
            Buy Now
          </button>
        </div>
      </div>
    </article>
  );
}
