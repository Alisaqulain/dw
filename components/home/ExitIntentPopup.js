"use client";

import { useEffect, useState } from "react";
import { useLanguage } from "@/context/LanguageContext";
import { getWhatsAppUrl } from "@/lib/whatsapp";
import WhatsAppIcon from "@/components/ui/WhatsAppIcon";

const DISMISS_KEY = "trustsilcon_exit_intent_dismissed";

export default function ExitIntentPopup() {
  const [show, setShow] = useState(false);
  const { t } = useLanguage();

  useEffect(() => {
    if (localStorage.getItem(DISMISS_KEY)) return;

    let triggered = false;
    const trigger = () => {
      if (triggered) return;
      triggered = true;
      setShow(true);
    };

    const timer = setTimeout(trigger, 20000);

    const onScroll = () => {
      const scrollPercent =
        (window.scrollY / (document.documentElement.scrollHeight - window.innerHeight)) * 100;
      if (scrollPercent >= 60) trigger();
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      clearTimeout(timer);
      window.removeEventListener("scroll", onScroll);
    };
  }, []);

  const handleClose = () => {
    setShow(false);
    localStorage.setItem(DISMISS_KEY, "1");
  };

  if (!show) return null;

  const discountEnabled = process.env.NEXT_PUBLIC_EXIT_DISCOUNT_ENABLED === "true";

  return (
    <>
      <div className="fixed inset-0 z-[100] bg-black/50 backdrop-blur-sm animate-fade-in" onClick={handleClose} />
      <div className="fixed inset-x-4 bottom-[calc(5rem+env(safe-area-inset-bottom,0px))] z-[101] mx-auto max-w-md overflow-hidden rounded-3xl bg-white shadow-2xl animate-slide-up sm:bottom-auto sm:top-1/2 sm:-translate-y-1/2">
        <div className="bg-gradient-to-br from-emerald-600 to-emerald-500 px-6 py-7 text-center text-white">
          <WhatsAppIcon className="mx-auto h-10 w-10" />
          <h3 className="mt-3 text-lg font-bold">{t("exitTitle")}</h3>
          <p className="mt-2 text-sm text-emerald-50">{t("exitSubtitle")}</p>
          {discountEnabled && (
            <p className="mt-2 rounded-full bg-white/20 px-3 py-1 text-xs font-semibold">
              Use code WELCOME10 for 10% off your first COD order
            </p>
          )}
        </div>
        <div className="space-y-2 p-5">
          <a
            href={getWhatsAppUrl("Hi TrustSilcon, I need help placing a COD order.")}
            target="_blank"
            rel="noopener noreferrer"
            onClick={handleClose}
            className="flex w-full items-center justify-center gap-2 rounded-full bg-emerald-500 py-3.5 text-sm font-bold text-white hover:bg-emerald-600"
          >
            <WhatsAppIcon className="h-5 w-5" />
            {t("chatWhatsApp")}
          </a>
          <button
            type="button"
            onClick={handleClose}
            className="w-full rounded-full border border-slate-200 py-3 text-sm font-semibold text-slate-600 hover:bg-slate-50"
          >
            {t("continueShopping")}
          </button>
        </div>
      </div>
    </>
  );
}
