"use client";

import { useCallback, useEffect, useState } from "react";
import AdminSidebar from "@/components/admin/AdminSidebar";

export default function AdminShell({ children }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const closeMenu = useCallback(() => setMenuOpen(false), []);

  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [menuOpen]);

  return (
    <div className="min-h-screen bg-slate-100">
      <header className="sticky top-0 z-40 flex h-14 items-center gap-3 border-b border-slate-200 bg-white px-4 lg:hidden">
        <button
          type="button"
          onClick={() => setMenuOpen(true)}
          className="flex h-10 w-10 items-center justify-center rounded-lg text-slate-700 hover:bg-slate-100"
          aria-label="Open admin menu"
        >
          <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
        <p className="text-sm font-bold text-slate-800">TrustSilcon Admin</p>
      </header>

      {menuOpen && (
        <button
          type="button"
          className="fixed inset-0 z-50 bg-black/50 lg:hidden"
          aria-label="Close admin menu"
          onClick={closeMenu}
        />
      )}

      <div className="flex min-h-[calc(100vh-3.5rem)] lg:min-h-screen">
        <AdminSidebar open={menuOpen} onClose={closeMenu} />
        <main className="min-w-0 flex-1 overflow-x-auto p-4 sm:p-6 lg:p-8">{children}</main>
      </div>
    </div>
  );
}
