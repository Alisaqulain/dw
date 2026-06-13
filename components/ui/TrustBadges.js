"use client";

import { useLanguage } from "@/context/LanguageContext";

const BADGE_KEYS = [
  { icon: "📦", key: "trust_discreetPackaging" },
  { icon: "🔒", key: "trust_noProductName" },
  { icon: "💵", key: "trust_codAvailable" },
  { icon: "🚀", key: "trust_fastDelivery" },
  { icon: "🛡️", key: "trust_privacyGuaranteed" },
  { icon: "✓", key: "trust_secureShopping" },
  { icon: "🚚", key: "trust_shiprocketPartner" },
  { icon: "💬", key: "trust_whatsappSupport" },
];

export default function TrustBadges({ variant = "grid", className = "" }) {
  const { t } = useLanguage();

  if (variant === "strip") {
    return (
      <div className={`flex flex-wrap items-center justify-center gap-x-4 gap-y-2 text-xs text-slate-600 ${className}`}>
        {BADGE_KEYS.slice(0, 4).map(({ icon, key }) => (
          <span key={key} className="flex items-center gap-1.5">
            <span aria-hidden>{icon}</span>
            {t(key)}
          </span>
        ))}
      </div>
    );
  }

  if (variant === "compact") {
    return (
      <div className={`grid grid-cols-2 gap-2 sm:grid-cols-4 ${className}`}>
        {BADGE_KEYS.map(({ icon, key }) => (
          <div key={key} className="flex items-center gap-2 rounded-xl bg-sky-50 px-3 py-2 text-xs font-medium text-sky-800 ring-1 ring-sky-100">
            <span aria-hidden>{icon}</span>
            <span className="leading-tight">{t(key)}</span>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className={`grid grid-cols-2 gap-3 sm:grid-cols-4 lg:grid-cols-4 ${className}`}>
      {BADGE_KEYS.map(({ icon, key }) => (
        <div key={key} className="rounded-2xl bg-white p-4 text-center shadow-sm ring-1 ring-sky-100">
          <span className="text-2xl" aria-hidden>{icon}</span>
          <p className="mt-2 text-xs font-semibold leading-snug text-slate-700">{t(key)}</p>
        </div>
      ))}
    </div>
  );
}

export function CodBadge({ className = "" }) {
  const { t } = useLanguage();
  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full bg-emerald-100 px-3 py-1 text-xs font-bold text-emerald-700 ${className}`}>
      💵 {t("codBadge")}
    </span>
  );
}
