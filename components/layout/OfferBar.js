"use client";

import { STORE_CONTACT } from "@/lib/constants";

const OFFER_ITEMS = [
  `📞 ${STORE_CONTACT.phones[0]?.display || ""}`,
  `✉ ${STORE_CONTACT.email}`,
  "🔥 Hot Sale — Up to 40% Off",
  "📦 Discreet Delivery Across India",
  "💳 COD Available",
  "🚀 Free Shipping above ₹999",
];

export default function OfferBar() {
  const text = OFFER_ITEMS.join("  •  ");

  return (
    <div className="relative overflow-hidden bg-gradient-to-r from-[#0c1929] via-[#1a2f4a] to-[#0c1929] text-white">
      <div className="absolute inset-0 bg-[linear-gradient(90deg,transparent,rgba(14,165,233,0.08),transparent)]" />
      {/* Mobile: static real contact info */}
      <div className="relative hidden items-center justify-center gap-3 px-4 py-2.5 text-center text-[11px] font-medium sm:flex sm:text-xs">
        <a href={`tel:${STORE_CONTACT.phones[0]?.tel}`} className="hover:text-sky-300">
          📞 {STORE_CONTACT.phones[0]?.display}
        </a>
        <span className="text-white/30">|</span>
        <a href={`mailto:${STORE_CONTACT.email}`} className="hover:text-sky-300">
          ✉ {STORE_CONTACT.email}
        </a>
        <span className="hidden text-white/30 md:inline">|</span>
        <span className="hidden md:inline">🔥 Hot Sale · Discreet Delivery · COD · Free Ship ₹999+</span>
      </div>
      {/* Mobile marquee with real data */}
      <div className="relative flex animate-marquee whitespace-nowrap py-2 text-[11px] font-medium tracking-wide sm:hidden">
        {[...Array(2)].map((_, i) => (
          <span key={i} className="mx-6 inline-flex items-center gap-2">
            <span className="inline-block h-1.5 w-1.5 animate-pulse rounded-full bg-sky-400" />
            {text}
          </span>
        ))}
      </div>
    </div>
  );
}
