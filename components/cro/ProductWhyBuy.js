"use client";

const BENEFITS = [
  { icon: "✓", title: "Medical-Grade Silicone", desc: "Body-safe, non-toxic, hypoallergenic materials." },
  { icon: "📦", title: "Discreet Packaging", desc: "Plain box — no product name on the package." },
  { icon: "💰", title: "Cash On Delivery", desc: "Pay only when your order arrives at your door." },
  { icon: "🚚", title: "Fast Delivery", desc: "3–7 business days across India with tracking." },
  { icon: "🔒", title: "Secure Checkout", desc: "Your personal information stays private." },
  { icon: "⭐", title: "Trusted Quality", desc: "Loved by 50,000+ customers nationwide." },
];

export default function ProductWhyBuy() {
  return (
    <section className="mt-10 rounded-2xl bg-slate-50 p-6 ring-1 ring-slate-100 sm:p-8">
      <h2 className="text-xl font-bold text-slate-900">Why Buy From TrustSilcon?</h2>
      <p className="mt-1 text-sm text-slate-500">Premium wellness with complete privacy and trust.</p>
      <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {BENEFITS.map(({ icon, title, desc }) => (
          <div key={title} className="flex gap-3 rounded-xl bg-white p-4 shadow-sm ring-1 ring-slate-100">
            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-sky-100 text-lg font-bold text-sky-600">{icon}</span>
            <div>
              <p className="font-semibold text-slate-800">{title}</p>
              <p className="mt-0.5 text-xs leading-relaxed text-slate-500">{desc}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
