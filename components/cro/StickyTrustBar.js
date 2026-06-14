"use client";

const ITEMS = [
  { icon: "🔒", text: "100% Discreet Packaging" },
  { icon: "💰", text: "Cash On Delivery Available" },
  { icon: "🚚", text: "Fast Delivery Across India" },
  { icon: "🛡", text: "Secure Checkout" },
  { icon: "⭐", text: "Trusted by Customers" },
];

export default function StickyTrustBar() {
  const text = ITEMS.map((i) => `${i.icon} ${i.text}`).join("   •   ");

  return (
    <div className="sticky top-[56px] z-40 border-b border-emerald-100/80 bg-gradient-to-r from-emerald-50 via-white to-sky-50 shadow-sm sm:top-[84px]">
      <div className="mx-auto max-w-7xl px-3 py-2">
        <div className="hidden items-center justify-center gap-6 text-[11px] font-semibold text-slate-700 sm:flex sm:text-xs">
          {ITEMS.map(({ icon, text: label }) => (
            <span key={label} className="flex items-center gap-1.5 whitespace-nowrap">
              <span aria-hidden>{icon}</span>
              {label}
            </span>
          ))}
        </div>
        <div className="flex animate-marquee whitespace-nowrap text-[11px] font-semibold text-slate-700 sm:hidden">
          {[...Array(2)].map((_, i) => (
            <span key={i} className="mx-4">{text}</span>
          ))}
        </div>
      </div>
    </div>
  );
}
