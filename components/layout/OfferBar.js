"use client";

import { OFFER_TEXT } from "@/lib/constants";

export default function OfferBar() {
  return (
    <div className="relative overflow-hidden bg-gradient-to-r from-[#0c1929] via-[#1a2f4a] to-[#0c1929] text-white">
      <div className="absolute inset-0 bg-[linear-gradient(90deg,transparent,rgba(14,165,233,0.08),transparent)]" />
      <div className="relative flex animate-marquee whitespace-nowrap py-2 text-[11px] font-medium tracking-wide sm:py-2.5 sm:text-sm">
        {[...Array(2)].map((_, i) => (
          <span key={i} className="mx-8 inline-flex items-center gap-2">
            <span className="inline-block h-1.5 w-1.5 animate-pulse rounded-full bg-rose-400" />
            {OFFER_TEXT}
          </span>
        ))}
      </div>
    </div>
  );
}
