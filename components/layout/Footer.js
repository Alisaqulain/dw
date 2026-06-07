import Link from "next/link";
import Logo from "@/components/layout/Logo";
import { COLLECTIONS, STORE_CONTACT } from "@/lib/constants";

const legalLinks = [
  { href: "/legal", label: "Legal Hub" },
  { href: "/privacy-policy", label: "Privacy Policy" },
  { href: "/cookie-policy", label: "Cookie Policy" },
  { href: "/terms", label: "Terms & Conditions" },
  { href: "/shipping-policy", label: "Shipping Policy" },
  { href: "/return-refund-policy", label: "Return & Refund Policy" },
  { href: "/age-policy", label: "Age Verification Policy" },
];

export default function Footer() {
  return (
    <footer className="mt-auto bg-[#0c1929] text-slate-300">
      {/* Pre-footer CTA strip */}
      <div className="border-b border-white/10 bg-gradient-to-r from-sky-900/30 to-blue-900/30">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 px-4 py-8 sm:flex-row sm:px-6 lg:px-8">
          <div>
            <p className="text-lg font-bold text-white">Ready to shop premium wellness?</p>
            <p className="text-sm text-slate-400">Discreet delivery · Body-safe silicone · COD available</p>
          </div>
          <Link href="/shop" className="rounded-full bg-sky-500 px-8 py-3 text-sm font-semibold text-white hover:bg-sky-400">
            Browse Collection →
          </Link>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-5">
          <div className="lg:col-span-2">
            <Logo size="lg" href="/" />
            <p className="mt-4 max-w-sm text-sm leading-relaxed text-slate-400">
              TrustSilcon is India&apos;s premium intimate wellness brand. Body-safe silicone products, discreet packaging, and fast delivery nationwide.
            </p>
            <div className="mt-5 flex flex-wrap gap-2">
              {["🛡️ Body-Safe", "📦 Discreet", "🚀 Fast Ship", "🔒 Secure", "21+"].map((t) => (
                <span key={t} className="rounded-full bg-white/5 px-3 py-1 text-[10px] font-medium ring-1 ring-white/10">{t}</span>
              ))}
            </div>
            <div className="mt-6 space-y-2.5">
              <a href={`mailto:${STORE_CONTACT.email}`} className="flex items-center gap-2 text-sm text-slate-400 transition hover:text-sky-400">
                <svg className="h-4 w-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
                {STORE_CONTACT.email}
              </a>
              {STORE_CONTACT.phones.map((phone) => (
                <a key={phone.tel} href={`tel:${phone.tel}`} className="flex items-center gap-2 text-sm text-slate-400 transition hover:text-sky-400">
                  <svg className="h-4 w-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" /></svg>
                  {phone.display}
                </a>
              ))}
            </div>
          </div>
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-white">Shop</h4>
            <ul className="mt-4 space-y-2.5">
              {COLLECTIONS.slice(0, 6).map((link) => (
                <li key={link.href}><Link href={link.href} className="text-sm text-slate-400 transition hover:text-sky-400">{link.label}</Link></li>
              ))}
            </ul>
          </div>
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-white">Support</h4>
            <ul className="mt-4 space-y-2.5">
              {[
                { href: "/track-order", label: "Track Order" },
                { href: "/contact", label: "Contact Us" },
                { href: "/faq", label: "FAQ" },
                { href: "/reviews", label: "Reviews" },
                { href: "/about", label: "About Us" },
                { href: "/shop", label: "All Products" },
              ].map((link) => (
                <li key={link.href}><Link href={link.href} className="text-sm text-slate-400 transition hover:text-sky-400">{link.label}</Link></li>
              ))}
            </ul>
          </div>
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-white">Legal</h4>
            <ul className="mt-4 space-y-2.5">
              {legalLinks.map((link) => (
                <li key={link.href}><Link href={link.href} className="text-sm text-slate-400 transition hover:text-sky-400">{link.label}</Link></li>
              ))}
            </ul>
          </div>
        </div>
        <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-white/10 pt-8 sm:flex-row">
          <p className="text-xs text-slate-500">&copy; {new Date().getFullYear()} TrustSilcon. All rights reserved. Adults 21+ only.</p>
          <p className="text-[10px] text-slate-600">Intimate wellness · Discreet delivery · Body-safe silicone · Premium care</p>
        </div>
      </div>
    </footer>
  );
}
