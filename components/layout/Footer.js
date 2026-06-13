"use client";

import Link from "next/link";
import Logo from "@/components/layout/Logo";
import { STORE_CONTACT } from "@/lib/constants";
import WhatsAppIcon from "@/components/ui/WhatsAppIcon";
import { getWhatsAppNumber, getWhatsAppUrl } from "@/lib/whatsapp";
import { useLanguage } from "@/context/LanguageContext";

export default function Footer() {
  const { t } = useLanguage();
  const year = new Date().getFullYear();

  const shopLinks = [
    { href: "/shop", label: t("footerAllProducts") },
    { href: "/shop?sort=bestseller", label: t("footerBestsellers") },
    { href: "/shop?sort=newest", label: t("footerNewArrivals") },
    { href: "/collections", label: t("collections") },
  ];

  const supportLinks = [
    { href: "/contact", label: t("footerContactUs") },
    { href: "/track-order", label: t("footerTrackOrder") },
    { href: "/faq", label: t("footerFaq") },
    { href: "/about", label: t("about") },
  ];

  const legalLinks = [
    { href: "/privacy-policy", label: t("footerPrivacy") },
    { href: "/terms", label: t("footerTerms") },
    { href: "/shipping-policy", label: t("footerShipping") },
    { href: "/return-refund-policy", label: t("footerReturns") },
  ];

  const badges = [
    { icon: "🛡️", label: t("badge_bodySafe") },
    { icon: "📦", label: t("badge_discreet") },
    { icon: "🚀", label: t("badge_fastShip") },
    { icon: "🔒", label: t("badge_secure") },
    { icon: "21+" },
  ];

  return (
    <footer className="mt-auto bg-[#0c1929] text-slate-300">
      <div className="border-b border-white/10 bg-gradient-to-r from-sky-900/30 to-blue-900/30">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 px-4 py-8 sm:flex-row sm:px-6 lg:px-8">
          <div>
            <p className="text-lg font-bold text-white">{t("footerCtaTitle")}</p>
            <p className="text-sm text-slate-400">{t("footerCtaDesc")}</p>
          </div>
          <Link href="/shop" className="rounded-full bg-sky-500 px-8 py-3 text-sm font-semibold text-white hover:bg-sky-400">
            {t("footerBrowse")}
          </Link>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-5">
          <div className="lg:col-span-2">
            <Logo size="lg" href="/" />
            <p className="mt-4 max-w-sm text-sm leading-relaxed text-slate-400">{t("footerAbout")}</p>
            <div className="mt-5 flex flex-wrap gap-2">
              {badges.map((b) => (
                <span key={b.label || b.icon} className="rounded-full bg-white/5 px-3 py-1 text-[10px] font-medium ring-1 ring-white/10">
                  {b.icon} {b.label}
                </span>
              ))}
            </div>
            <div className="mt-6 space-y-2.5">
              <a href={`mailto:${STORE_CONTACT.email}`} className="flex items-center gap-2 text-sm text-slate-400 transition hover:text-sky-400">
                {STORE_CONTACT.email}
              </a>
              {STORE_CONTACT.phones.map((phone) => (
                <a key={phone.tel} href={`tel:${phone.tel}`} className="flex items-center gap-2 text-sm text-slate-400 transition hover:text-sky-400">
                  {phone.display}
                </a>
              ))}
              {getWhatsAppNumber() && (
                <a
                  href={getWhatsAppUrl("Hi TrustSilcon!")}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 text-sm text-emerald-400 transition hover:text-emerald-300"
                >
                  <WhatsAppIcon className="h-4 w-4 shrink-0" />
                  WhatsApp
                </a>
              )}
            </div>
          </div>

          <div>
            <h3 className="text-sm font-bold uppercase tracking-wider text-white">{t("footerShop")}</h3>
            <ul className="mt-4 space-y-2.5">
              {shopLinks.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="text-sm text-slate-400 transition hover:text-sky-400">{link.label}</Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-bold uppercase tracking-wider text-white">{t("footerSupport")}</h3>
            <ul className="mt-4 space-y-2.5">
              {supportLinks.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="text-sm text-slate-400 transition hover:text-sky-400">{link.label}</Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-bold uppercase tracking-wider text-white">{t("footerLegal")}</h3>
            <ul className="mt-4 space-y-2.5">
              {legalLinks.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="text-sm text-slate-400 transition hover:text-sky-400">{link.label}</Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-12 border-t border-white/10 pt-8 text-center text-xs text-slate-500">
          {t("footerCopyright", { year: String(year) })}
        </div>
      </div>
    </footer>
  );
}
