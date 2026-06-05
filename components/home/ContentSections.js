"use client";

import Link from "next/link";
import Image from "next/image";
import { RevealSection } from "@/hooks/useReveal";

export function DiscreetDeliverySection() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-slate-900 via-[#0c1929] to-slate-900 py-20 sm:py-28">
      <div className="absolute inset-0 opacity-20" style={{ backgroundImage: "radial-gradient(circle at 30% 50%, #0ea5e9 0%, transparent 50%)" }} />
      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid items-center gap-12 lg:grid-cols-2">
          <RevealSection>
            <span className="text-xs font-bold uppercase tracking-widest text-sky-400">Complete Privacy</span>
            <h2 className="mt-3 text-3xl font-bold text-white sm:text-4xl lg:text-5xl">
              Discreet Delivery,<br />Every Single Time
            </h2>
            <p className="mt-5 text-lg leading-relaxed text-slate-300">
              Your privacy is non-negotiable. Every TrustSilcon order arrives in plain, unmarked packaging with no product names, brand labels, or revealing descriptions on the outside.
            </p>
            <ul className="mt-8 space-y-4">
              {[
                "Plain brown box — looks like any regular parcel",
                "No product names on shipping label",
                "Discreet merchant name on bank statement",
                "Sealed inner packaging for hygiene",
              ].map((item) => (
                <li key={item} className="flex items-start gap-3 text-sm text-slate-300">
                  <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-sky-500/20 text-xs text-sky-400">✓</span>
                  {item}
                </li>
              ))}
            </ul>
            <Link href="/shipping-policy" className="mt-8 inline-flex items-center gap-2 text-sm font-semibold text-sky-400 hover:text-sky-300">
              Read Shipping Policy →
            </Link>
          </RevealSection>
          <RevealSection delay={150}>
            <div className="relative mx-auto aspect-square max-w-md overflow-hidden rounded-3xl ring-1 ring-white/10 lg:max-w-none">
              <Image src="https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=700&h=700&fit=crop" alt="Discreet plain packaging" fill className="object-cover opacity-80" sizes="(max-width:768px) 100vw, 50vw" />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0c1929] via-transparent to-transparent" />
              <div className="absolute bottom-6 left-6 right-6 rounded-2xl bg-white/10 p-5 backdrop-blur-md ring-1 ring-white/20">
                <p className="font-semibold text-white">📦 Your Secret, Safe With Us</p>
                <p className="mt-1 text-sm text-slate-300">Even the delivery person won&apos;t know what&apos;s inside.</p>
              </div>
            </div>
          </RevealSection>
        </div>
      </div>
    </section>
  );
}

export function BodySafeSection() {
  return (
    <section className="bg-gradient-to-b from-sky-50 to-white py-20 sm:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <RevealSection className="text-center">
          <span className="text-xs font-bold uppercase tracking-widest text-sky-500">Our Promise</span>
          <h2 className="mt-3 text-3xl font-bold text-slate-900 sm:text-4xl">Body-Safe Silicone, Always</h2>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-slate-600">
            Every TrustSilcon product is crafted from medical-grade, non-toxic silicone — hypoallergenic, phthalate-free, and designed for your wellness and safety.
          </p>
        </RevealSection>
        <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {[
            { icon: "🧪", title: "Medical-Grade", desc: "FDA-compliant silicone materials used in healthcare applications." },
            { icon: "🚫", title: "Non-Toxic", desc: "Free from phthalates, BPA, and harmful chemical additives." },
            { icon: "💧", title: "Easy to Clean", desc: "Non-porous surface resists bacteria. Simple soap-and-water care." },
            { icon: "✅", title: "Quality Tested", desc: "Every batch tested for safety, durability, and performance." },
          ].map((item, i) => (
            <RevealSection key={item.title} delay={i * 80}>
              <div className="group h-full rounded-3xl bg-white p-8 shadow-sm ring-1 ring-slate-100 transition hover:-translate-y-1 hover:shadow-xl hover:shadow-sky-100/50 hover:ring-sky-200">
                <span className="inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-sky-100 to-blue-50 text-2xl ring-1 ring-sky-100 transition group-hover:scale-110">{item.icon}</span>
                <h3 className="mt-5 text-lg font-bold text-slate-900">{item.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-slate-500">{item.desc}</p>
              </div>
            </RevealSection>
          ))}
        </div>
      </div>
    </section>
  );
}

export function ShiprocketSection() {
  return (
    <section className="border-y border-sky-100 bg-white py-20 sm:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="overflow-hidden rounded-3xl bg-gradient-to-br from-[#0c1929] to-[#1e3a5f] p-8 sm:p-12 lg:p-16">
          <div className="grid items-center gap-10 lg:grid-cols-2">
            <RevealSection>
              <span className="text-xs font-bold uppercase tracking-widest text-sky-400">Powered by Shiprocket</span>
              <h2 className="mt-3 text-3xl font-bold text-white sm:text-4xl">Track Every Order in Real Time</h2>
              <p className="mt-4 text-slate-300 leading-relaxed">
                Once your order ships, get live tracking updates via SMS and email. Know exactly when your discreet package is on its way.
              </p>
              <div className="mt-8 grid grid-cols-3 gap-4">
                {[
                  { step: "1", label: "Order Placed" },
                  { step: "2", label: "Shipped" },
                  { step: "3", label: "Delivered" },
                ].map((s) => (
                  <div key={s.step} className="text-center">
                    <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-full bg-sky-500/20 text-sm font-bold text-sky-300 ring-1 ring-sky-400/30">{s.step}</div>
                    <p className="mt-2 text-xs font-medium text-slate-400">{s.label}</p>
                  </div>
                ))}
              </div>
              <Link href="/track-order" className="mt-8 inline-flex rounded-full bg-sky-500 px-8 py-3.5 text-sm font-semibold text-white hover:bg-sky-400">
                Track My Order →
              </Link>
            </RevealSection>
            <RevealSection delay={150}>
              <div className="rounded-2xl bg-white/5 p-6 ring-1 ring-white/10 backdrop-blur-sm">
                <p className="text-sm font-semibold text-white">Delivery Highlights</p>
                <div className="mt-4 space-y-3">
                  {[
                    { icon: "🚀", text: "3–7 business days pan-India delivery" },
                    { icon: "📍", text: "Real-time tracking with AWB number" },
                    { icon: "💰", text: "Free shipping on orders above ₹999" },
                    { icon: "💵", text: "Cash on Delivery available" },
                  ].map((item) => (
                    <div key={item.text} className="flex items-center gap-3 rounded-xl bg-white/5 px-4 py-3">
                      <span>{item.icon}</span>
                      <span className="text-sm text-slate-300">{item.text}</span>
                    </div>
                  ))}
                </div>
              </div>
            </RevealSection>
          </div>
        </div>
      </div>
    </section>
  );
}

export function BlogGuideSection() {
  const guides = [
    { icon: "🛡️", title: "Understanding Body-Safe Silicone", desc: "Why medical-grade silicone matters for intimate wellness.", href: "/about" },
    { icon: "📦", title: "Discreet Shopping Guide", desc: "How we protect your privacy from checkout to delivery.", href: "/privacy-policy" },
    { icon: "✨", title: "Product Care & Maintenance", desc: "Keep your wellness products clean and lasting longer.", href: "/about" },
    { icon: "📖", title: "First-Time Buyer's Guide", desc: "Everything to know before your first TrustSilcon order.", href: "/shop?collection=Starter Kits" },
  ];

  return (
    <section className="bg-slate-50 py-20 sm:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <RevealSection className="text-center">
          <span className="text-xs font-bold uppercase tracking-widest text-sky-500">Wellness Guides</span>
          <h2 className="mt-3 text-3xl font-bold text-slate-900 sm:text-4xl">Learn & Explore</h2>
          <p className="mx-auto mt-3 max-w-xl text-slate-500">Expert guides to help you make informed wellness choices.</p>
        </RevealSection>
        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {guides.map((g, i) => (
            <RevealSection key={g.title} delay={i * 60}>
              <Link href={g.href} className="group flex h-full flex-col rounded-3xl bg-white p-6 shadow-sm ring-1 ring-slate-100 transition hover:-translate-y-1 hover:shadow-lg hover:ring-sky-200">
                <span className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-sky-50 text-xl ring-1 ring-sky-100 group-hover:bg-sky-100">{g.icon}</span>
                <h3 className="mt-4 font-bold text-slate-900 group-hover:text-sky-600">{g.title}</h3>
                <p className="mt-2 flex-1 text-sm text-slate-500">{g.desc}</p>
                <span className="mt-4 text-xs font-semibold text-sky-500">Read more →</span>
              </Link>
            </RevealSection>
          ))}
        </div>
      </div>
    </section>
  );
}
