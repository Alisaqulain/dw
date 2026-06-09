"use client";

import WhatsAppIcon from "@/components/ui/WhatsAppIcon";
import { getWhatsAppDisplay, getWhatsAppUrl } from "@/lib/whatsapp";

export default function WhatsAppButton() {
  return (
    <a
      href={getWhatsAppUrl()}
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-[calc(4.75rem+env(safe-area-inset-bottom,0px))] left-4 z-40 flex items-center gap-2 rounded-full bg-emerald-500 px-3 py-2.5 text-white shadow-lg shadow-emerald-200 transition hover:scale-105 hover:bg-emerald-600 lg:bottom-6 lg:left-6 lg:z-50 lg:px-4 lg:py-3"
      aria-label={`WhatsApp ${getWhatsAppDisplay()}`}
    >
      <WhatsAppIcon className="h-6 w-6 shrink-0 lg:h-7 lg:w-7" />
      <span className="text-xs font-semibold leading-none sm:text-sm">{getWhatsAppDisplay()}</span>
    </a>
  );
}
