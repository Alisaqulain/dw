"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import Logo from "@/components/layout/Logo";

const navItems = [
  { href: "/admin/dashboard", label: "Dashboard", icon: "📊" },
  { href: "/admin/products", label: "Products", icon: "📦" },
  { href: "/admin/orders", label: "Orders", icon: "🛒" },
  { href: "/admin/reviews", label: "Reviews", icon: "⭐" },
  { href: "/admin/contacts", label: "Contacts", icon: "📩" },
  { href: "/admin/coupons", label: "Coupons", icon: "🏷️" },
  { href: "/admin/subscribers", label: "Subscribers", icon: "📧" },
];

export default function AdminSidebar() {
  const pathname = usePathname();
  const router = useRouter();

  const handleLogout = async () => {
    await fetch("/api/admin/logout", { method: "POST" });
    router.push("/admin/login");
  };

  return (
    <aside className="flex w-64 shrink-0 flex-col border-r border-slate-200 bg-slate-900 text-white">
      <div className="border-b border-slate-700 p-6">
        <Logo size="sm" href="/admin/dashboard" className="rounded-lg" />
        <p className="mt-2 text-xs text-slate-400">Admin Panel</p>
      </div>
      <nav className="flex-1 space-y-1 p-4">
        {navItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={`flex items-center gap-3 rounded-xl px-4 py-2.5 text-sm font-medium transition ${
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
        <Link href="/" className="mb-2 block text-xs text-slate-400 hover:text-sky-400">← View Store</Link>
        <button onClick={handleLogout} className="w-full rounded-xl bg-slate-800 px-4 py-2 text-sm text-slate-300 hover:bg-slate-700">
          Logout
        </button>
      </div>
    </aside>
  );
}
