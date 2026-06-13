"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { BANNER_SLIDES } from "@/lib/constants";
import { HERO_SLIDE_KEYS } from "@/lib/i18n/translations";
import { useLanguage } from "@/context/LanguageContext";

const INTERVAL_MS = 5500;

export default function HeroBannerSlider() {
  const { t } = useLanguage();
  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false);
  const [progress, setProgress] = useState(0);
  const touchStart = useRef(0);

  const goTo = useCallback((index) => {
    setActive((index + BANNER_SLIDES.length) % BANNER_SLIDES.length);
    setProgress(0);
  }, []);

  const next = useCallback(() => goTo(active + 1), [active, goTo]);
  const prev = useCallback(() => goTo(active - 1), [active, goTo]);

  useEffect(() => {
    if (paused) return;
    const step = 100 / (INTERVAL_MS / 50);
    const tick = setInterval(() => {
      setProgress((p) => {
        if (p >= 100) {
          next();
          return 0;
        }
        return p + step;
      });
    }, 50);
    return () => clearInterval(tick);
  }, [paused, active, next]);

  const handleTouchStart = (e) => {
    touchStart.current = e.touches[0].clientX;
  };

  const handleTouchEnd = (e) => {
    const diff = touchStart.current - e.changedTouches[0].clientX;
    if (Math.abs(diff) > 50) (diff > 0 ? next : prev)();
  };

  const slide = BANNER_SLIDES[active];
  const slideText = HERO_SLIDE_KEYS[slide.id];

  return (
    <section
      className="relative overflow-hidden bg-[#0c1929]"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => { setPaused(false); setProgress(0); }}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
      aria-label="Promotional banners"
    >
      <div className="relative aspect-[3/4] min-h-[420px] max-h-[90vh] sm:aspect-[21/9] sm:min-h-[320px] lg:aspect-[21/8]">
        {BANNER_SLIDES.map((s, i) => (
          <div
            key={s.id}
            className={`absolute inset-0 transition-opacity duration-700 ease-out ${i === active ? "opacity-100 z-10" : "opacity-0 z-0 pointer-events-none"}`}
            aria-hidden={i !== active}
          >
            <Image
              src={s.image}
              alt={`${s.title} ${s.highlight} — TrustSilcon`}
              fill
              priority={i === 0}
              className={`object-cover transition-transform duration-[8000ms] ease-out ${i === active ? "scale-110" : "scale-100"}`}
              sizes="100vw"
            />
            <div className={`absolute inset-0 bg-gradient-to-r ${s.gradient}`} />
            <div className="absolute inset-0 bg-gradient-to-t from-[#0c1929]/80 via-transparent to-[#0c1929]/30" />
          </div>
        ))}

        <div className="relative z-20 mx-auto flex h-full max-w-7xl flex-col justify-center px-4 py-10 sm:px-6 sm:py-14 lg:px-8">
          <div key={slide.id} className="max-w-2xl animate-banner-content">
            <span className={`inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-xs font-bold uppercase tracking-wider text-white ${slide.accent} shadow-lg`}>
              <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-white" />
              {slideText ? t(slideText.badge) : slide.badge}
            </span>
            <h1 className="mt-4 text-3xl font-bold leading-[1.15] text-white sm:mt-5 sm:text-5xl lg:text-6xl">
              {slideText ? t(slideText.title) : slide.title}
              <span className="mt-1 block bg-gradient-to-r from-white via-sky-100 to-cyan-200 bg-clip-text text-transparent">
                {slideText ? t(slideText.highlight) : slide.highlight}
              </span>
            </h1>
            <p className="mt-3 max-w-lg text-sm leading-relaxed text-white/85 sm:mt-4 sm:text-lg">
              {slideText ? t(slideText.description) : slide.description}
            </p>
            <div className="mt-6 flex flex-col gap-2.5 sm:mt-8 sm:flex-row sm:flex-wrap sm:gap-3">
              <Link
                href={slide.href}
                className="inline-flex min-h-[48px] items-center justify-center gap-2 rounded-full bg-white px-6 py-3 text-sm font-bold text-[#0c1929] shadow-xl transition active:scale-[0.98] sm:px-8 sm:py-3.5"
              >
                {slideText ? t(slideText.cta) : slide.cta}
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </Link>
              <Link
                href="/shop"
                className="inline-flex min-h-[48px] items-center justify-center rounded-full border-2 border-white/30 bg-white/10 px-6 py-3 text-sm font-semibold text-white backdrop-blur-sm transition active:bg-white/20 sm:px-8 sm:py-3.5"
              >
                {t("shopAllProducts")}
              </Link>
            </div>
          </div>
        </div>

        <button
          type="button"
          onClick={prev}
          className="absolute left-2 top-1/2 z-30 hidden h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-white/15 text-white backdrop-blur-md transition hover:bg-white/25 sm:flex sm:left-6 sm:h-12 sm:w-12"
          aria-label="Previous slide"
        >
          <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        <button
          type="button"
          onClick={next}
          className="absolute right-2 top-1/2 z-30 hidden h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-white/15 text-white backdrop-blur-md transition hover:bg-white/25 sm:flex sm:right-6 sm:h-12 sm:w-12"
          aria-label="Next slide"
        >
          <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>

      <div className="relative z-20 border-t border-white/10 bg-[#0c1929]/90 backdrop-blur-md">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-3 sm:px-6 lg:px-8">
          <div className="flex gap-2">
            {BANNER_SLIDES.map((s, i) => (
              <button
                key={s.id}
                type="button"
                onClick={() => goTo(i)}
                className={`relative h-2 overflow-hidden rounded-full transition-all ${i === active ? "w-10 bg-white/30" : "w-2 bg-white/20 hover:bg-white/40"}`}
                aria-label={`Go to slide ${i + 1}`}
                aria-current={i === active}
              >
                {i === active && (
                  <span
                    className="absolute inset-y-0 left-0 rounded-full bg-white transition-all duration-100"
                    style={{ width: `${progress}%` }}
                  />
                )}
              </button>
            ))}
          </div>
          <p className="hidden text-xs font-medium text-slate-400 sm:block">
            {active + 1} / {BANNER_SLIDES.length}
          </p>
        </div>
      </div>
    </section>
  );
}
