import Link from "next/link";
import Logo from "@/components/layout/Logo";

export default function Hero() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-sky-50 via-white to-sky-100/50">
      <div className="absolute -right-32 -top-32 h-96 w-96 rounded-full bg-sky-200/30 blur-3xl" />
      <div className="absolute -bottom-32 -left-32 h-96 w-96 rounded-full bg-sky-300/20 blur-3xl" />
      <div className="relative mx-auto max-w-7xl px-4 py-20 sm:px-6 sm:py-28 lg:px-8">
        <div className="mx-auto max-w-3xl text-center">
          <Logo size="xl" href="/" className="mx-auto rounded-2xl" />
          <span className="mt-6 inline-block rounded-full bg-sky-100 px-4 py-1.5 text-sm font-medium text-sky-600">
            Premium Wellness · Discreet Delivery
          </span>
          <h1 className="mt-6 text-4xl font-bold tracking-tight text-slate-800 sm:text-5xl lg:text-6xl">
            Body-Safe Silicone
            <span className="block text-sky-500">Wellness You Can Trust</span>
          </h1>
          <p className="mt-6 text-lg leading-relaxed text-slate-500">
            Discover premium silicone wellness products crafted for comfort, safety, and discretion.
            Medical-grade materials, plain packaging, and fast delivery across India.
          </p>
          <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Link
              href="/shop"
              className="w-full rounded-2xl bg-gradient-to-r from-sky-500 to-sky-400 px-8 py-4 text-center text-base font-semibold text-white shadow-lg shadow-sky-200 transition hover:shadow-xl sm:w-auto"
            >
              Shop Now
            </Link>
            <Link
              href="/track-order"
              className="w-full rounded-2xl border-2 border-sky-200 bg-white px-8 py-4 text-center text-base font-semibold text-sky-600 transition hover:border-sky-300 hover:bg-sky-50 sm:w-auto"
            >
              Track Order
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
