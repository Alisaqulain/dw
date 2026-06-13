"use client";

import { useEffect, useState } from "react";
import { formatPrice } from "@/lib/utils";
import { getWhatsAppUrl } from "@/lib/whatsapp";
import Link from "next/link";

export default function AbandonedCartsPage() {
  const [carts, setCarts] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchCarts = () => {
    fetch("/api/admin/abandoned-carts")
      .then((r) => r.json())
      .then((d) => { setCarts(d.carts || []); setLoading(false); })
      .catch(() => setLoading(false));
  };

  useEffect(() => { fetchCarts(); }, []);

  const handleDelete = async (id) => {
    if (!confirm("Delete this abandoned cart record?")) return;
    await fetch(`/api/admin/abandoned-carts?id=${id}`, { method: "DELETE" });
    fetchCarts();
  };

  const getWhatsAppFollowUp = (cart) => {
    const items = cart.items?.map((i) => `${i.name} × ${i.quantity}`).join(", ") || "";
    const msg = `Hi${cart.customerName ? ` ${cart.customerName}` : ""}, we noticed you left items in your cart at TrustSilcon (${items}). Total: ${formatPrice(cart.cartValue)}. Need help completing your COD order?`;
    return getWhatsAppUrl(msg, undefined, cart.phone?.replace(/\D/g, "").slice(-10) ? `91${cart.phone.replace(/\D/g, "").slice(-10)}` : undefined);
  };

  if (loading) return <p className="text-slate-500">Loading abandoned carts...</p>;

  return (
    <div>
      <h1 className="text-2xl font-bold text-slate-800">Abandoned Carts</h1>
      <p className="text-slate-500">Carts with contact info that did not convert to orders</p>

      {carts.length === 0 ? (
        <p className="mt-8 text-slate-500">No abandoned carts yet</p>
      ) : (
        <div className="mt-6 space-y-4">
          {carts.map((cart) => (
            <div key={cart._id} className="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-slate-200">
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div>
                  <p className="font-semibold text-slate-800">
                    {cart.customerName || "Anonymous"} · {formatPrice(cart.cartValue)}
                  </p>
                  <p className="mt-1 text-sm text-slate-500">
                    {cart.phone && `📱 ${cart.phone}`}
                    {cart.phone && cart.email && " · "}
                    {cart.email && `✉️ ${cart.email}`}
                  </p>
                  <p className="mt-1 text-xs text-slate-400">
                    Last active: {new Date(cart.lastActiveAt).toLocaleString("en-IN")}
                    {cart.checkoutStarted && " · Checkout started"}
                  </p>
                </div>
                <div className="flex gap-2">
                  {(cart.phone || cart.email) && (
                    <a
                      href={getWhatsAppFollowUp(cart)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="rounded-xl bg-emerald-500 px-4 py-2 text-sm font-medium text-white hover:bg-emerald-600"
                    >
                      WhatsApp Follow-up
                    </a>
                  )}
                  <button
                    type="button"
                    onClick={() => handleDelete(cart._id)}
                    className="rounded-xl bg-red-50 px-4 py-2 text-sm text-red-600 hover:bg-red-100"
                  >
                    Delete
                  </button>
                </div>
              </div>
              <div className="mt-3 space-y-1 border-t border-slate-100 pt-3">
                {cart.items?.map((item, i) => (
                  <div key={i} className="flex justify-between text-sm">
                    <span className="text-slate-600">{item.name} × {item.quantity}</span>
                    <span>{formatPrice(item.price * item.quantity)}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      <Link href="/admin/dashboard" className="mt-6 inline-block text-sm text-sky-500">
        ← Back to Dashboard
      </Link>
    </div>
  );
}
