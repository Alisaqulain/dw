import { STORE_CONTACT } from "@/lib/constants";

export function getWhatsAppNumber() {
  return process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || STORE_CONTACT.whatsapp;
}

export function getWhatsAppDisplay() {
  return STORE_CONTACT.phones[0]?.display?.replace("+91 ", "") || "81712 14737";
}

export function getWhatsAppUrl(message = "Hi TrustSilcon, I need help with my order.") {
  return `https://wa.me/${getWhatsAppNumber()}?text=${encodeURIComponent(message)}`;
}
