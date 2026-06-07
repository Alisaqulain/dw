"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import ProductImageSlider, { getValidImages } from "@/components/product/ProductImageSlider";
import { useCart } from "@/context/CartContext";
import { useToast } from "@/context/ToastContext";
import ProductCard from "@/components/product/ProductCard";
import { PageLoader } from "@/components/ui/Loading";
import Stars from "@/components/ui/Stars";
import PriceDisplay, { getDiscountPercent } from "@/components/product/PriceDisplay";
import { formatPrice, isLowStock, validatePincode } from "@/lib/utils";

const TABS = ["Description", "Material & Care", "Shipping", "Reviews", "FAQ"];

const PRODUCT_FAQ = [
  { q: "Is this product body-safe?", a: "Yes, all TrustSilcon products use medical-grade, non-toxic silicone." },
  { q: "How do I clean it?", a: "Wash with warm water and mild soap before and after each use. Pat dry and store in a clean pouch." },
  { q: "Is packaging discreet?", a: "Every order ships in a plain, unmarked box with no product details visible." },
];

export default function ProductDetailPage() {
  const { slug } = useParams();
  const { addToCart, addRecentlyViewed } = useCart();
  const { showToast } = useToast();
  const [product, setProduct] = useState(null);
  const [related, setRelated] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [avgRating, setAvgRating] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState(0);
  const [pincode, setPincode] = useState("");
  const [deliveryMsg, setDeliveryMsg] = useState("");
  const [galleryIndex, setGalleryIndex] = useState(0);

  useEffect(() => {
    async function load() {
      setGalleryIndex(0);
      const res = await fetch(`/api/products?slug=${slug}`);
      const data = await res.json();
      if (data.product) {
        setProduct(data.product);
        addRecentlyViewed(data.product);
        const [relRes, revRes] = await Promise.all([
          fetch(`/api/products?collection=${encodeURIComponent(data.product.shopCollection || data.product.category)}&limit=5`),
          fetch(`/api/reviews?productId=${data.product._id}`),
        ]);
        const relData = await relRes.json();
        const revData = await revRes.json();
        setRelated((relData.products || []).filter((p) => p._id !== data.product._id).slice(0, 4));
        setReviews(revData.reviews || []);
        setAvgRating(revData.avgRating || data.product.avgRating || 0);
      }
      setLoading(false);
    }
    load();
  }, [slug, addRecentlyViewed]);

  const checkPincode = () => {
    if (!validatePincode(pincode)) { setDeliveryMsg("Please enter a valid 6-digit pincode"); return; }
    setDeliveryMsg(`✓ Delivery available to ${pincode}. Estimated 3–5 business days in discreet packaging.`);
  };

  const handleAdd = () => {
    if (product.stock <= 0) { showToast("Out of stock", "error"); return; }
    addToCart(product, quantity);
    showToast("Added to bag!");
  };

  if (loading) return <PageLoader />;
  if (!product) return (
    <div className="mx-auto max-w-7xl px-4 py-20 text-center">
      <h1 className="text-2xl font-bold">Product not found</h1>
      <Link href="/shop" className="mt-4 inline-block text-sky-500">← Back to Shop</Link>
    </div>
  );

  const discount = getDiscountPercent(product.price, product.comparePrice);
  const galleryImages = getValidImages(product.images);

  return (
    <>
      <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8 lg:py-10">
        <p className="text-xs text-slate-400"><Link href="/" className="hover:text-sky-500">Home</Link> / <Link href="/shop" className="hover:text-sky-500">Shop</Link> / <span className="text-slate-600">{product.name}</span></p>

        <div className="mt-6 grid gap-8 lg:grid-cols-2 lg:gap-12">
          {/* Gallery */}
          <div>
            <div className="relative aspect-square overflow-hidden rounded-3xl bg-gradient-to-br from-slate-50 to-sky-50 ring-1 ring-slate-100">
              <ProductImageSlider
                images={product.images}
                alt={product.name}
                sizes="(max-width:768px) 100vw, 50vw"
                variant="detail"
                className="h-full w-full"
                index={galleryIndex}
                onIndexChange={setGalleryIndex}
                badge={
                  discount > 0 ? (
                    <span className="absolute left-4 top-4 z-20 rounded-full bg-red-500 px-3 py-1 text-xs font-bold text-white">{discount}% OFF</span>
                  ) : null
                }
              />
            </div>
            {galleryImages.length > 1 && (
              <div className="mt-3 flex gap-2 overflow-x-auto scrollbar-hide">
                {galleryImages.map((img, i) => (
                  <button
                    key={img.url}
                    type="button"
                    onClick={() => setGalleryIndex(i)}
                    className={`relative h-16 w-16 shrink-0 overflow-hidden rounded-xl ring-2 ${galleryIndex === i ? "ring-sky-500" : "ring-slate-100"}`}
                  >
                    <img src={img.url} alt="" className="h-full w-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Info */}
          <div className="lg:sticky lg:top-36 lg:self-start">
            <p className="text-xs font-bold uppercase tracking-widest text-sky-500">{product.shopCollection || product.category}</p>
            <h1 className="mt-2 text-2xl font-bold text-slate-900 sm:text-3xl">{product.name}</h1>
            <div className="mt-3 flex items-center gap-3">
              <Stars rating={avgRating || 5} size="md" showValue alwaysShow />
              <span className="text-sm text-slate-500">
                {reviews.length > 0 ? `(${reviews.length} reviews)` : "(5.0 rating)"}
              </span>
            </div>
            <div className="mt-4">
              <PriceDisplay price={product.price} originalPrice={product.comparePrice} size="lg" />
            </div>
            <p className="mt-4 text-slate-600">{product.shortDescription}</p>

            <div className="mt-4 rounded-xl bg-sky-50 p-4 ring-1 ring-sky-100">
              <p className="text-xs font-semibold text-sky-700">📦 Discreet Delivery</p>
              <p className="mt-1 text-xs text-sky-600">Plain packaging · No product labels · Private billing on statement</p>
            </div>

            {/* Pincode checker */}
            <div className="mt-4">
              <label className="text-xs font-semibold text-slate-700">Check Delivery</label>
              <div className="mt-1.5 flex gap-2">
                <input value={pincode} onChange={(e) => setPincode(e.target.value)} placeholder="Enter pincode" maxLength={6} className="flex-1 rounded-xl border border-slate-200 px-4 py-2.5 text-sm outline-none focus:border-sky-400" />
                <button onClick={checkPincode} className="rounded-xl bg-slate-800 px-5 py-2.5 text-sm font-semibold text-white hover:bg-slate-700">Check</button>
              </div>
              {deliveryMsg && <p className="mt-2 text-xs text-emerald-600">{deliveryMsg}</p>}
            </div>

            <div className="mt-4 flex flex-wrap gap-2 text-xs text-slate-500">
              {product.material && <span className="rounded-full bg-slate-100 px-3 py-1">{product.material}</span>}
              {product.size && <span className="rounded-full bg-slate-100 px-3 py-1">Size: {product.size}</span>}
              {product.color && <span className="rounded-full bg-slate-100 px-3 py-1">{product.color}</span>}
            </div>

            {product.stock <= 0 ? (
              <span className="mt-4 inline-block rounded-full bg-red-100 px-4 py-1.5 text-sm font-medium text-red-600">Out of Stock</span>
            ) : isLowStock(product.stock) ? (
              <span className="mt-4 inline-block rounded-full bg-orange-100 px-4 py-1.5 text-sm font-medium text-orange-600">Only {product.stock} left — order soon!</span>
            ) : (
              <span className="mt-4 inline-block rounded-full bg-emerald-100 px-4 py-1.5 text-sm font-medium text-emerald-600">✓ In Stock</span>
            )}

            <div className="mt-6 hidden items-center gap-4 sm:flex">
              <div className="flex items-center rounded-full border border-slate-200">
                <button onClick={() => setQuantity(Math.max(1, quantity - 1))} className="px-4 py-2.5 text-slate-500">−</button>
                <span className="min-w-[40px] text-center font-semibold">{quantity}</span>
                <button onClick={() => setQuantity(Math.min(product.stock, quantity + 1))} className="px-4 py-2.5 text-slate-500">+</button>
              </div>
              <button onClick={handleAdd} disabled={product.stock <= 0} className="flex-1 rounded-full bg-[#0c1929] py-3.5 font-semibold text-white hover:bg-[#1e3a5f] disabled:opacity-50">
                Add to Bag
              </button>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="mt-12">
          <div className="flex gap-1 overflow-x-auto border-b border-slate-200 scrollbar-hide">
            {TABS.map((tab, i) => (
              <button key={tab} onClick={() => setActiveTab(i)} className={`shrink-0 px-5 py-3 text-sm font-semibold transition ${activeTab === i ? "border-b-2 border-sky-500 text-sky-600" : "text-slate-500 hover:text-slate-700"}`}>
                {tab}
              </button>
            ))}
          </div>
          <div className="py-8">
            {activeTab === 0 && <div className="prose max-w-none text-sm leading-relaxed text-slate-600 whitespace-pre-line">{product.fullDescription}</div>}
            {activeTab === 1 && (
              <div className="space-y-3 text-sm text-slate-600">
                <p><strong>Material:</strong> {product.material || "Medical-grade silicone"}</p>
                <p><strong>Care:</strong> Wash with warm water and mild soap. Store in a clean, dry place.</p>
                <p><strong>Safety:</strong> Body-safe, non-toxic, hypoallergenic, phthalate-free.</p>
              </div>
            )}
            {activeTab === 2 && (
              <div className="space-y-3 text-sm text-slate-600">
                <p>• Free delivery on orders above ₹999</p>
                <p>• Standard delivery: ₹79 (3–7 business days)</p>
                <p>• Discreet plain packaging on every order</p>
                <p>• Track your order at <Link href="/track-order" className="text-sky-500">Track Order</Link></p>
              </div>
            )}
            {activeTab === 3 && (
              <div className="space-y-4">
                {reviews.length === 0 ? <p className="text-sm text-slate-500">No reviews yet.</p> : reviews.map((r) => (
                  <div key={r._id} className="rounded-2xl bg-slate-50 p-5">
                    <div className="flex items-center justify-between">
                      <span className="font-semibold">{r.name}</span>
                      <Stars rating={r.rating} size="sm" alwaysShow />
                    </div>
                    <p className="mt-2 text-sm text-slate-600">{r.review}</p>
                  </div>
                ))}
                <Link
                  href={`/reviews?productId=${product._id}#write-review`}
                  className="inline-block text-sm font-medium text-sky-500 hover:text-sky-600"
                >
                  Write a review →
                </Link>
              </div>
            )}
            {activeTab === 4 && (
              <div className="space-y-3">
                {PRODUCT_FAQ.map((f) => (
                  <div key={f.q} className="rounded-xl bg-slate-50 p-4">
                    <p className="text-sm font-semibold text-slate-800">{f.q}</p>
                    <p className="mt-1 text-sm text-slate-500">{f.a}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {related.length > 0 && (
          <div className="mt-8 border-t border-slate-100 pt-12">
            <h2 className="text-xl font-bold text-slate-900">You May Also Like</h2>
            <div className="mt-6 grid grid-cols-2 gap-4 lg:grid-cols-4">{related.map((p) => <ProductCard key={p._id} product={p} />)}</div>
          </div>
        )}
      </div>

      {/* Sticky mobile add to cart */}
      <div className="fixed inset-x-0 bottom-0 z-40 border-t border-slate-200 bg-white p-4 shadow-lg sm:hidden">
        <div className="flex items-center gap-3">
          <div>
            <p className="text-lg font-bold text-slate-900">{formatPrice(product.price)}</p>
            {discount > 0 && <p className="text-xs text-red-500">{discount}% off</p>}
          </div>
          <button onClick={handleAdd} disabled={product.stock <= 0} className="flex-1 rounded-full bg-[#0c1929] py-3.5 text-sm font-semibold text-white disabled:opacity-50">
            Add to Bag
          </button>
        </div>
      </div>
      <div className="h-20 sm:hidden" />
    </>
  );
}
