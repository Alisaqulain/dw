import { STORE_CONTACT } from "@/lib/constants";

export function getWhatsAppContacts() {
  return STORE_CONTACT.phones.map((phone) => ({
    display: phone.display,
    short: phone.display.replace("+91 ", ""),
    number: phone.whatsapp || phone.tel.replace("+", ""),
    tel: phone.tel,
  }));
}

export function getWhatsAppNumber() {
  return (
    process.env.NEXT_PUBLIC_WHATSAPP_NUMBER ||
    STORE_CONTACT.phones[0]?.whatsapp ||
    STORE_CONTACT.whatsapp
  );
}

export function getWhatsAppDisplay() {
  return getWhatsAppContacts()
    .map((p) => p.short)
    .join(" · ");
}

export function getWhatsAppUrl(message = "Hi TrustSilcon, I need help with my order.", number) {
  const phone = number || getWhatsAppNumber();
  return `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;
}

export function getProductWhatsAppMessage(productName, action = "order") {
  return `Hi TrustSilcon, I want to ${action}/enquire about ${productName}.`;
}

export function getWhatsAppOrderMessage(productName) {
  return getProductWhatsAppMessage(productName, "order");
}
