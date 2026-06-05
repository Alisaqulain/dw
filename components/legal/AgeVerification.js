"use client";

import { useEffect, useState } from "react";
import Logo from "@/components/layout/Logo";
import { getAgeVerified, setAgeVerified } from "@/lib/consent";

export default function AgeVerification() {
  const [show, setShow] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    if (!getAgeVerified()) setShow(true);
  }, []);

  const handleConfirm = () => {
    setAgeVerified();
    setShow(false);
    window.dispatchEvent(new Event("age-verified"));
  };

  const handleUnderAge = () => {
    window.location.href = "https://www.google.com";
  };

  if (!mounted || !show) return null;

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
      {/* Blurred backdrop */}
      <div className="absolute inset-0 bg-[#0c1929]/80 backdrop-blur-xl" />

      <div className="relative w-full max-w-lg animate-slide-up overflow-hidden rounded-3xl bg-white shadow-2xl ring-1 ring-sky-100">
        {/* Top gradient bar */}
        <div className="h-1.5 bg-gradient-to-r from-sky-400 via-sky-500 to-blue-600" />

        <div className="px-8 py-10 text-center sm:px-10 sm:py-12">
          <Logo size="lg" href={false} className="mx-auto" />

          <div className="mx-auto mt-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-sky-50 to-blue-50 ring-1 ring-sky-100">
            <span className="text-2xl font-bold text-sky-600">18+</span>
          </div>

          <h2 className="mt-6 text-2xl font-bold text-slate-900">Age Verification Required</h2>
          <p className="mt-4 text-sm leading-relaxed text-slate-600">
            This website contains adult wellness products intended for individuals aged 18 and above.
            You must be 18+ to continue browsing TrustSilcon.
          </p>

          <p className="mt-3 text-xs text-slate-400">
            By entering, you confirm you are of legal age in your jurisdiction.
          </p>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center">
            <button
              onClick={handleConfirm}
              className="rounded-full bg-gradient-to-r from-sky-500 to-blue-600 px-10 py-3.5 text-sm font-semibold text-white shadow-lg shadow-sky-200 transition hover:from-sky-600 hover:to-blue-700"
            >
              I am 18+
            </button>
            <button
              onClick={handleUnderAge}
              className="rounded-full border-2 border-slate-200 px-10 py-3.5 text-sm font-semibold text-slate-600 transition hover:border-slate-300 hover:bg-slate-50"
            >
              I am under 18
            </button>
          </div>
        </div>

        <div className="border-t border-sky-50 bg-sky-50/50 px-8 py-4 text-center">
          <p className="text-[10px] text-slate-400">
            TrustSilcon · Premium intimate wellness · Discreet delivery · Body-safe silicone
          </p>
        </div>
      </div>
    </div>
  );
}
