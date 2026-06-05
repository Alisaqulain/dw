"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useCart } from "@/context/CartContext";
import { useToast } from "@/context/ToastContext";

export default function NewsletterPopup() {
  const [show, setShow] = useState(false);
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const { dismissNewsletter } = useCart();
  const { showToast } = useToast();
  const router = useRouter();

  useEffect(() => {
    const dismissed = localStorage.getItem("trustsilcon_newsletter_dismissed");
    if (dismissed) return;
    const timer = setTimeout(() => setShow(true), 15000);
    return () => clearTimeout(timer);
  }, []);

  const handleClose = () => {
    setShow(false);
    dismissNewsletter();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email) return;
    setLoading(true);
    try {
      await fetch("/api/subscribers", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, marketingOptIn: true, source: "popup" }),
      });
      showToast("Welcome! Check your inbox for wellness updates.");
      handleClose();
    } catch {
      showToast("Something went wrong", "error");
    }
    setLoading(false);
  };

  if (!show) return null;

  return (
    <>
      <div className="fixed inset-0 z-[100] bg-black/50 backdrop-blur-sm animate-fade-in" onClick={handleClose} />
      <div className="fixed inset-x-4 top-1/2 z-[101] mx-auto max-w-md -translate-y-1/2 overflow-hidden rounded-3xl bg-white shadow-2xl animate-slide-up">
        <div className="bg-gradient-to-br from-[#0c1929] to-[#1e3a5f] px-6 py-8 text-center text-white">
          <span className="text-3xl">✉️</span>
          <h3 className="mt-3 text-xl font-bold">Join TrustSilcon Wellness</h3>
          <p className="mt-2 text-sm text-sky-100">Get exclusive offers, new arrivals & wellness tips. Max 1 email every 15 days.</p>
        </div>
        <form onSubmit={handleSubmit} className="p-6">
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="your@email.com"
            className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-sky-400 focus:ring-2 focus:ring-sky-100"
          />
          <button type="submit" disabled={loading} className="mt-3 w-full rounded-full bg-sky-500 py-3 text-sm font-semibold text-white hover:bg-sky-600 disabled:opacity-50">
            {loading ? "Subscribing..." : "Subscribe & Save 10%"}
          </button>
          <p className="mt-3 text-center text-[10px] text-slate-400">
            By subscribing you agree to marketing emails.{" "}
            <button type="button" onClick={() => router.push("/privacy-policy")} className="underline">Privacy Policy</button>
            {" · "}Unsubscribe anytime.
          </p>
          <button type="button" onClick={handleClose} className="mt-2 w-full py-2 text-xs text-slate-400 hover:text-slate-600">No thanks</button>
        </form>
      </div>
    </>
  );
}
