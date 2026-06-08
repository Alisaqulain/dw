import Link from "next/link";
import ContentPageHero from "@/components/layout/ContentPageHero";
import JsonLd from "@/components/seo/JsonLd";
import { COLLECTIONS } from "@/lib/constants";
import { buildMetadata, breadcrumbSchema } from "@/lib/seo";

export const metadata = buildMetadata({
  title: "Shop Collections — For Him, For Her & Couple Wellness",
  description:
    "Browse TrustSilcon collections: For Him, For Her, Couple Wellness, Starter Kits, Gift Combos, Lubes & Accessories. Premium body-safe silicone with discreet delivery.",
  path: "/collections",
  keywords: [
    "intimate wellness collections",
    "for him wellness products",
    "for her wellness India",
    "couple wellness products",
    "starter kits intimate wellness",
  ],
});

const GRADIENTS = [
  "from-sky-500 via-blue-600 to-indigo-700",
  "from-cyan-400 via-sky-500 to-blue-600",
  "from-violet-500 via-indigo-600 to-blue-700",
  "from-teal-400 via-cyan-500 to-sky-600",
  "from-fuchsia-500 via-violet-600 to-indigo-700",
  "from-rose-500 via-pink-600 to-violet-600",
  "from-amber-400 via-orange-500 to-rose-500",
  "from-emerald-400 via-teal-500 to-cyan-600",
];

export default function CollectionsPage() {
  return (
    <>
      <JsonLd
        data={breadcrumbSchema([
          { name: "Home", href: "/" },
          { name: "Collections" },
        ])}
      />
      <ContentPageHero
        title="Shop by Collection"
        subtitle="Curated wellness categories for every preference — all body-safe, all discreet."
        breadcrumb={[{ label: "Collections" }]}
      />
      <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {COLLECTIONS.map((col, i) => (
            <Link
              key={col.slug}
              href={col.href}
              className={`group relative overflow-hidden rounded-3xl bg-gradient-to-br ${GRADIENTS[i % GRADIENTS.length]} p-8 text-white shadow-lg transition hover:-translate-y-1 hover:shadow-xl`}
            >
              <span className="text-4xl">{col.icon}</span>
              <h2 className="mt-4 text-xl font-bold">{col.label}</h2>
              <p className="mt-2 text-sm text-white/80">{col.desc}</p>
              <span className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-white/90 group-hover:gap-2 transition-all">
                Shop now →
              </span>
            </Link>
          ))}
        </div>
        <div className="mt-14 rounded-3xl bg-slate-50 p-8 text-center ring-1 ring-slate-100 sm:p-12">
          <h2 className="text-2xl font-bold text-slate-900">Not sure where to start?</h2>
          <p className="mx-auto mt-3 max-w-lg text-slate-500">
            Check our first-time buyer&apos;s guide or explore Starter Kits designed for beginners.
          </p>
          <div className="mt-6 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Link href="/blog/first-time-buyers-guide" className="rounded-full bg-sky-500 px-8 py-3 text-sm font-semibold text-white hover:bg-sky-400">
              First-Time Guide
            </Link>
            <Link href="/shop?collection=Starter%20Kits" className="rounded-full border border-slate-200 bg-white px-8 py-3 text-sm font-semibold text-slate-700 hover:bg-slate-50">
              Starter Kits
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}
