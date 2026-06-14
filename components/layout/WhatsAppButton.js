"use client";

import WhatsAppIcon from "@/components/ui/WhatsAppIcon";
import { useWhatsAppContext } from "@/context/WhatsAppContext";
import { getWhatsAppNumber, getWhatsAppUrl, getProductWhatsAppMessage } from "@/lib/whatsapp";
import { trackWhatsAppClick } from "@/lib/analytics";

export default function WhatsAppButton() {
  const { productName } = useWhatsAppContext();
  const number = getWhatsAppNumber();
  const message = productName
    ? getProductWhatsAppMessage(productName)
    : "Hi TrustSilcon, I want to order/enquire about your wellness products.";

  return (
    <a
      href={getWhatsAppUrl(message, number)}
      target="_blank"
      rel="noopener noreferrer"
      onClick={() => trackWhatsAppClick(productName ? "product_floating" : "floating")}
      className="fixed bottom-[calc(4.75rem+env(safe-area-inset-bottom,0px))] right-3 z-30 flex items-center gap-2 rounded-full bg-emerald-500 px-3 py-2.5 text-white shadow-lg shadow-emerald-200/80 transition hover:bg-emerald-600 lg:bottom-5 lg:right-5 lg:z-40 lg:px-4 lg:py-3"
      aria-label="Need help? Chat on WhatsApp"
      title="Need Help Choosing? Chat on WhatsApp"
    >
      <WhatsAppIcon className="h-5 w-5 shrink-0" />
      <span className="hidden text-xs font-semibold sm:inline">WhatsApp</span>
    </a>
  );
}
