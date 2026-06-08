const STATS = [
  { value: "50K+", label: "Happy Customers", icon: "😊" },
  { value: "4.8★", label: "Average Rating", icon: "⭐" },
  { value: "100%", label: "Discreet Delivery", icon: "📦" },
  { value: "3–7 Days", label: "Pan-India Shipping", icon: "🚀" },
];

export default function StatsBar() {
  return (
    <section className="relative z-10 -mt-6 mx-4 sm:mx-6 lg:mx-auto lg:max-w-6xl" aria-label="Trust statistics">
      <div className="overflow-hidden rounded-2xl bg-white shadow-xl shadow-slate-200/60 ring-1 ring-slate-100 sm:rounded-3xl">
        <div className="grid grid-cols-2 divide-x divide-y divide-slate-100 sm:grid-cols-4 sm:divide-y-0">
          {STATS.map((stat) => (
            <div key={stat.label} className="flex flex-col items-center gap-1 px-4 py-5 sm:py-6">
              <span className="text-lg sm:text-xl" aria-hidden="true">{stat.icon}</span>
              <p className="text-xl font-bold tracking-tight text-[#0c1929] sm:text-2xl">{stat.value}</p>
              <p className="text-center text-[11px] font-medium text-slate-500 sm:text-xs">{stat.label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
