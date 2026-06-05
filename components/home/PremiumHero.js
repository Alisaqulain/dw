"use client";

import Link from "next/link";
import Image from "next/image";
import Logo from "@/components/layout/Logo";
import { TRUST_BADGES } from "@/lib/constants";
import { RevealSection } from "@/hooks/useReveal";

export default function PremiumHero() {
  return (
    <section className="relative min-h-[85vh] overflow-hidden bg-[#0c1929] lg:min-h-[92vh]">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_20%_50%,_rgba(14,165,233,0.15),transparent_50%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_80%_20%,_rgba(59,130,246,0.12),transparent_40%)]" />
      <div className="absolute -right-32 top-0 h-[500px] w-[500px] rounded-full bg-sky-500/10 blur-3xl" />
      <div className="absolute -left-32 bottom-0 h-[400px] w-[400px] rounded-full bg-blue-600/10 blur-3xl" />

      {/* Decorative grid */}
      <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: "linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)", backgroundSize: "60px 60px" }} />

      <div className="relative mx-auto flex min-h-[85vh] max-w-7xl flex-col justify-center px-4 py-16 sm:px-6 lg:min-h-[92vh] lg:px-8 lg:py-24">
        <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-20">
          <RevealSection>
            <div className="inline-flex items-center gap-2 rounded-full border border-sky-400/30 bg-sky-500/10 px-5 py-2 text-xs font-semibold uppercase tracking-wider text-sky-300">
              <span className="h-2 w-2 animate-pulse rounded-full bg-sky-400" />
              India&apos;s Premium Intimate Wellness Brand
            </div>
            <h1 className="mt-8 text-5xl font-bold leading-[1.1] tracking-tight text-white sm:text-6xl lg:text-7xl">
              Adult Wellness,
              <span className="mt-2 block bg-gradient-to-r from-sky-300 via-cyan-300 to-blue-300 bg-clip-text text-transparent">
                Elevated.
              </span>
            </h1>
            <p className="mt-6 max-w-xl text-lg leading-relaxed text-slate-300 sm:text-xl">
              Discover body-safe silicone intimate wellness products with discreet delivery, secure checkout, and premium care you can trust.
            </p>
            <div className="mt-10 flex flex-col gap-4 sm:flex-row">
              <Link href="/shop?sort=bestseller" className="inline-flex items-center justify-center gap-2 rounded-full bg-gradient-to-r from-sky-500 to-blue-600 px-10 py-4 text-base font-semibold text-white shadow-xl shadow-sky-500/20 transition hover:scale-[1.02] hover:shadow-sky-400/30">
                Shop Bestsellers
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg>
              </Link>
              <Link href="/track-order" className="inline-flex items-center justify-center rounded-full border-2 border-white/20 bg-white/5 px-10 py-4 text-base font-semibold text-white backdrop-blur-sm transition hover:border-sky-400/50 hover:bg-white/10">
                Track Your Order
              </Link>
            </div>
            <div className="mt-12 grid grid-cols-2 gap-4 sm:grid-cols-4">
              {[
                { val: "50,000+", label: "Happy Customers" },
                { val: "4.8★", label: "Average Rating" },
                { val: "100%", label: "Discreet Packaging" },
                { val: "3–7 Days", label: "Fast Delivery" },
              ].map((s) => (
                <div key={s.label} className="rounded-2xl bg-white/5 px-4 py-4 text-center backdrop-blur-sm ring-1 ring-white/10 transition hover:bg-white/10">
                  <p className="text-xl font-bold text-white sm:text-2xl">{s.val}</p>
                  <p className="mt-1 text-[11px] font-medium text-slate-400">{s.label}</p>
                </div>
              ))}
            </div>
          </RevealSection>

          <RevealSection delay={200} className="relative hidden lg:block">
            <div className="relative aspect-[4/5] overflow-hidden rounded-[2rem] bg-gradient-to-br from-sky-800/40 to-blue-900/40 ring-1 ring-white/10 shadow-2xl shadow-black/30">
              <Image
                src="https://images.unsplash.com/photo-1556228720-195a672e8a03?w=900&h=1100&fit=crop"
                alt="Premium intimate wellness products"
                fill
                className="object-cover"
                priority
                sizes="50vw"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0c1929] via-[#0c1929]/20 to-transparent" />
              <div className="absolute bottom-8 left-8 right-8 space-y-3">
                <div className="rounded-2xl bg-white/10 p-5 backdrop-blur-md ring-1 ring-white/20">
                  <p className="text-base font-semibold text-white">Discreet Delivery Guaranteed</p>
                  <p className="mt-1 text-sm text-slate-300">Plain packaging · No labels · Private billing</p>
                </div>
                <div className="flex gap-2">
                  {["COD Available", "Free Ship ₹999+", "Body-Safe"].map((t) => (
                    <span key={t} className="rounded-full bg-sky-500/20 px-3 py-1 text-xs font-medium text-sky-200 ring-1 ring-sky-400/30">{t}</span>
                  ))}
                </div>
              </div>
            </div>
            <div className="absolute -bottom-6 -left-6 rounded-2xl bg-white p-5 shadow-2xl">
              <Logo size="sm" href="/" />
            </div>
            <div className="absolute -right-4 top-8 rounded-2xl bg-emerald-500 px-5 py-3 shadow-xl">
              <p className="text-xs font-bold text-white">✓ Verified Quality</p>
            </div>
          </RevealSection>
        </div>
      </div>

      <div className="relative border-t border-white/10 bg-white/[0.03] backdrop-blur-md">
        <div className="mx-auto flex max-w-7xl gap-6 overflow-x-auto px-4 py-5 scrollbar-hide sm:justify-center sm:px-6">
          {TRUST_BADGES.map((b) => (
            <div key={b.title} className="flex shrink-0 items-center gap-2.5 rounded-full bg-white/5 px-5 py-2.5 ring-1 ring-white/10">
              <span className="text-lg">{b.icon}</span>
              <div>
                <p className="text-xs font-semibold text-white">{b.title}</p>
                <p className="text-[10px] text-slate-400">{b.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
