const highlights = [
  {
    icon: "🛡️",
    title: "Body-Safe Silicone",
    desc: "Medical-grade, non-toxic silicone for safe wellness care.",
  },
  {
    icon: "📦",
    title: "Discreet Packaging",
    desc: "Plain, unmarked boxes. Your privacy is our priority.",
  },
  {
    icon: "🚀",
    title: "Fast Delivery",
    desc: "Quick shipping across India with real-time tracking.",
  },
  {
    icon: "📍",
    title: "Easy Tracking",
    desc: "Track your order anytime with order ID and phone.",
  },
  {
    icon: "🔒",
    title: "Secure Checkout",
    desc: "Safe payments with COD and online options.",
  },
];

export default function Highlights() {
  return (
    <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
        {highlights.map((item) => (
          <div
            key={item.title}
            className="rounded-2xl bg-white p-6 text-center shadow-sm ring-1 ring-sky-100 transition hover:shadow-md"
          >
            <span className="text-3xl">{item.icon}</span>
            <h3 className="mt-3 text-sm font-semibold text-slate-800">{item.title}</h3>
            <p className="mt-1 text-xs leading-relaxed text-slate-500">{item.desc}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
