"use client";

import { useEffect, useRef, useState } from "react";
import { trackInitiateCheckout } from "@/lib/metaPixel";
import { trackInitiateCheckoutEvent, syncCartSession, getSessionId } from "@/lib/analytics";
import { useRouter } from "next/navigation";
import { useCart } from "@/context/CartContext";
import { useToast } from "@/context/ToastContext";
import { useLanguage } from "@/context/LanguageContext";
import { formatPrice, getDeliveryCharge } from "@/lib/utils";
import TrustBadges, { CodBadge } from "@/components/ui/TrustBadges";
import Link from "next/link";

const INDIAN_STATES = [
  "Andhra Pradesh", "Arunachal Pradesh", "Assam", "Bihar", "Chhattisgarh", "Goa",
  "Gujarat", "Haryana", "Himachal Pradesh", "Jharkhand", "Karnataka", "Kerala",
  "Madhya Pradesh", "Maharashtra", "Manipur", "Meghalaya", "Mizoram", "Nagaland",
  "Odisha", "Punjab", "Rajasthan", "Sikkim", "Tamil Nadu", "Telangana", "Tripura",
  "Uttar Pradesh", "Uttarakhand", "West Bengal", "Delhi", "Jammu and Kashmir",
  "Ladakh", "Puducherry", "Chandigarh",
];

export default function CheckoutPage() {
  const { cart, cartTotal, clearCart } = useCart();
  const { showToast } = useToast();
  const { t } = useLanguage();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [couponCode, setCouponCode] = useState("");
  const [discount, setDiscount] = useState(0);
  const [appliedCoupon, setAppliedCoupon] = useState("");
  const [form, setForm] = useState({
    customerName: "", phone: "", email: "", address: "",
    city: "", state: "", pincode: "", paymentMethod: "COD", marketingOptIn: false,
  });

  const deliveryCharge = getDeliveryCharge(cartTotal - discount);
  const total = cartTotal - discount + deliveryCharge;
  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);
  const checkoutTracked = useRef(false);

  useEffect(() => {
    if (checkoutTracked.current || cart.length === 0) return;
    checkoutTracked.current = true;
    trackInitiateCheckout({ cart, cartTotal, cartCount });
    trackInitiateCheckoutEvent({ cart, cartTotal, cartCount });
  }, [cart, cartTotal, cartCount]);

  const saveAbandonedCart = (updates = {}) => {
    syncCartSession(cart, cartTotal, {
      checkoutStarted: true,
      customerName: form.customerName,
      phone: form.phone,
      email: form.email,
      ...updates,
    });
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => {
      const next = { ...prev, [name]: type === "checkbox" ? checked : value };
      if (["phone", "email", "customerName"].includes(name) && (next.phone || next.email)) {
        setTimeout(() => syncCartSession(cart, cartTotal, {
          checkoutStarted: true,
          customerName: next.customerName,
          phone: next.phone,
          email: next.email,
        }), 500);
      }
      return next;
    });
  };

  const applyCoupon = async () => {
    if (!couponCode.trim()) return;
    const res = await fetch("/api/coupons", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ code: couponCode, subtotal: cartTotal }),
    });
    const data = await res.json();
    if (data.valid) {
      setDiscount(data.coupon.discount);
      setAppliedCoupon(data.coupon.code);
      showToast(`Coupon applied! Saved ${formatPrice(data.coupon.discount)}`);
    } else {
      showToast(data.error || "Invalid coupon", "error");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (cart.length === 0) {
      showToast("Cart is empty", "error");
      return;
    }
    setLoading(true);
    saveAbandonedCart();

    const res = await fetch("/api/orders", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ...form,
        sessionId: getSessionId(),
        items: cart.map((item) => ({
          productId: item.productId,
          name: item.name,
          quantity: item.quantity,
          color: item.color || "",
          size: item.size || "",
        })),
        couponCode: appliedCoupon,
      }),
    });

    const data = await res.json();
    setLoading(false);

    if (data.success) {
      clearCart();
      router.push(`/order-success?order=${data.order.orderNumber}`);
    } else {
      showToast(data.error || "Order failed", "error");
    }
  };

  if (cart.length === 0) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-20 text-center">
        <h1 className="text-2xl font-bold">{t("emptyCart")}</h1>
        <Link href="/shop" className="mt-4 inline-block text-sky-500">{t("continueShopping")}</Link>
      </div>
    );
  }

  const inputClass = "mt-1 w-full rounded-xl border border-sky-100 px-4 py-2.5 text-sm outline-none focus:border-sky-300 focus:ring-2 focus:ring-sky-100";

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-3xl font-bold text-slate-800">{t("checkout")}</h1>
        <CodBadge />
      </div>

      <TrustBadges variant="strip" className="mt-4 rounded-2xl bg-sky-50/50 px-4 py-3" />

      <form onSubmit={handleSubmit} className="mt-8 grid gap-8 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2">
          <div className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-sky-100">
            <h2 className="font-bold text-slate-800">{t("shippingDetails")}</h2>
            <div className="mt-4 grid gap-4 sm:grid-cols-2">
              <div className="sm:col-span-2">
                <label className="text-xs font-medium text-slate-500">{t("fullName")} *</label>
                <input name="customerName" required value={form.customerName} onChange={handleChange} className={inputClass} />
              </div>
              <div>
                <label className="text-xs font-medium text-slate-500">{t("phone")} *</label>
                <input name="phone" required pattern="[6-9][0-9]{9}" value={form.phone} onChange={handleChange} className={inputClass} placeholder="10-digit mobile" />
              </div>
              <div>
                <label className="text-xs font-medium text-slate-500">{t("email")}</label>
                <input name="email" type="email" value={form.email} onChange={handleChange} className={inputClass} />
              </div>
              <div className="sm:col-span-2">
                <label className="text-xs font-medium text-slate-500">{t("address")} *</label>
                <textarea name="address" required rows={2} value={form.address} onChange={handleChange} className={inputClass} />
              </div>
              <div>
                <label className="text-xs font-medium text-slate-500">{t("city")} *</label>
                <input name="city" required value={form.city} onChange={handleChange} className={inputClass} />
              </div>
              <div>
                <label className="text-xs font-medium text-slate-500">{t("state")} *</label>
                <select name="state" required value={form.state} onChange={handleChange} className={inputClass}>
                  <option value="">{t("selectState")}</option>
                  {INDIAN_STATES.map((s) => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>
              <div>
                <label className="text-xs font-medium text-slate-500">{t("pincode")} *</label>
                <input name="pincode" required pattern="[1-9][0-9]{5}" value={form.pincode} onChange={handleChange} className={inputClass} />
              </div>
            </div>
          </div>

          <div className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-sky-100">
            <h2 className="font-bold text-slate-800">{t("paymentMethod")}</h2>
            <div className="mt-4 flex items-center gap-3 rounded-xl border border-emerald-200 bg-emerald-50 p-4">
              <span className="flex h-10 w-10 items-center justify-center rounded-full bg-emerald-500 text-lg text-white">💵</span>
              <div>
                <p className="font-medium text-slate-800">{t("codTitle")}</p>
                <p className="text-xs text-slate-500">{t("codDesc")}</p>
              </div>
            </div>
          </div>

          <TrustBadges variant="compact" />

          <label className="flex items-start gap-3 rounded-2xl bg-sky-50/50 p-4">
            <input type="checkbox" name="marketingOptIn" checked={form.marketingOptIn} onChange={handleChange} className="mt-1" />
            <span className="text-sm text-slate-600">{t("marketingOptIn")}</span>
          </label>
        </div>

        <div className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-sky-100 h-fit">
          <h2 className="font-bold text-slate-800">{t("orderSummary")}</h2>
          <div className="mt-4 space-y-2 text-sm">
            {cart.map((item) => (
              <div key={item.lineId || item.productId} className="flex justify-between gap-3">
                <span className="text-slate-500">
                  {item.name} × {item.quantity}
                  {(item.color || item.size) && (
                    <span className="block text-xs text-slate-400">
                      {[item.color && `Colour: ${item.color}`, item.size && `Size: ${item.size}`].filter(Boolean).join(" · ")}
                    </span>
                  )}
                </span>
                <span className="shrink-0">{formatPrice(item.price * item.quantity)}</span>
              </div>
            ))}
          </div>
          <div className="mt-4 flex gap-2">
            <input value={couponCode} onChange={(e) => setCouponCode(e.target.value)} placeholder={t("couponCode")} className="flex-1 rounded-xl border border-sky-100 px-3 py-2 text-sm outline-none focus:border-sky-300" />
            <button type="button" onClick={applyCoupon} className="rounded-xl bg-sky-100 px-4 py-2 text-sm font-medium text-sky-600 hover:bg-sky-200">{t("apply")}</button>
          </div>
          <div className="mt-4 space-y-2 border-t border-sky-100 pt-4 text-sm">
            <div className="flex justify-between"><span className="text-slate-500">{t("subtotal")}</span><span>{formatPrice(cartTotal)}</span></div>
            {discount > 0 && <div className="flex justify-between text-emerald-600"><span>{t("discount")}</span><span>-{formatPrice(discount)}</span></div>}
            <div className="flex justify-between"><span className="text-slate-500">{t("delivery")}</span><span>{deliveryCharge === 0 ? t("freeDelivery") : formatPrice(deliveryCharge)}</span></div>
            <div className="flex justify-between text-lg font-bold pt-2"><span>{t("total")}</span><span>{formatPrice(total)}</span></div>
          </div>
          <button type="submit" disabled={loading} className="mt-6 w-full rounded-2xl bg-gradient-to-r from-emerald-500 to-emerald-400 py-3.5 font-semibold text-white shadow-lg disabled:opacity-50">
            {loading ? t("placingOrder") : t("placeOrder")}
          </button>
          <p className="mt-3 text-center text-xs text-slate-400">💵 {t("codBadge")}</p>
        </div>
      </form>
    </div>
  );
}
