"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Logo from "@/components/layout/Logo";
import OfferBar from "@/components/layout/OfferBar";
import MegaMenu from "@/components/layout/MegaMenu";
import { useCart } from "@/context/CartContext";
import { COLLECTIONS } from "@/lib/constants";

export default function Header() {
  const { cartCount, openCart } = useCart();
  const router = useRouter();
  const [menuOpen, setMenuOpen] = useState(false);
  const [megaOpen, setMegaOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [scrolled, setScrolled] = useState(false);
  const headerRef = useRef(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/shop?search=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery("");
      setMenuOpen(false);
      setMegaOpen(false);
    }
  };

  return (
    <header ref={headerRef} className={`sticky top-0 z-50 transition-shadow duration-300 ${scrolled ? "shadow-lg shadow-slate-200/50" : ""}`}>
      <OfferBar />

      <div className="relative border-b border-slate-100 bg-white/95 backdrop-blur-md">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          {/* Main row */}
          <div className="flex h-[72px] items-center gap-4 lg:h-[84px]">
            <button onClick={() => setMenuOpen(!menuOpen)} className="flex h-10 w-10 items-center justify-center rounded-xl text-slate-700 lg:hidden" aria-label="Menu">
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                {menuOpen ? <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /> : <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />}
              </svg>
            </button>

            <Logo size="lg" />

            {/* Search - desktop */}
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

            <div className="ml-auto flex items-center gap-1 sm:gap-2">
              <Link href="/track-order" className="hidden items-center gap-1.5 rounded-full px-3 py-2 text-sm font-medium text-slate-600 transition hover:bg-sky-50 hover:text-sky-600 md:flex">
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                Track
              </Link>
              <button onClick={openCart} className="relative flex h-10 w-10 items-center justify-center rounded-full transition hover:bg-sky-50">
                <svg className="h-5 w-5 text-slate-700" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" /></svg>
                {cartCount > 0 && (
                  <span className="absolute -right-0.5 -top-0.5 flex h-5 min-w-[20px] items-center justify-center rounded-full bg-sky-500 px-1 text-[10px] font-bold text-white">
                    {cartCount}
                  </span>
                )}
              </button>
            </div>
          </div>

          {/* Search - mobile */}
          <form onSubmit={handleSearch} className="pb-3 lg:hidden">
            <div className="relative">
              <input
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search products..."
                className="w-full rounded-full border border-slate-200 bg-slate-50 py-2.5 pl-4 pr-10 text-sm outline-none focus:border-sky-400"
              />
              <button type="submit" className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400">
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
              </button>
            </div>
          </form>

          {/* Category nav - desktop */}
          <nav className="hidden items-center gap-1 border-t border-slate-50 py-2 lg:flex">
            <button
              onMouseEnter={() => setMegaOpen(true)}
              onClick={() => setMegaOpen(!megaOpen)}
              className={`flex items-center gap-1 rounded-lg px-4 py-2 text-sm font-semibold transition ${megaOpen ? "bg-sky-50 text-sky-600" : "text-slate-700 hover:bg-slate-50"}`}
            >
              Shop All
              <svg className={`h-4 w-4 transition ${megaOpen ? "rotate-180" : ""}`} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
            </button>
            {COLLECTIONS.slice(0, 6).map((col) => (
              <Link key={col.slug} href={col.href} className="rounded-lg px-3 py-2 text-sm font-medium text-slate-600 transition hover:bg-sky-50 hover:text-sky-600">
                {col.label}
              </Link>
            ))}
          </nav>
        </div>

        <div onMouseLeave={() => setMegaOpen(false)}>
          <MegaMenu open={megaOpen} onClose={() => setMegaOpen(false)} />
        </div>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="border-b border-slate-100 bg-white lg:hidden animate-slide-down">
          <div className="px-4 py-4">
            <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-slate-400">Collections</p>
            <div className="grid grid-cols-2 gap-2">
              {COLLECTIONS.map((col) => (
                <Link key={col.slug} href={col.href} onClick={() => setMenuOpen(false)} className="flex items-center gap-2 rounded-xl bg-slate-50 px-3 py-2.5 text-sm font-medium text-slate-700">
                  <span>{col.icon}</span>{col.label}
                </Link>
              ))}
            </div>
            <div className="mt-4 flex gap-2">
              <Link href="/shop" onClick={() => setMenuOpen(false)} className="flex-1 rounded-full bg-[#0c1929] py-2.5 text-center text-sm font-semibold text-white">Shop All</Link>
              <Link href="/track-order" onClick={() => setMenuOpen(false)} className="flex-1 rounded-full border border-slate-200 py-2.5 text-center text-sm font-medium text-slate-700">Track Order</Link>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
