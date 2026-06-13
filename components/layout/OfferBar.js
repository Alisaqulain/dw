"use client";

import { STORE_CONTACT } from "@/lib/constants";
import { useLanguage } from "@/context/LanguageContext";

const phoneLine = STORE_CONTACT.phones.map((p) => p.display).join(" / ");

export default function OfferBar() {
  const { t } = useLanguage();

  const OFFER_ITEMS = [
    `📞 ${phoneLine}`,
    `✉ ${STORE_CONTACT.email}`,
    `🔥 ${t("offerHotSale")}`,
    `📦 ${t("offerDiscreet")}`,
    `💳 ${t("offerCod")}`,
    `🚀 ${t("offerFreeShip")}`,
  ];
  const text = OFFER_ITEMS.join("  •  ");

  return (
    <div className="relative overflow-hidden bg-gradient-to-r from-[#0c1929] via-[#1a2f4a] to-[#0c1929] text-white">
      <div className="absolute inset-0 bg-[linear-gradient(90deg,transparent,rgba(14,165,233,0.08),transparent)]" />
      <div className="relative hidden items-center justify-center gap-3 px-4 py-2.5 text-center text-[11px] font-medium sm:flex sm:text-xs">
        {STORE_CONTACT.phones.map((phone, i) => (
          <span key={phone.tel} className="inline-flex items-center gap-3">
            {i > 0 && <span className="text-white/30">/</span>}
            <a href={`tel:${phone.tel}`} className="hover:text-sky-300">
              📞 {phone.display}
            </a>
          </span>
        ))}
        <span className="text-white/30">|</span>
        <a href={`mailto:${STORE_CONTACT.email}`} className="hover:text-sky-300">
          ✉ {STORE_CONTACT.email}
        </a>
        <span className="hidden text-white/30 md:inline">|</span>
        <span className="hidden md:inline">{t("offerBarDesktop")}</span>
      </div>
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
