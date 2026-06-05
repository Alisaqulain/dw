"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { getAgeVerified, getCookieConsent, saveCookieConsent } from "@/lib/consent";

export default function CookieConsent() {
  const [visible, setVisible] = useState(false);
  const [showPrefs, setShowPrefs] = useState(false);
  const [prefs, setPrefs] = useState({ analytics: false, marketing: false });

  useEffect(() => {
    const check = () => {
      if (!getAgeVerified()) return;
      if (!getCookieConsent()) setVisible(true);
    };
    check();
    window.addEventListener("age-verified", check);
    return () => window.removeEventListener("age-verified", check);
  }, []);

  const accept = (analytics, marketing) => {
    saveCookieConsent({ analytics, marketing });
    setVisible(false);
    setShowPrefs(false);
  };

  if (!visible) return null;

  return (
    <>
      {showPrefs && <div className="fixed inset-0 z-[150] bg-black/30 backdrop-blur-sm" />}
      <div className="fixed inset-x-0 bottom-0 z-[160] p-4 sm:p-6">
        <div className="mx-auto max-w-4xl animate-slide-up overflow-hidden rounded-2xl bg-white shadow-2xl ring-1 ring-slate-200">
          {!showPrefs ? (
            <div className="p-6 sm:flex sm:items-center sm:gap-6 sm:p-8">
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <span className="text-xl">🍪</span>
                  <h3 className="font-bold text-slate-900">Cookie Preferences</h3>
                </div>
                <p className="mt-2 text-sm leading-relaxed text-slate-600">
                  We use cookies to improve your shopping experience, analytics, and marketing.
                  Essential cookies are required for the site to function.
                </p>
                <p className="mt-2 text-xs text-slate-400">
                  Read our{" "}
                  <Link href="/cookie-policy" className="text-sky-600 underline hover:text-sky-700">Cookie Policy</Link>
                  {" "}and{" "}
                  <Link href="/privacy-policy" className="text-sky-600 underline hover:text-sky-700">Privacy Policy</Link>.
                </p>
              </div>
              <div className="mt-4 flex flex-col gap-2 sm:mt-0 sm:shrink-0">
                <button onClick={() => accept(true, true)} className="rounded-full bg-[#0c1929] px-6 py-2.5 text-sm font-semibold text-white hover:bg-[#1e3a5f]">
                  Accept All
                </button>
                <button onClick={() => accept(false, false)} className="rounded-full border border-slate-200 px-6 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50">
                  Reject Non-Essential
                </button>
                <button onClick={() => setShowPrefs(true)} className="rounded-full px-6 py-2 text-sm font-medium text-sky-600 hover:text-sky-700">
                  Manage Preferences
                </button>
              </div>
            </div>
          ) : (
            <div className="p-6 sm:p-8">
              <h3 className="font-bold text-slate-900">Manage Cookie Preferences</h3>
              <div className="mt-5 space-y-4">
                <div className="flex items-center justify-between rounded-xl bg-slate-50 p-4">
                  <div>
                    <p className="text-sm font-semibold text-slate-800">Essential</p>
                    <p className="text-xs text-slate-500">Required for cart, checkout, and security.</p>
                  </div>
                  <span className="rounded-full bg-emerald-100 px-3 py-1 text-xs font-medium text-emerald-700">Always On</span>
                </div>
                <label className="flex cursor-pointer items-center justify-between rounded-xl border border-slate-100 p-4 hover:bg-sky-50/50">
                  <div>
                    <p className="text-sm font-semibold text-slate-800">Analytics</p>
                    <p className="text-xs text-slate-500">Help us improve site performance and UX.</p>
                  </div>
                  <input type="checkbox" checked={prefs.analytics} onChange={(e) => setPrefs({ ...prefs, analytics: e.target.checked })} className="h-5 w-5 rounded text-sky-500" />
                </label>
                <label className="flex cursor-pointer items-center justify-between rounded-xl border border-slate-100 p-4 hover:bg-sky-50/50">
                  <div>
                    <p className="text-sm font-semibold text-slate-800">Marketing</p>
                    <p className="text-xs text-slate-500">Personalised offers and wellness updates.</p>
                  </div>
                  <input type="checkbox" checked={prefs.marketing} onChange={(e) => setPrefs({ ...prefs, marketing: e.target.checked })} className="h-5 w-5 rounded text-sky-500" />
                </label>
              </div>
              <div className="mt-6 flex gap-3">
                <button onClick={() => accept(prefs.analytics, prefs.marketing)} className="flex-1 rounded-full bg-sky-500 py-2.5 text-sm font-semibold text-white hover:bg-sky-600">
                  Save Preferences
                </button>
                <button onClick={() => setShowPrefs(false)} className="rounded-full border border-slate-200 px-6 py-2.5 text-sm text-slate-600 hover:bg-slate-50">
                  Back
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
