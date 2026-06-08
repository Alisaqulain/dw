import Link from "next/link";
import ContentPageHero from "@/components/layout/ContentPageHero";
import JsonLd from "@/components/seo/JsonLd";
import { GUIDES } from "@/lib/guides";
import { buildMetadata, breadcrumbSchema } from "@/lib/seo";

export const metadata = buildMetadata({
  title: "Wellness Guides & Blog",
  description:
    "Expert guides on body-safe silicone, discreet delivery, product care, and intimate wellness. Learn before you shop at TrustSilcon India.",
  path: "/blog",
  keywords: [
    "intimate wellness guide",
    "body-safe silicone guide",
    "discreet delivery India",
    "wellness blog India",
    "TrustSilcon guides",
  ],
});

export default function BlogPage() {
  const categories = [...new Set(GUIDES.map((g) => g.category))];

  return (
    <>
      <JsonLd
        data={breadcrumbSchema([
          { name: "Home", href: "/" },
          { name: "Wellness Guides" },
        ])}
      />
      <ContentPageHero
        title="Wellness Guides & Blog"
        subtitle="Expert articles on safety, privacy, care, and making informed wellness choices."
        breadcrumb={[{ label: "Wellness Guides" }]}
      />
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="mb-10 flex flex-wrap gap-2">
          {categories.map((cat) => (
            <span
              key={cat}
              className="rounded-full bg-sky-50 px-4 py-1.5 text-xs font-semibold text-sky-700 ring-1 ring-sky-100"
            >
              {cat}
            </span>
          ))}
        </div>
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {GUIDES.map((guide) => (
            <article
              key={guide.slug}
              className="group flex flex-col overflow-hidden rounded-3xl bg-white shadow-sm ring-1 ring-slate-100 transition hover:-translate-y-1 hover:shadow-xl hover:ring-sky-200"
            >
              <div className="bg-gradient-to-br from-sky-50 to-blue-50 px-6 py-8">
                <span className="text-4xl" aria-hidden="true">{guide.icon}</span>
                <span className="mt-4 inline-block rounded-full bg-white px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-sky-600 ring-1 ring-sky-100">
                  {guide.category}
                </span>
              </div>
              <div className="flex flex-1 flex-col p-6">
                <time dateTime={guide.dateModified} className="text-xs text-slate-400">
                  Updated {new Date(guide.dateModified).toLocaleDateString("en-IN", { month: "short", year: "numeric" })}
                  {" · "}{guide.readTime} read
                </time>
                <h2 className="mt-2 text-lg font-bold text-slate-900 group-hover:text-sky-600">
                  <Link href={`/blog/${guide.slug}`}>{guide.title}</Link>
                </h2>
                <p className="mt-2 flex-1 text-sm leading-relaxed text-slate-500">{guide.excerpt}</p>
                <Link
                  href={`/blog/${guide.slug}`}
                  className="mt-4 text-sm font-semibold text-sky-600 hover:text-sky-700"
                >
                  Read article →
                </Link>
              </div>
            </article>
          ))}
        </div>
      </div>
    </>
  );
}
