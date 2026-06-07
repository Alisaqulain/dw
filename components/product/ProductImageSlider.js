"use client";

import { useState, useCallback, useRef, useEffect } from "react";
import Image from "next/image";

export function getValidImages(images) {
  return (images || []).filter((img) => img?.url);
}

export default function ProductImageSlider({
  images,
  alt,
  sizes = "(max-width:768px) 50vw, 25vw",
  variant = "card",
  badge,
  className = "",
  index: controlledIndex,
  onIndexChange,
}) {
  const validImages = getValidImages(images);
  const [internalIndex, setInternalIndex] = useState(0);
  const touchStart = useRef(0);

  const active = controlledIndex ?? internalIndex;

  const setActive = useCallback(
    (index) => {
      const next = (index + validImages.length) % validImages.length;
      if (onIndexChange) onIndexChange(next);
      else setInternalIndex(next);
    },
    [validImages.length, onIndexChange]
  );

  useEffect(() => {
    if (controlledIndex != null && controlledIndex >= validImages.length) {
      onIndexChange?.(0);
    }
  }, [controlledIndex, validImages.length, onIndexChange]);

  const goTo = useCallback(
    (index) => {
      if (validImages.length <= 1) return;
      setActive(index);
    },
    [validImages.length, setActive]
  );

  const prev = (e) => {
    e?.preventDefault?.();
    e?.stopPropagation?.();
    goTo(active - 1);
  };

  const next = (e) => {
    e?.preventDefault?.();
    e?.stopPropagation?.();
    goTo(active + 1);
  };

  const onTouchStart = (e) => {
    touchStart.current = e.touches[0].clientX;
  };

  const onTouchEnd = (e) => {
    const diff = touchStart.current - e.changedTouches[0].clientX;
    if (Math.abs(diff) > 40) (diff > 0 ? next : prev)(e);
  };

  if (validImages.length === 0) {
    return (
      <div className={`relative flex items-center justify-center bg-gradient-to-br from-slate-50 to-sky-50/30 ${className}`}>
        <div className="h-20 w-20 rounded-full bg-gradient-to-br from-sky-200 to-blue-200 opacity-40" />
      </div>
    );
  }

  const isDetail = variant === "detail";
  const img = validImages[active];

  return (
    <div
      className={`relative overflow-hidden ${className}`}
      onTouchStart={validImages.length > 1 ? onTouchStart : undefined}
      onTouchEnd={validImages.length > 1 ? onTouchEnd : undefined}
    >
      <Image
        key={img.url}
        src={img.url}
        alt={alt}
        fill
        className={`object-cover transition-opacity duration-300 ${isDetail ? "" : "product-image"}`}
        sizes={sizes}
        unoptimized={img.url.startsWith("/uploads")}
      />

      {badge}

      {validImages.length > 1 && (
        <>
          <button
            type="button"
            onClick={prev}
            className={`absolute left-2 top-1/2 z-20 flex -translate-y-1/2 items-center justify-center rounded-full bg-white/90 text-slate-700 shadow-md transition hover:bg-white ${
              isDetail ? "h-10 w-10 sm:h-11 sm:w-11" : "h-8 w-8 sm:opacity-100"
            }`}
            aria-label="Previous image"
          >
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <button
            type="button"
            onClick={next}
            className={`absolute right-2 top-1/2 z-20 flex -translate-y-1/2 items-center justify-center rounded-full bg-white/90 text-slate-700 shadow-md transition hover:bg-white ${
              isDetail ? "h-10 w-10 sm:h-11 sm:w-11" : "h-8 w-8 sm:opacity-100"
            }`}
            aria-label="Next image"
          >
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>

          <div className="absolute bottom-2 left-1/2 z-20 flex -translate-x-1/2 gap-1.5">
            {validImages.map((_, i) => (
              <button
                key={i}
                type="button"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  setActive(i);
                }}
                className={`rounded-full transition-all ${
                  i === active ? "h-2 w-5 bg-white" : "h-2 w-2 bg-white/50"
                }`}
                aria-label={`Image ${i + 1}`}
              />
            ))}
          </div>

          <span className="absolute right-2 top-2 z-20 rounded-full bg-black/40 px-2 py-0.5 text-[10px] font-medium text-white backdrop-blur-sm">
            {active + 1}/{validImages.length}
          </span>
        </>
      )}
    </div>
  );
}
