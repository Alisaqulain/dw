"use client";

import Link from "next/link";
import Image from "next/image";
import { trackCTA, trackWhatsAppClick } from "@/lib/analytics";
import { getWhatsAppUrl } from "@/lib/whatsapp";
import WhatsAppIcon from "@/components/ui/WhatsAppIcon";

const TRUST = [
  { icon: "🔒", label: "Discreet Packaging" },
  { icon: "💰", label: "COD Available" },
  { icon: "🚚", label: "3–7 Day Delivery" },
  { icon: "⭐", label: "50,000+ Customers" },
];

export default function PremiumHero({ featuredProduct }) {
  const img = featuredProduct?.images?.[0]?.url || "https://images.unsplash.com/photo-1556228720-195a672e8a03?w=800&h=800&fit=crop";

  return (
    <section className="relative overflow-hidden bg-[#0c1929]">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_rgba(14,165,233,0.15),transparent_50%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_left,_rgba(16,185,129,0.1),transparent_50%)]" />

      <div className="relative mx-auto grid max-w-7xl gap-8 px-4 py-10 sm:px-6 lg:grid-cols-2 lg:items-center lg:gap-12 lg:py-16 lg:px-8">
        <div className="text-center lg:text-left">
          <span className="inline-flex items-center gap-2 rounded-full bg-emerald-500/20 px-4 py-1.5 text-xs font-bold uppercase tracking-wider text-emerald-300 ring-1 ring-emerald-400/30">
            <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-400" />
            India&apos;s #1 Wellness Store
          </span>

          <h1 className="mt-5 text-3xl font-bold leading-tight text-white sm:text-4xl lg:text-5xl xl:text-[3.25rem]">
            India&apos;s Premium
            <span className="mt-1 block bg-gradient-to-r from-sky-300 via-cyan-200 to-emerald-200 bg-clip-text text-transparent">
              Wellness Store
            </span>
          </h1>

          <p className="mx-auto mt-4 max-w-lg text-base text-slate-300 sm:text-lg lg:mx-0">
            Discreet Delivery • COD Available • Premium Quality
          </p>

          <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:justify-center lg:justify-start">
            <Link
              href="/shop"
              onClick={() => trackCTA("hero_shop_now", "/shop")}
              className="inline-flex min-h-[52px] items-center justify-center rounded-full bg-gradient-to-r from-sky-500 to-cyan-400 px-8 py-3.5 text-base font-bold text-white shadow-lg shadow-sky-500/30 transition hover:brightness-110 active:scale-[0.98]"
            >
              Shop Now
            </Link>
            <a
              href={getWhatsAppUrl("Hi TrustSilcon, I need help choosing a product.")}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => trackWhatsAppClick("hero")}
              className="inline-flex min-h-[52px] items-center justify-center gap-2 rounded-full border-2 border-emerald-400/60 bg-emerald-500/10 px-8 py-3.5 text-base font-bold text-emerald-300 backdrop-blur transition hover:bg-emerald-500/20 active:scale-[0.98]"
            >
              <WhatsAppIcon className="h-5 w-5" />
              WhatsApp Support
            </a>
          </div>

          <div className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-4">
            {TRUST.map(({ icon, label }) => (
              <div key={label} className="rounded-xl bg-white/5 px-3 py-2.5 text-center ring-1 ring-white/10 backdrop-blur-sm">
                <span className="text-lg">{icon}</span>
                <p className="mt-1 text-[10px] font-semibold leading-tight text-slate-300 sm:text-xs">{label}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="relative mx-auto w-full max-w-md lg:max-w-none">
          <div className="relative aspect-square overflow-hidden rounded-3xl bg-gradient-to-br from-sky-900/40 to-slate-800 ring-1 ring-white/10 shadow-2xl shadow-sky-900/50">
            <Image
              src={img}
              alt="Premium wellness product"
              fill
              priority
              sizes="(max-width:1024px) 90vw, 50vw"
              className="object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#0c1929]/60 via-transparent to-transparent" />
            <div className="absolute bottom-4 left-4 right-4 flex flex-wrap gap-2">
              <span className="rounded-full bg-emerald-500 px-3 py-1 text-xs font-bold text-white">COD Available</span>
              <span className="rounded-full bg-white/90 px-3 py-1 text-xs font-bold text-slate-800">Discreet Box</span>
            </div>
          </div>
          <div className="absolute -right-2 -top-2 rounded-2xl bg-white px-4 py-3 shadow-xl sm:-right-4 sm:-top-4">
            <p className="text-2xl font-bold text-sky-600">4.8★</p>
            <p className="text-[10px] font-medium text-slate-500">Customer Rating</p>
          </div>
        </div>
      </div>
    </section>
  );
}
