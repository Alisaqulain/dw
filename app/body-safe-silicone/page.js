import Link from "next/link";
import ContentPageHero from "@/components/layout/ContentPageHero";
import JsonLd from "@/components/seo/JsonLd";
import { buildMetadata, breadcrumbSchema } from "@/lib/seo";

export const metadata = buildMetadata({
  title: "Body-Safe Silicone — Medical-Grade Wellness Materials",
  description:
    "TrustSilcon uses only medical-grade, non-toxic, phthalate-free silicone. Learn why body-safe materials matter for intimate wellness products in India.",
  path: "/body-safe-silicone",
  keywords: [
    "body-safe silicone",
    "medical-grade silicone India",
    "non-toxic intimate products",
    "phthalate-free silicone",
    "safe wellness materials",
  ],
});

const FEATURES = [
  { icon: "🧪", title: "Medical-Grade", desc: "Platinum-cured silicone meeting healthcare safety standards." },
  { icon: "🚫", title: "Non-Toxic", desc: "Free from phthalates, BPA, and harmful plasticizers." },
  { icon: "💧", title: "Non-Porous", desc: "Resists bacteria absorption — safer and easier to clean." },
  { icon: "🌿", title: "Hypoallergenic", desc: "Gentle on sensitive skin with minimal irritation risk." },
  { icon: "✅", title: "Quality Tested", desc: "Every batch tested for safety, durability, and performance." },
  { icon: "♻️", title: "Long-Lasting", desc: "Premium silicone lasts years with proper care and maintenance." },
];

const AVOID = [
  "Jelly rubber or PVC with phthalates",
  "Products with strong chemical odours",
  "Materials that feel sticky or oily",
  "Unbranded items with no material disclosure",
  "Porous materials that harbour bacteria",
];

export default function BodySafeSiliconePage() {
  return (
    <>
      <JsonLd
        data={breadcrumbSchema([
          { name: "Home", href: "/" },
          { name: "Body-Safe Silicone" },
        ])}
      />
      <ContentPageHero
        title="Body-Safe Silicone, Always"
        subtitle="Medical-grade materials you can trust. Every TrustSilcon product is crafted for your safety and wellness."
        breadcrumb={[{ label: "Body-Safe Silicone" }]}
      />
      <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-3xl text-center">
          <p className="text-lg leading-relaxed text-slate-600">
            Not all intimate wellness products are created equal. Cheap materials can contain harmful chemicals,
            absorb bacteria, and degrade quickly. TrustSilcon commits to medical-grade silicone — the gold standard
            for body-safe intimate wellness.
          </p>
        </div>
        <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {FEATURES.map((f) => (
            <div key={f.title} className="rounded-3xl bg-white p-8 shadow-sm ring-1 ring-slate-100 transition hover:shadow-lg hover:ring-sky-200">
              <span className="text-3xl">{f.icon}</span>
              <h2 className="mt-4 text-lg font-bold text-slate-900">{f.title}</h2>
              <p className="mt-2 text-sm leading-relaxed text-slate-500">{f.desc}</p>
            </div>
          ))}
        </div>
        <div className="mt-16 grid gap-10 lg:grid-cols-2">
          <section className="rounded-3xl bg-red-50 p-8 ring-1 ring-red-100">
            <h2 className="text-xl font-bold text-red-900">Materials to Avoid</h2>
            <ul className="mt-4 space-y-2">
              {AVOID.map((item) => (
                <li key={item} className="flex items-start gap-2 text-sm text-red-800">
                  <span className="text-red-400">✕</span> {item}
                </li>
              ))}
            </ul>
          </section>
          <section className="rounded-3xl bg-sky-50 p-8 ring-1 ring-sky-100">
            <h2 className="text-xl font-bold text-sky-900">The TrustSilcon Promise</h2>
            <p className="mt-4 text-sm leading-relaxed text-sky-800">
              We source only certified medical-grade silicone and test every product batch. Our transparent
              material standards mean you never have to guess what you are putting on your body.
            </p>
            <Link href="/blog/body-safe-silicone-guide" className="mt-4 inline-flex text-sm font-semibold text-sky-700 hover:text-sky-800">
              Read the full safety guide →
            </Link>
          </section>
        </div>
        <div className="mt-16 text-center">
          <Link href="/shop" className="inline-flex rounded-full bg-[#0c1929] px-10 py-3.5 text-sm font-semibold text-white hover:bg-[#1e3a5f]">
            Shop Body-Safe Products →
          </Link>
        </div>
      </div>
    </>
  );
}
