"use client";

import { useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import Logo from "@/components/layout/Logo";

const navItems = [
  { href: "/admin/dashboard", label: "Dashboard", icon: "📊" },
  { href: "/admin/products", label: "Products", icon: "📦" },
  { href: "/admin/orders", label: "Orders", icon: "🛒" },
  { href: "/admin/reviews", label: "Reviews", icon: "⭐" },
  { href: "/admin/abandoned-carts", label: "Abandoned Carts", icon: "🛍️" },
  { href: "/admin/contacts", label: "Contacts", icon: "📩" },
  { href: "/admin/coupons", label: "Coupons", icon: "🏷️" },
  { href: "/admin/subscribers", label: "Subscribers", icon: "📧" },
];

export default function AdminSidebar({ open = false, onClose }) {
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    onClose?.();
  }, [pathname]);

  const handleLogout = async () => {
    await fetch("/api/admin/logout", { method: "POST" });
    onClose?.();
    router.push("/admin/login");
  };

  return (
    <aside
      className={`fixed inset-y-0 left-0 z-[60] flex w-[min(100%,280px)] flex-col border-r border-slate-700 bg-slate-900 text-white shadow-2xl transition-transform duration-300 ease-out lg:static lg:z-auto lg:w-64 lg:shrink-0 lg:translate-x-0 lg:shadow-none ${
        open ? "translate-x-0" : "-translate-x-full"
      }`}
    >
      <div className="relative border-b border-slate-700 p-5 pr-12 lg:p-6">
        <button
          type="button"
          onClick={onClose}
          className="absolute right-3 top-3 flex h-9 w-9 items-center justify-center rounded-lg text-slate-400 hover:bg-slate-800 hover:text-white lg:hidden"
          aria-label="Close menu"
        >
          <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
        <Logo size="sm" href="/admin/dashboard" className="rounded-lg" />
        <p className="mt-2 text-xs text-slate-400">Admin Panel</p>
      </div>

      <nav className="flex-1 space-y-1 overflow-y-auto p-4">
        {navItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            onClick={onClose}
            className={`flex min-h-[44px] items-center gap-3 rounded-xl px-4 py-2.5 text-sm font-medium transition ${
              pathname === item.href
                ? "bg-sky-500/20 text-sky-300"
                : "text-slate-300 hover:bg-slate-800 hover:text-white"
            }`}
          >
            <span>{item.icon}</span>
            {item.label}
          </Link>
        ))}
      </nav>

      <div className="border-t border-slate-700 p-4">
        <Link
          href="/"
          onClick={onClose}
          className="mb-2 block min-h-[44px] py-2 text-xs text-slate-400 hover:text-sky-400"
        >
          ← View Store
        </Link>
        <button
          type="button"
          onClick={handleLogout}
          className="w-full min-h-[44px] rounded-xl bg-slate-800 px-4 py-2.5 text-sm text-slate-300 hover:bg-slate-700"
        >
          Logout
        </button>
      </div>
    </aside>
  );
}
