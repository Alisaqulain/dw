"use client";

import Link from "next/link";
import { CATEGORY_TILES } from "@/lib/constants";
import { RevealSection } from "@/hooks/useReveal";

function CategoryCard({ cat, index }) {
  return (
    <RevealSection delay={index * 100}>
      <Link
        href={cat.href}
        className={`category-card group relative flex min-h-[280px] flex-col items-center justify-between overflow-hidden rounded-[1.75rem] p-6 sm:min-h-[320px] sm:p-7 ${index % 2 === 0 ? "category-card-float" : "category-card-float-delayed"}`}
        style={{ animationDelay: `${index * 0.15}s` }}
      >
        {/* Animated gradient background */}
        <div className={`absolute inset-0 bg-gradient-to-br ${cat.gradient} category-gradient-shift`} />

        {/* Mesh overlay */}
        <div className="absolute inset-0 opacity-30" style={{ backgroundImage: "radial-gradient(circle at 20% 80%, white 1px, transparent 1px), radial-gradient(circle at 80% 20%, white 1px, transparent 1px)", backgroundSize: "40px 40px" }} />

        {/* Floating orbs */}
        <div className="absolute -left-8 -top-8 h-32 w-32 rounded-full bg-white/20 blur-2xl category-orb-1" />
        <div className="absolute -bottom-10 -right-10 h-40 w-40 rounded-full bg-white/15 blur-3xl category-orb-2" />

        {/* Shine sweep on hover */}
        <div className="category-shine absolute inset-0 -translate-x-full skew-x-12 bg-gradient-to-r from-transparent via-white/25 to-transparent" />

        {/* Icon */}
        <div className="relative z-10 mt-2">
          <div className={`flex h-20 w-20 items-center justify-center rounded-2xl bg-white/20 text-4xl shadow-2xl backdrop-blur-md ring-2 ring-white/40 transition-all duration-500 group-hover:scale-110 group-hover:bg-white/30 group-hover:ring-white/60 sm:h-24 sm:w-24 sm:text-5xl ${cat.glow} group-hover:shadow-2xl`}>
            <span className="category-icon-bounce inline-block drop-shadow-lg">{cat.icon}</span>
          </div>
        </div>

        {/* Text content */}
        <div className="relative z-10 w-full text-center">
          <h3 className="text-lg font-bold tracking-tight text-white sm:text-xl">{cat.label}</h3>
          <p className="mt-2 line-clamp-2 text-xs leading-relaxed text-white/75 sm:text-sm">{cat.desc}</p>
          <div className="mt-4 inline-flex items-center gap-2 rounded-full bg-white/20 px-5 py-2.5 text-xs font-semibold text-white backdrop-blur-md ring-1 ring-white/30 transition-all duration-300 group-hover:gap-3 group-hover:bg-white group-hover:text-slate-900 group-hover:shadow-lg">
            Explore Collection
            <svg className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </div>
        </div>

        {/* Bottom glow line */}
        <div className="absolute bottom-0 left-1/2 h-1 w-0 -translate-x-1/2 rounded-full bg-white/80 transition-all duration-500 group-hover:w-3/4" />
      </Link>
    </RevealSection>
  );
}

export default function CategoryTiles() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-slate-50 via-white to-sky-50/40 py-20 sm:py-28">
      {/* Background decorations */}
      <div className="pointer-events-none absolute left-1/2 top-0 h-px w-3/4 -translate-x-1/2 bg-gradient-to-r from-transparent via-sky-300 to-transparent" />
      <div className="pointer-events-none absolute -left-40 top-20 h-80 w-80 rounded-full bg-sky-200/30 blur-3xl category-orb-1" />
      <div className="pointer-events-none absolute -right-40 bottom-10 h-96 w-96 rounded-full bg-violet-200/25 blur-3xl category-orb-2" />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <RevealSection className="text-center">
          <span className="inline-flex items-center gap-2 rounded-full bg-sky-100 px-4 py-1.5 text-xs font-bold uppercase tracking-widest text-sky-600">
            <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-sky-500" />
            Explore Collections
          </span>
          <h2 className="mt-5 text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl lg:text-5xl">
            Shop by Category
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-base text-slate-500 sm:text-lg">
            Curated intimate wellness for every need — pick your path and explore premium, body-safe products.
          </p>
        </RevealSection>

        {/* Desktop & tablet grid */}
        <div className="mt-14 hidden gap-5 sm:grid sm:grid-cols-2 lg:grid-cols-5 lg:gap-6">
          {CATEGORY_TILES.map((cat, i) => (
            <CategoryCard key={cat.label} cat={cat} index={i} />
          ))}
        </div>

        {/* Mobile horizontal scroll carousel */}
        <div className="mt-10 flex snap-x snap-mandatory gap-4 overflow-x-auto pb-4 scrollbar-hide sm:hidden">
          {CATEGORY_TILES.map((cat, i) => (
            <div key={cat.label} className="w-[78vw] max-w-[300px] shrink-0 snap-center">
              <CategoryCard cat={cat} index={i} />
            </div>
          ))}
        </div>

        {/* Scroll hint — mobile only */}
        <p className="mt-4 text-center text-xs text-slate-400 sm:hidden">← Swipe to explore all categories →</p>
      </div>
    </section>
  );
}
