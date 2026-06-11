"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Logo from "@/components/layout/Logo";
import OfferBar from "@/components/layout/OfferBar";
import MegaMenu from "@/components/layout/MegaMenu";
import { useCart } from "@/context/CartContext";
import { COLLECTIONS } from "@/lib/constants";
import WhatsAppIcon from "@/components/ui/WhatsAppIcon";
import { getWhatsAppContacts, getWhatsAppUrl } from "@/lib/whatsapp";

export default function Header() {
  const { cartCount, openCart } = useCart();
  const router = useRouter();
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [megaOpen, setMegaOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [menuOpen]);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/shop?search=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery("");
      setMenuOpen(false);
      setSearchOpen(false);
      setMegaOpen(false);
    }
  };

  return (
    <header className={`sticky top-0 z-50 transition-shadow duration-300 ${scrolled ? "shadow-lg shadow-slate-200/50" : ""}`}>
      <OfferBar />

      <div className="relative border-b border-slate-100 bg-white/95 backdrop-blur-md">
        <div className="mx-auto max-w-7xl px-3 sm:px-6 lg:px-8">
          <div className="flex h-14 items-center gap-2 sm:h-16 lg:h-[84px] lg:gap-4">
            <button
              type="button"
              onClick={() => setMenuOpen(!menuOpen)}
              className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl text-slate-700 active:bg-slate-100 lg:hidden"
              aria-label="Menu"
            >
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                {menuOpen
                  ? <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  : <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />}
              </svg>
            </button>

            <div className="flex flex-1 justify-center lg:flex-none lg:justify-start">
              <Logo size="md" className="lg:hidden" />
              <Logo size="lg" className="hidden lg:block" />
            </div>

            <form onSubmit={handleSearch} className="hidden flex-1 lg:flex lg:max-w-xl lg:mx-4">
              <div className="relative w-full">
                <input
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search wellness products..."
                  className="w-full rounded-full border border-slate-200 bg-slate-50 py-2.5 pl-5 pr-12 text-sm outline-none transition focus:border-sky-400 focus:bg-white focus:ring-2 focus:ring-sky-100"
                />
                <button type="submit" className="absolute right-1 top-1/2 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-full bg-[#0c1929] text-white hover:bg-[#1e3a5f]">
                  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
                </button>
              </div>
            </form>

            <div className="flex shrink-0 items-center gap-0.5 sm:gap-2">
              <button
                type="button"
                onClick={() => setSearchOpen(!searchOpen)}
                className="flex h-11 w-11 items-center justify-center rounded-xl text-slate-600 active:bg-slate-100 lg:hidden"
                aria-label="Search"
              >
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
              </button>
              {getWhatsAppContacts().map((contact) => (
                <a
                  key={contact.number}
                  href={getWhatsAppUrl("Hi TrustSilcon!", contact.number)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hidden items-center gap-1.5 rounded-full px-3 py-2 text-sm font-medium text-emerald-600 transition hover:bg-emerald-50 md:flex"
                >
                  <WhatsAppIcon className="h-4 w-4" />
                  <span className="hidden lg:inline">{contact.short}</span>
                </a>
              ))}
              <Link href="/track-order" className="hidden items-center gap-1.5 rounded-full px-3 py-2 text-sm font-medium text-slate-600 transition hover:bg-sky-50 hover:text-sky-600 md:flex">
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                Track
              </Link>
              <button
                type="button"
                onClick={openCart}
                className="relative flex h-11 w-11 items-center justify-center rounded-xl active:bg-sky-50"
              >
                <svg className="h-5 w-5 text-slate-700" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" /></svg>
                {cartCount > 0 && (
                  <span className="absolute right-1 top-1 flex h-4 min-w-[16px] items-center justify-center rounded-full bg-sky-500 px-1 text-[9px] font-bold text-white">
                    {cartCount > 9 ? "9+" : cartCount}
                  </span>
                )}
              </button>
            </div>
          </div>

          {searchOpen && (
            <form onSubmit={handleSearch} className="animate-slide-down pb-3 lg:hidden">
              <div className="relative">
                <input
                  autoFocus
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search products..."
                  className="w-full rounded-full border border-slate-200 bg-slate-50 py-3 pl-4 pr-11 text-base outline-none focus:border-sky-400 focus:ring-2 focus:ring-sky-100"
                />
                <button type="submit" className="absolute right-1 top-1/2 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full bg-[#0c1929] text-white">
                  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
                </button>
              </div>
            </form>
          )}

          <nav className="hidden items-center gap-1 border-t border-slate-50 py-2 lg:flex">
            <button
              onMouseEnter={() => setMegaOpen(true)}
              onClick={() => setMegaOpen(!megaOpen)}
              className={`flex items-center gap-1 rounded-lg px-4 py-2 text-sm font-semibold transition ${megaOpen ? "bg-sky-50 text-sky-600" : "text-slate-700 hover:bg-slate-50"}`}
            >
              Shop All
              <svg className={`h-4 w-4 transition ${megaOpen ? "rotate-180" : ""}`} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
            </button>
            <Link href="/collections" className="rounded-lg px-3 py-2 text-sm font-medium text-slate-600 transition hover:bg-sky-50 hover:text-sky-600">
              Collections
            </Link>
            {COLLECTIONS.slice(0, 5).map((col) => (
              <Link key={col.slug} href={col.href} className="rounded-lg px-3 py-2 text-sm font-medium text-slate-600 transition hover:bg-sky-50 hover:text-sky-600">
                {col.label}
              </Link>
            ))}
            <Link href="/blog" className="rounded-lg px-3 py-2 text-sm font-medium text-slate-600 transition hover:bg-sky-50 hover:text-sky-600">
              Guides
            </Link>
          </nav>
        </div>

        <div onMouseLeave={() => setMegaOpen(false)}>
          <MegaMenu open={megaOpen} onClose={() => setMegaOpen(false)} />
        </div>
      </div>

      {menuOpen && (
        <>
          <div className="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm lg:hidden" onClick={() => setMenuOpen(false)} />
          <div className="fixed inset-y-0 left-0 z-50 flex w-[min(100%,320px)] flex-col bg-white shadow-2xl lg:hidden animate-slide-in-left">
            <div className="flex items-center justify-between border-b border-slate-100 px-4 py-4">
              <Logo size="sm" />
              <button type="button" onClick={() => setMenuOpen(false)} className="flex h-10 w-10 items-center justify-center rounded-full hover:bg-slate-100" aria-label="Close menu">
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
              </button>
            </div>
            <div className="flex-1 overflow-y-auto px-4 py-4">
              <Link href="/shop" onClick={() => setMenuOpen(false)} className="mb-4 flex items-center justify-center rounded-2xl bg-[#0c1929] py-3.5 text-sm font-bold text-white">
                Shop All Products
              </Link>
              <p className="mb-3 text-xs font-bold uppercase tracking-wider text-slate-400">Collections</p>
              <div className="space-y-2">
                {COLLECTIONS.map((col) => (
                  <Link
                    key={col.slug}
                    href={col.href}
                    onClick={() => setMenuOpen(false)}
                    className="flex items-center gap-3 rounded-xl bg-slate-50 px-4 py-3.5 text-sm font-medium text-slate-700 active:bg-sky-50"
                  >
                    <span className="text-xl">{col.icon}</span>
                    <div>
                      <p>{col.label}</p>
                      <p className="text-[11px] text-slate-400">{col.desc}</p>
                    </div>
                  </Link>
                ))}
              </div>
              <div className="mt-6 space-y-2">
                {getWhatsAppContacts().map((contact) => (
                  <a
                    key={contact.number}
                    href={getWhatsAppUrl("Hi TrustSilcon!", contact.number)}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={() => setMenuOpen(false)}
                    className="flex items-center justify-center gap-2 rounded-2xl bg-emerald-500 py-3.5 text-sm font-bold text-white"
                  >
                    <WhatsAppIcon className="h-5 w-5" />
                    WhatsApp {contact.short}
                  </a>
                ))}
              </div>
              <div className="mt-4 grid grid-cols-2 gap-2 border-t border-slate-100 pt-6">
                {[
                  { href: "/collections", label: "Collections" },
                  { href: "/blog", label: "Guides" },
                  { href: "/track-order", label: "Track Order" },
                  { href: "/contact", label: "Contact" },
                  { href: "/faq", label: "FAQ" },
                  { href: "/about", label: "About" },
                ].map((link) => (
                  <Link key={link.href} href={link.href} onClick={() => setMenuOpen(false)} className="rounded-xl border border-slate-200 py-2.5 text-center text-xs font-semibold text-slate-600">
                    {link.label}
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </>
      )}
    </header>
  );
}
