"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import ProductImageSlider, { getValidImages } from "@/components/product/ProductImageSlider";
import { useCart } from "@/context/CartContext";
import { useToast } from "@/context/ToastContext";
import { useLanguage } from "@/context/LanguageContext";
import { useWhatsAppContext } from "@/context/WhatsAppContext";
import ProductCard from "@/components/product/ProductCard";
import { PageLoader } from "@/components/ui/Loading";
import Stars from "@/components/ui/Stars";
import PriceDisplay, { getDiscountPercent } from "@/components/product/PriceDisplay";
import TrustBadges, { CodBadge } from "@/components/ui/TrustBadges";
import WhatsAppIcon from "@/components/ui/WhatsAppIcon";
import { formatPrice, isLowStock, validatePincode } from "@/lib/utils";
import VariantSelector, { validateVariantSelection } from "@/components/product/VariantSelector";
import { getProductColors, getProductSizes } from "@/lib/productVariants";
import { trackViewContent } from "@/lib/metaPixel";
import { trackProductView } from "@/lib/analytics";
import { getWhatsAppUrl, getProductWhatsAppMessage } from "@/lib/whatsapp";
import ProductWhyBuy from "@/components/cro/ProductWhyBuy";
import WhatsAppHelpCTA from "@/components/cro/WhatsAppHelpCTA";
import ImageZoomLightbox from "@/components/product/ImageZoomLightbox";
import { trackWhatsAppClick } from "@/lib/analytics";

const PRODUCT_FAQ = [
  { q: "Is this product body-safe?", a: "Yes, all TrustSilcon products use medical-grade, non-toxic silicone." },
  { q: "How do I clean it?", a: "Wash with warm water and mild soap before and after each use. Pat dry and store in a clean pouch." },
  { q: "Is packaging discreet?", a: "Every order ships in a plain, unmarked box with no product details visible." },
  { q: "Is COD available?", a: "Yes! Pay cash on delivery when your order arrives. No online payment required." },
];

export default function ProductDetailPage() {
  const { slug } = useParams();
  const router = useRouter();
  const { addToCart, addRecentlyViewed } = useCart();
  const { showToast } = useToast();
  const { t, lang } = useLanguage();
  const { setProductName, clearProduct } = useWhatsAppContext();
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
  const [selectedColor, setSelectedColor] = useState("");
  const [selectedSize, setSelectedSize] = useState("");
  const [zoomOpen, setZoomOpen] = useState(false);

  const TABS = [t("description"), t("materialCare"), t("shipping"), t("reviews"), t("faq")];

  useEffect(() => {
    async function load() {
      setGalleryIndex(0);
      setSelectedColor("");
      setSelectedSize("");
      const res = await fetch(`/api/products?slug=${slug}`);
      const data = await res.json();
      if (data.product) {
        setProduct(data.product);
        setProductName(data.product.name);
        const colors = getProductColors(data.product);
        const sizes = getProductSizes(data.product);
        if (colors.length === 1) setSelectedColor(colors[0].name);
        if (sizes.length === 1) setSelectedSize(sizes[0]);
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
    return () => clearProduct();
  }, [slug, addRecentlyViewed, setProductName, clearProduct]);

  useEffect(() => {
    if (product) {
      trackViewContent(product);
      trackProductView(product);
    }
  }, [product]);

  const displayName = product && lang === "hi" && product.nameHi ? product.nameHi : product?.name;

  const checkPincode = () => {
    if (!validatePincode(pincode)) { setDeliveryMsg("Please enter a valid 6-digit pincode"); return; }
    setDeliveryMsg(`✓ Delivery available to ${pincode}. Estimated 3–5 business days in discreet packaging.`);
  };

  const validateAndAdd = () => {
    if (product.stock <= 0) { showToast("Out of stock", "error"); return false; }
    const variantError = validateVariantSelection(product, selectedColor, selectedSize);
    if (variantError) { showToast(variantError, "error"); return false; }
    return true;
  };

  const handleAdd = () => {
    if (!validateAndAdd()) return;
    addToCart(product, quantity, { color: selectedColor, size: selectedSize });
    showToast("Added to bag!");
  };

  const handleBuyNow = () => {
    if (!validateAndAdd()) return;
    addToCart(product, quantity, { color: selectedColor, size: selectedSize }, false);
    router.push("/checkout");
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
  const whatsappMsg = getProductWhatsAppMessage(product.name);

  return (
    <>
      <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8 lg:py-10">
        <p className="text-xs text-slate-400">
          <Link href="/" className="hover:text-sky-500">{t("home")}</Link> / <Link href="/shop" className="hover:text-sky-500">{t("shop")}</Link> / <span className="text-slate-600">{displayName}</span>
        </p>

        <div className="mt-6 grid gap-8 lg:grid-cols-2 lg:gap-12">
          <div>
            <div className="relative aspect-square overflow-hidden rounded-3xl bg-gradient-to-br from-slate-50 to-sky-50 ring-1 ring-slate-100">
              <ProductImageSlider
                images={product.images}
                alt={displayName}
                sizes="(max-width:768px) 100vw, 50vw"
                variant="detail"
                className="h-full w-full"
                index={galleryIndex}
                onIndexChange={setGalleryIndex}
                badge={
                  <>
                    {discount > 0 && (
                      <span className="absolute left-4 top-4 z-20 rounded-full bg-red-500 px-3 py-1 text-xs font-bold text-white">{discount}% OFF</span>
                    )}
                    <span className="absolute right-4 top-4 z-20"><CodBadge /></span>
                    <button
                      type="button"
                      onClick={() => setZoomOpen(true)}
                      className="absolute bottom-4 right-4 z-20 flex h-10 w-10 items-center justify-center rounded-full bg-white/90 text-slate-700 shadow-md hover:bg-white"
                      aria-label="Zoom image"
                    >
                      <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7" />
                      </svg>
                    </button>
                  </>
                }
              />
            </div>
            <ImageZoomLightbox
              src={galleryImages[galleryIndex]?.url}
              alt={displayName}
              open={zoomOpen}
              onClose={() => setZoomOpen(false)}
            />
            {product.videoUrl && (
              <div className="mt-4 overflow-hidden rounded-2xl ring-1 ring-slate-100">
                <video src={product.videoUrl} controls playsInline preload="none" className="w-full" poster={galleryImages[0]?.url} />
              </div>
            )}
            {galleryImages.length > 1 && (
              <div className="mt-3 flex gap-2 overflow-x-auto scrollbar-hide">
                {galleryImages.map((img, i) => (
                  <button
                    key={img.url}
                    type="button"
                    onClick={() => setGalleryIndex(i)}
                    className={`relative h-16 w-16 shrink-0 overflow-hidden rounded-xl ring-2 ${galleryIndex === i ? "ring-sky-500" : "ring-slate-100"}`}
                  >
                    <img src={img.url} alt="" className="h-full w-full object-cover" loading="lazy" decoding="async" />
                  </button>
                ))}
              </div>
            )}

            <div className="mt-6 grid grid-cols-2 gap-2 sm:grid-cols-4">
              {[
                { icon: "📦", label: "Discreet Packaging" },
                { icon: "💰", label: "COD Available" },
                { icon: "🚚", label: "Fast Delivery" },
                { icon: "🛡", label: "Secure Checkout" },
              ].map(({ icon, label }) => (
                <div key={label} className="rounded-xl bg-emerald-50 px-3 py-2.5 text-center text-[10px] font-bold text-emerald-800 ring-1 ring-emerald-100 sm:text-xs">
                  <span className="block text-base">{icon}</span>
                  {label}
                </div>
              ))}
            </div>
          </div>

          <div className="lg:sticky lg:top-36 lg:self-start">
            <p className="text-xs font-bold uppercase tracking-widest text-sky-500">{product.shopCollection || product.category}</p>
            <h1 className="mt-2 text-2xl font-bold text-slate-900 sm:text-3xl">{displayName}</h1>
            <div className="mt-3 flex flex-wrap items-center gap-3">
              <Stars rating={avgRating || 5} size="md" showValue alwaysShow />
              <span className="text-sm text-slate-500">
                {reviews.length > 0 ? `(${reviews.length} ${t("reviews").toLowerCase()})` : "(5.0 rating)"}
              </span>
              <CodBadge />
            </div>
            <div className="mt-4">
              <PriceDisplay price={product.price} originalPrice={product.comparePrice} size="lg" />
            </div>
            <p className="mt-4 text-slate-600">{product.shortDescription}</p>

            <div className="mt-4 rounded-xl bg-sky-50 p-4 ring-1 ring-sky-100">
              <p className="text-xs font-semibold text-sky-700">📦 {t("discreetDelivery")}</p>
              <p className="mt-1 text-xs text-sky-600">{t("discreetDeliveryDesc")}</p>
            </div>

            <div className="mt-4">
              <label className="text-xs font-semibold text-slate-700">{t("checkDelivery")}</label>
              <div className="mt-1.5 flex gap-2">
                <input value={pincode} onChange={(e) => setPincode(e.target.value)} placeholder={t("enterPincode")} maxLength={6} className="flex-1 rounded-xl border border-slate-200 px-4 py-2.5 text-sm outline-none focus:border-sky-400" />
                <button onClick={checkPincode} className="rounded-xl bg-slate-800 px-5 py-2.5 text-sm font-semibold text-white hover:bg-slate-700">{t("check")}</button>
              </div>
              {deliveryMsg && <p className="mt-2 text-xs text-emerald-600">{deliveryMsg}</p>}
            </div>

            {product.material && (
              <div className="mt-4 flex flex-wrap gap-2 text-xs text-slate-500">
                <span className="rounded-full bg-slate-100 px-3 py-1">{product.material}</span>
              </div>
            )}

            <div className="mt-5">
              <VariantSelector product={product} selectedColor={selectedColor} selectedSize={selectedSize} onColorChange={setSelectedColor} onSizeChange={setSelectedSize} />
            </div>

            {product.stock <= 0 ? (
              <span className="mt-4 inline-block rounded-full bg-red-100 px-4 py-1.5 text-sm font-medium text-red-600">{t("outOfStock")}</span>
            ) : isLowStock(product.stock) ? (
              <span className="mt-4 inline-block rounded-full bg-orange-100 px-4 py-1.5 text-sm font-medium text-orange-600">{t("onlyLeft", { count: product.stock })}</span>
            ) : (
              <span className="mt-4 inline-block rounded-full bg-emerald-100 px-4 py-1.5 text-sm font-medium text-emerald-600">✓ {t("inStock")}</span>
            )}

            <div className="mt-6 hidden items-center gap-3 sm:flex">
              <div className="flex items-center rounded-full border border-slate-200">
                <button onClick={() => setQuantity(Math.max(1, quantity - 1))} className="px-4 py-2.5 text-slate-500">−</button>
                <span className="min-w-[40px] text-center font-semibold">{quantity}</span>
                <button onClick={() => setQuantity(Math.min(product.stock, quantity + 1))} className="px-4 py-2.5 text-slate-500">+</button>
              </div>
              <button onClick={handleAdd} disabled={product.stock <= 0} className="flex-1 rounded-full bg-[#0c1929] py-3.5 font-semibold text-white hover:bg-[#1e3a5f] disabled:opacity-50">
                {t("addToBag")}
              </button>
              <button onClick={handleBuyNow} disabled={product.stock <= 0} className="flex-1 rounded-full bg-emerald-500 py-3.5 font-semibold text-white hover:bg-emerald-600 disabled:opacity-50">
                {t("buyNow")}
              </button>
            </div>

            <a
              href={getWhatsAppUrl(whatsappMsg)}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => trackWhatsAppClick("product_page")}
              className="mt-4 hidden w-full items-center justify-center gap-2 rounded-full border-2 border-emerald-500 py-3.5 text-sm font-semibold text-emerald-600 hover:bg-emerald-50 sm:flex"
            >
              <WhatsAppIcon className="h-5 w-5" />
              {t("orderOnWhatsApp")}
            </a>

            <TrustBadges variant="compact" className="mt-5 hidden sm:grid" />
          </div>
        </div>

        <ProductWhyBuy />

        <div className="mt-8 grid gap-4 sm:grid-cols-2">
          <div className="rounded-2xl bg-sky-50 p-5 ring-1 ring-sky-100">
            <h3 className="font-bold text-slate-900">Key Benefits</h3>
            <ul className="mt-3 space-y-2 text-sm text-slate-600">
              <li>✓ Premium body-safe silicone material</li>
              <li>✓ Discreet plain packaging on every order</li>
              <li>✓ Cash on delivery — pay when it arrives</li>
              <li>✓ Fast pan-India delivery with tracking</li>
            </ul>
          </div>
          <div className="rounded-2xl bg-slate-50 p-5 ring-1 ring-slate-100">
            <h3 className="font-bold text-slate-900">Features</h3>
            <ul className="mt-3 space-y-2 text-sm text-slate-600">
              {product.material && <li>✓ Material: {product.material}</li>}
              <li>✓ Easy to clean and maintain</li>
              <li>✓ Non-toxic, hypoallergenic design</li>
              <li>✓ Backed by verified customer reviews</li>
            </ul>
          </div>
        </div>

        <WhatsAppHelpCTA message={whatsappMsg} context="product_page" className="mt-8" />

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
                <p>• Discreet plain packaging on every order · COD available</p>
                <p>• Track your order at <Link href="/track-order" className="text-sky-500">{t("trackOrder")}</Link></p>
              </div>
            )}
            {activeTab === 3 && (
              <div className="space-y-4">
                {reviews.length === 0 ? <p className="text-sm text-slate-500">No reviews yet.</p> : reviews.map((r) => (
                  <div key={r._id} className="rounded-2xl bg-slate-50 p-5">
                    <div className="flex items-center justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <span className="font-semibold">{r.name}</span>
                        {r.verifiedBuyer && (
                          <span className="rounded-full bg-emerald-100 px-2 py-0.5 text-[10px] font-bold text-emerald-700">{t("verifiedBuyer")}</span>
                        )}
                      </div>
                      <Stars rating={r.rating} size="sm" alwaysShow />
                    </div>
                    {r.city && <p className="mt-1 text-xs text-slate-400">{r.city}</p>}
                    <p className="mt-2 text-sm text-slate-600">{r.review}</p>
                  </div>
                ))}
                <Link href={`/reviews?productId=${product._id}#write-review`} className="inline-block text-sm font-medium text-sky-500 hover:text-sky-600">
                  {t("writeReview")} →
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

        <TrustBadges variant="compact" className="mt-4 sm:hidden" />

        {related.length > 0 && (
          <div className="mt-8 border-t border-slate-100 pt-12">
            <h2 className="text-xl font-bold text-slate-900">{t("youMayAlsoLike")}</h2>
            <div className="mt-6 grid grid-cols-2 gap-4 lg:grid-cols-4">{related.map((p) => <ProductCard key={p._id} product={p} />)}</div>
          </div>
        )}
      </div>

      <div className="fixed inset-x-0 bottom-0 z-40 border-t border-slate-200 bg-white p-3 shadow-lg sm:hidden">
        <div className="flex items-center gap-2">
          <div className="shrink-0">
            <p className="text-base font-bold text-slate-900">{formatPrice(product.price)}</p>
            {discount > 0 && <p className="text-[10px] text-red-500">{discount}% off</p>}
          </div>
          <a
            href={getWhatsAppUrl(whatsappMsg)}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => trackWhatsAppClick("product_sticky")}
            className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border-2 border-emerald-500 text-emerald-600"
            aria-label={t("orderOnWhatsApp")}
          >
            <WhatsAppIcon className="h-5 w-5" />
          </a>
          <button onClick={handleAdd} disabled={product.stock <= 0} className="flex-1 rounded-full bg-[#0c1929] py-3 text-sm font-semibold text-white disabled:opacity-50">
            {t("addToBag")}
          </button>
          <button onClick={handleBuyNow} disabled={product.stock <= 0} className="flex-1 rounded-full bg-emerald-500 py-3 text-sm font-semibold text-white disabled:opacity-50">
            {t("buyNow")}
          </button>
        </div>
      </div>
      <div className="h-[4.5rem] sm:hidden" />
    </>
  );
}
