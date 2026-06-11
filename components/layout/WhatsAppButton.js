"use client";

import WhatsAppIcon from "@/components/ui/WhatsAppIcon";
import { getWhatsAppContacts, getWhatsAppUrl } from "@/lib/whatsapp";

export default function WhatsAppButton() {
  const contacts = getWhatsAppContacts();

  return (
    <div className="fixed bottom-[calc(4.75rem+env(safe-area-inset-bottom,0px))] right-3 z-30 flex flex-col gap-1 lg:bottom-5 lg:right-5 lg:z-40">
      {contacts.map((contact) => (
        <a
          key={contact.number}
          href={getWhatsAppUrl("Hi TrustSilcon, I need help with my order.", contact.number)}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-1.5 rounded-full bg-emerald-500 px-2.5 py-1.5 text-white shadow-md shadow-emerald-200/80 transition hover:bg-emerald-600 lg:px-3 lg:py-2"
          aria-label={`WhatsApp ${contact.display}`}
        >
          <WhatsAppIcon className="h-4 w-4 shrink-0 lg:h-[18px] lg:w-[18px]" />
          <span className="text-[10px] font-semibold leading-none sm:text-[11px]">{contact.short}</span>
        </a>
      ))}
    </div>
  );
}
