"use client";

import WhatsAppIcon from "@/components/ui/WhatsAppIcon";
import { getWhatsAppUrl } from "@/lib/whatsapp";
import { trackWhatsAppClick } from "@/lib/analytics";

export default function WhatsAppHelpCTA({ message, context = "general", className = "" }) {
  const msg = message || "Hi TrustSilcon, I need help choosing a product.";
  const href = getWhatsAppUrl(msg);

  return (
    <div className={`rounded-2xl bg-gradient-to-r from-emerald-50 to-green-50 p-5 ring-1 ring-emerald-100 sm:p-6 ${className}`}>
      <div className="flex flex-col items-center gap-4 text-center sm:flex-row sm:text-left">
        <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-emerald-500 text-white shadow-lg shadow-emerald-200">
          <WhatsAppIcon className="h-7 w-7" />
        </div>
        <div className="flex-1">
          <p className="text-lg font-bold text-slate-900">Need Help Choosing?</p>
          <p className="mt-1 text-sm text-slate-600">Chat with our team on WhatsApp — we reply fast and help you order with COD.</p>
        </div>
        <a
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          onClick={() => trackWhatsAppClick(context)}
          className="inline-flex min-h-[48px] shrink-0 items-center justify-center gap-2 rounded-full bg-emerald-500 px-6 py-3 text-sm font-bold text-white shadow-md hover:bg-emerald-600 active:scale-[0.98]"
        >
          <WhatsAppIcon className="h-5 w-5" />
          Chat on WhatsApp
        </a>
      </div>
    </div>
  );
}
