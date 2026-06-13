"use client";

import { useLanguage } from "@/context/LanguageContext";

export default function LanguageSwitcher({ className = "" }) {
  const { lang, setLang, t } = useLanguage();

  return (
    <div className={`flex items-center gap-1 rounded-full bg-slate-100 p-0.5 ${className}`}>
      <button
        type="button"
        onClick={() => setLang("en")}
        className={`rounded-full px-2.5 py-1 text-[11px] font-semibold transition sm:px-3 sm:text-xs ${
          lang === "en" ? "bg-white text-slate-800 shadow-sm" : "text-slate-500 hover:text-slate-700"
        }`}
        aria-label={t("english")}
      >
        EN
      </button>
      <button
        type="button"
        onClick={() => setLang("hi")}
        className={`rounded-full px-2.5 py-1 text-[11px] font-semibold transition sm:px-3 sm:text-xs ${
          lang === "hi" ? "bg-white text-slate-800 shadow-sm" : "text-slate-500 hover:text-slate-700"
        }`}
        aria-label={t("hindi")}
      >
        HI
      </button>
    </div>
  );
}
