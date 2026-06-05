"use client";

import { useState } from "react";
import Link from "next/link";
import { RevealSection } from "@/hooks/useReveal";
import FAQAccordion from "@/components/legal/FAQAccordion";
import { FAQ_ITEMS } from "@/lib/faq";

export default function FAQ() {
  return (
    <section className="py-12 sm:py-16">
      <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
        <RevealSection className="text-center">
          <h2 className="text-2xl font-bold text-slate-900 sm:text-3xl">Frequently Asked Questions</h2>
          <p className="mt-2 text-sm text-slate-500">Quick answers to common questions</p>
        </RevealSection>
        <div className="mt-8">
          <FAQAccordion items={FAQ_ITEMS.slice(0, 6)} />
        </div>
        <div className="mt-6 text-center">
          <Link href="/faq" className="text-sm font-semibold text-sky-600 hover:text-sky-700">
            View all FAQs →
          </Link>
        </div>
      </div>
    </section>
  );
}

export function NewsletterSection() {
  const [email, setEmail] = useState("");
  const [done, setDone] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    await fetch("/api/subscribers", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, marketingOptIn: true, source: "footer" }),
    });
    setDone(true);
  };

  return (
    <section className="relative overflow-hidden bg-[#0c1929] py-16 sm:py-20">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_rgba(14,165,233,0.1),transparent_70%)]" />
      <div className="relative mx-auto max-w-2xl px-4 text-center sm:px-6">
        <span className="text-xs font-bold uppercase tracking-widest text-sky-400">Newsletter</span>
        <h3 className="mt-3 text-2xl font-bold text-white sm:text-3xl">Wellness Updates & Exclusive Offers</h3>
        <p className="mt-3 text-sm text-slate-400">Max one email every 15 days. Unsubscribe anytime with one click.</p>
        {done ? (
          <p className="mt-6 text-sky-300">Thank you for subscribing!</p>
        ) : (
          <>
            <form onSubmit={handleSubmit} className="mt-8 flex flex-col gap-3 sm:flex-row">
              <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} placeholder="your@email.com" className="flex-1 rounded-full border-0 bg-white/10 px-6 py-3.5 text-sm text-white placeholder:text-slate-500 outline-none ring-1 ring-white/20 focus:ring-sky-400" />
              <button type="submit" className="rounded-full bg-gradient-to-r from-sky-500 to-blue-600 px-8 py-3.5 text-sm font-semibold text-white hover:from-sky-600 hover:to-blue-700">Subscribe</button>
            </form>
            <p className="mt-4 text-[10px] text-slate-500">
              By subscribing you agree to our marketing emails. See{" "}
              <a href="/privacy-policy" className="underline hover:text-sky-400">Privacy Policy</a>.
            </p>
          </>
        )}
      </div>
    </section>
  );
}
