"use client";

import { TRUST_BADGES } from "@/lib/constants";
import { RevealSection } from "@/hooks/useReveal";
import { useLanguage } from "@/context/LanguageContext";

const TRUST_KEYS = [
  "trust_discreetPackaging",
  "trust_noProductName",
  "trust_codAvailable",
  "trust_fastDelivery",
  "trust_privacyGuaranteed",
];

export default function WhyTrustSilcon() {
  const { t } = useLanguage();

  return (
    <section className="bg-white py-12 sm:py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <RevealSection className="text-center">
          <span className="text-xs font-bold uppercase tracking-widest text-sky-500">{t("whyBadge")}</span>
          <h2 className="mt-2 text-2xl font-bold text-slate-900 sm:text-3xl">{t("whyTitle")}</h2>
          <p className="mx-auto mt-3 max-w-2xl text-slate-500">{t("whyDesc")}</p>
        </RevealSection>
        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-5">
          {TRUST_BADGES.map((item, i) => (
            <RevealSection key={item.title} delay={i * 80}>
              <div className="group rounded-2xl border border-slate-100 bg-slate-50/50 p-6 text-center transition hover:border-sky-200 hover:bg-sky-50/50 hover:shadow-lg hover:shadow-sky-100/50">
                <span className="inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-white text-2xl shadow-sm ring-1 ring-slate-100 group-hover:ring-sky-200">{item.icon}</span>
                <h3 className="mt-4 text-sm font-bold text-slate-800">{TRUST_KEYS[i] ? t(TRUST_KEYS[i]) : item.title}</h3>
                <p className="mt-1.5 text-xs leading-relaxed text-slate-500">{item.desc}</p>
              </div>
            </RevealSection>
          ))}
        </div>
      </div>
    </section>
  );
}
