"use client";

import { RevealSection } from "@/hooks/useReveal";

const REASONS = [
  { icon: "📦", title: "100% Discreet Packaging", desc: "Plain unmarked boxes. No product name visible on delivery." },
  { icon: "💰", title: "Cash On Delivery", desc: "Pay when your order arrives. No online payment needed." },
  { icon: "🚀", title: "Fast Pan-India Delivery", desc: "3–7 business days with real-time tracking via Shiprocket." },
  { icon: "🛡", title: "Body-Safe Quality", desc: "Medical-grade silicone. Non-toxic, hypoallergenic materials." },
  { icon: "🔒", title: "Secure & Private", desc: "Your data is protected. Discreet billing on statements." },
  { icon: "💬", title: "WhatsApp Support", desc: "Get help choosing the right product anytime." },
];

export default function WhyChooseUs({ title = "Why Customers Choose TrustSilcon" }) {
  return (
    <section className="py-12 sm:py-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <RevealSection className="text-center">
          <span className="text-xs font-bold uppercase tracking-widest text-sky-500">Our Promise</span>
          <h2 className="mt-2 text-2xl font-bold text-slate-900 sm:text-3xl">{title}</h2>
        </RevealSection>
        <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {REASONS.map((item, i) => (
            <RevealSection key={item.title} delay={i * 50}>
              <div className="flex h-full gap-4 rounded-2xl bg-white p-5 shadow-sm ring-1 ring-slate-100 transition hover:shadow-md hover:ring-sky-100">
                <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-sky-50 text-2xl">{item.icon}</span>
                <div>
                  <h3 className="font-bold text-slate-800">{item.title}</h3>
                  <p className="mt-1 text-sm leading-relaxed text-slate-500">{item.desc}</p>
                </div>
              </div>
            </RevealSection>
          ))}
        </div>
      </div>
    </section>
  );
}
