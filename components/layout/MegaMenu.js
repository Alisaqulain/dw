"use client";

import Link from "next/link";
import { COLLECTIONS } from "@/lib/constants";

export default function MegaMenu({ open, onClose }) {
  if (!open) return null;

  return (
    <>
      <div className="fixed inset-0 top-[120px] z-40 bg-black/20 backdrop-blur-sm lg:top-[132px]" onClick={onClose} />
      <div className="absolute left-0 right-0 top-full z-50 animate-slide-down border-t border-sky-100 bg-white shadow-2xl shadow-slate-200/50">
        <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {COLLECTIONS.map((col) => (
              <Link
                key={col.slug}
                href={col.href}
                onClick={onClose}
                className="group flex items-start gap-4 rounded-2xl p-4 transition hover:bg-sky-50"
              >
                <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-sky-100 to-blue-50 text-xl group-hover:from-sky-200 group-hover:to-blue-100">
                  {col.icon}
                </span>
                <div>
                  <p className="font-semibold text-slate-800 group-hover:text-sky-600">{col.label}</p>
                  <p className="mt-0.5 text-xs text-slate-500">{col.desc}</p>
                </div>
              </Link>
            ))}
          </div>
          <div className="mt-6 flex flex-wrap gap-3 border-t border-slate-100 pt-6">
            <Link href="/shop" onClick={onClose} className="rounded-full bg-[#0c1929] px-5 py-2 text-sm font-medium text-white hover:bg-[#1e3a5f]">
              Shop All Products
            </Link>
            <Link href="/shop?sort=bestseller" onClick={onClose} className="rounded-full border border-slate-200 px-5 py-2 text-sm font-medium text-slate-700 hover:border-sky-300 hover:text-sky-600">
              Bestsellers
            </Link>
            <Link href="/track-order" onClick={onClose} className="rounded-full border border-slate-200 px-5 py-2 text-sm font-medium text-slate-700 hover:border-sky-300 hover:text-sky-600">
              Track Order
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}
