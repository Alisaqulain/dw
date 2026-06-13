"use client";

import { createContext, useContext, useEffect, useState, useCallback } from "react";
import { translate } from "@/lib/i18n/translations";

const LanguageContext = createContext(null);
const LANG_KEY = "trustsilcon_lang";

export function LanguageProvider({ children }) {
  const [lang, setLangState] = useState("en");
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem(LANG_KEY);
    if (saved === "hi" || saved === "en") setLangState(saved);
    setReady(true);
  }, []);

  useEffect(() => {
    if (!ready) return;
    document.documentElement.lang = lang === "hi" ? "hi-IN" : "en-IN";
  }, [lang, ready]);

  const setLang = useCallback((l) => {
    if (l !== "en" && l !== "hi") return;
    setLangState(l);
    localStorage.setItem(LANG_KEY, l);
    document.documentElement.lang = l === "hi" ? "hi-IN" : "en-IN";
    window.dispatchEvent(new CustomEvent("language-changed", { detail: l }));
  }, []);

  const t = useCallback((key, vars) => translate(lang, key, vars), [lang]);

  return (
    <LanguageContext.Provider value={{ lang, setLang, t, ready }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const ctx = useContext(LanguageContext);
  if (!ctx) throw new Error("useLanguage must be used within LanguageProvider");
  return ctx;
}
