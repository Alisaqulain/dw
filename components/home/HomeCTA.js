import Link from "next/link";

export default function HomeCTA() {
  return (
    <section className="relative overflow-hidden py-16 sm:py-20">
      <div className="absolute inset-0 bg-gradient-to-br from-sky-500 via-blue-600 to-indigo-700" />
      <div className="absolute inset-0 opacity-30" style={{ backgroundImage: "radial-gradient(circle at 70% 30%, white 0%, transparent 50%)" }} />
      <div className="relative mx-auto max-w-7xl px-4 text-center sm:px-6 lg:px-8">
        <span className="inline-flex items-center gap-2 rounded-full bg-white/15 px-4 py-1.5 text-xs font-bold uppercase tracking-wider text-white ring-1 ring-white/20">
          Premium Wellness · Discreet · Trusted
        </span>
        <h2 className="mt-5 text-3xl font-bold text-white sm:text-4xl lg:text-5xl">
          Your Wellness Journey Starts Here
        </h2>
        <p className="mx-auto mt-4 max-w-2xl text-base text-white/85 sm:text-lg">
          Body-safe silicone. Plain packaging. COD available. Join 50,000+ customers who trust TrustSilcon for premium intimate wellness across India.
        </p>
        <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <Link
            href="/shop"
            className="inline-flex min-h-[48px] w-full items-center justify-center rounded-full bg-white px-8 py-3.5 text-sm font-bold text-[#0c1929] shadow-xl transition hover:bg-sky-50 sm:w-auto"
          >
            Shop Collection →
          </Link>
          <Link
            href="/blog"
            className="inline-flex min-h-[48px] w-full items-center justify-center rounded-full border-2 border-white/30 bg-white/10 px-8 py-3.5 text-sm font-semibold text-white backdrop-blur-sm transition hover:bg-white/20 sm:w-auto"
          >
            Read Wellness Guides
          </Link>
        </div>
      </div>
    </section>
  );
}
