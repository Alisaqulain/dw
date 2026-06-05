"use client";

import Link from "next/link";
import { PROMO_FEATURES } from "@/lib/constants";
import { RevealSection } from "@/hooks/useReveal";

export default function PromoFeatures() {
  return (
    <section className="border-b border-slate-100 bg-white py-6 sm:py-8">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5 lg:gap-4">
          {PROMO_FEATURES.map((item, i) => (
            <RevealSection key={item.title} delay={i * 50}>
              <Link
                href={item.href}
                className="group flex items-center gap-3 rounded-2xl bg-gradient-to-br from-slate-50 to-sky-50/50 p-4 ring-1 ring-slate-100 transition hover:-translate-y-0.5 hover:shadow-lg hover:shadow-sky-100/50 hover:ring-sky-200"
              >
                <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-white text-xl shadow-sm ring-1 ring-slate-100 transition group-hover:scale-110">
                  {item.icon}
                </span>
                <div className="min-w-0">
                  <p className="text-sm font-bold text-slate-800">{item.title}</p>
                  <p className="text-xs text-slate-500">{item.desc}</p>
                </div>
              </Link>
            </RevealSection>
          ))}
        </div>
      </div>
    </section>
  );
}
