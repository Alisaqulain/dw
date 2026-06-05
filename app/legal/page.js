import Link from "next/link";
import ContentPageHero from "@/components/layout/ContentPageHero";
import { LEGAL_PAGES } from "@/lib/faq";
import { STORE_CONTACT } from "@/lib/constants";

export const metadata = {
  title: "Legal Information",
  description: "TrustSilcon legal policies — terms, privacy, cookies, shipping, returns, and age verification.",
};

export default function LegalPage() {
  return (
    <>
      <ContentPageHero
        title="Legal Information"
        subtitle="Our policies on privacy, orders, shipping, returns, and responsible use."
        breadcrumb={[{ label: "Legal" }]}
      />
      <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid gap-4 sm:grid-cols-2">
          {LEGAL_PAGES.map((page) => (
            <Link
              key={page.href}
              href={page.href}
              className="group rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-100 transition hover:-translate-y-0.5 hover:shadow-md hover:ring-sky-200"
            >
              <h2 className="text-base font-bold text-slate-800 group-hover:text-sky-600">{page.label}</h2>
              <p className="mt-2 text-sm text-slate-500">{page.desc}</p>
              <span className="mt-4 inline-flex text-xs font-semibold text-sky-600">Read policy →</span>
            </Link>
          ))}
        </div>

        <div className="mt-12 rounded-2xl bg-slate-50 p-6 ring-1 ring-slate-100">
          <h2 className="text-sm font-bold uppercase tracking-wider text-slate-700">Legal inquiries</h2>
          <p className="mt-2 text-sm text-slate-600">
            For legal or compliance questions, contact us at{" "}
            <a href={`mailto:${STORE_CONTACT.email}`} className="font-semibold text-sky-600 hover:underline">
              {STORE_CONTACT.email}
            </a>
          </p>
          <Link href="/contact" className="mt-4 inline-block text-sm font-semibold text-sky-600 hover:underline">
            Contact Us →
          </Link>
        </div>
      </div>
    </>
  );
}
