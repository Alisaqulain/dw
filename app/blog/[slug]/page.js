import Link from "next/link";
import { notFound } from "next/navigation";
import ContentPageHero from "@/components/layout/ContentPageHero";
import JsonLd from "@/components/seo/JsonLd";
import { GUIDES, getGuideBySlug, getAllGuideSlugs } from "@/lib/guides";
import { buildMetadata, articleSchema, breadcrumbSchema } from "@/lib/seo";

export function generateStaticParams() {
  return getAllGuideSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const guide = getGuideBySlug(slug);
  if (!guide) return { title: "Article Not Found" };
  return buildMetadata({
    title: guide.title,
    description: guide.excerpt,
    path: `/blog/${slug}`,
    keywords: guide.keywords,
    type: "article",
  });
}

export default async function BlogArticlePage({ params }) {
  const { slug } = await params;
  const guide = getGuideBySlug(slug);
  if (!guide) notFound();

  const related = GUIDES.filter((g) => g.slug !== slug).slice(0, 3);

  return (
    <>
      <JsonLd
        data={[
          articleSchema({
            title: guide.title,
            description: guide.excerpt,
            slug: guide.slug,
            datePublished: guide.datePublished,
            dateModified: guide.dateModified,
          }),
          breadcrumbSchema([
            { name: "Home", href: "/" },
            { name: "Wellness Guides", href: "/blog" },
            { name: guide.title },
          ]),
        ]}
      />
      <ContentPageHero
        title={guide.title}
        subtitle={guide.excerpt}
        breadcrumb={[
          { label: "Wellness Guides", href: "/blog" },
          { label: guide.category },
        ]}
      />
      <article className="mx-auto max-w-3xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="mb-8 flex flex-wrap items-center gap-3 text-sm text-slate-500">
          <span className="rounded-full bg-sky-50 px-3 py-1 text-xs font-semibold text-sky-700">{guide.category}</span>
          <time dateTime={guide.dateModified}>
            Updated {new Date(guide.dateModified).toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" })}
          </time>
          <span>{guide.readTime} read</span>
        </div>
        <div className="prose prose-slate max-w-none space-y-8">
          {guide.sections.map((section) => (
            <section key={section.heading}>
              <h2 className="text-xl font-bold text-slate-900">{section.heading}</h2>
              <p className="mt-3 leading-relaxed text-slate-600">{section.body}</p>
            </section>
          ))}
        </div>
        <div className="mt-12 rounded-2xl bg-gradient-to-br from-[#0c1929] to-[#1e3a5f] p-8 text-center">
          <h3 className="text-xl font-bold text-white">Ready to Shop?</h3>
          <p className="mt-2 text-sm text-slate-300">Explore our premium body-safe collection with discreet delivery.</p>
          <Link href="/shop" className="mt-5 inline-flex rounded-full bg-sky-500 px-8 py-3 text-sm font-semibold text-white hover:bg-sky-400">
            Browse Products →
          </Link>
        </div>
        {related.length > 0 && (
          <aside className="mt-14 border-t border-slate-100 pt-10">
            <h3 className="text-lg font-bold text-slate-900">Related Guides</h3>
            <ul className="mt-4 space-y-3">
              {related.map((g) => (
                <li key={g.slug}>
                  <Link href={`/blog/${g.slug}`} className="text-sm font-medium text-sky-600 hover:text-sky-700">
                    {g.icon} {g.title}
                  </Link>
                </li>
              ))}
            </ul>
          </aside>
        )}
      </article>
    </>
  );
}
