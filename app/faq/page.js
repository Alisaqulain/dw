import Link from "next/link";
import ContentPageHero from "@/components/layout/ContentPageHero";
import FAQAccordion from "@/components/legal/FAQAccordion";
import JsonLd from "@/components/seo/JsonLd";
import { FAQ_ITEMS } from "@/lib/faq";
import { STORE_CONTACT } from "@/lib/constants";
import { buildMetadata, faqSchema, breadcrumbSchema } from "@/lib/seo";

export const metadata = buildMetadata({
  title: "FAQ — Frequently Asked Questions",
  description:
    "Answers about discreet delivery, body-safe silicone products, COD, returns, shipping, and customer support at TrustSilcon India.",
  path: "/faq",
  keywords: ["TrustSilcon FAQ", "discreet delivery FAQ", "intimate wellness questions", "COD wellness India"],
});

export default function FAQPage() {
  return (
    <>
      <JsonLd
        data={[
          faqSchema(FAQ_ITEMS),
          breadcrumbSchema([
            { name: "Home", href: "/" },
            { name: "FAQ" },
          ]),
        ]}
      />
      <ContentPageHero
        title="Frequently Asked Questions"
        subtitle="Everything you need to know about ordering, delivery, privacy, and our wellness products."
        breadcrumb={[{ label: "FAQ" }]}
      />
      <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6 lg:px-8">
        <FAQAccordion items={FAQ_ITEMS} />

        <div className="mt-12 rounded-2xl bg-sky-50 p-6 text-center ring-1 ring-sky-100">
          <h2 className="text-lg font-bold text-slate-800">Still have questions?</h2>
          <p className="mt-2 text-sm text-slate-600">Our support team is happy to help.</p>
          <div className="mt-5 flex flex-col gap-3 sm:flex-row sm:justify-center">
            <Link href="/contact" className="rounded-full bg-sky-500 px-8 py-3 text-sm font-semibold text-white hover:bg-sky-600">
              Contact Us
            </Link>
            <a href={`mailto:${STORE_CONTACT.email}`} className="rounded-full border border-sky-200 bg-white px-8 py-3 text-sm font-semibold text-sky-600 hover:bg-sky-50">
              {STORE_CONTACT.email}
            </a>
          </div>
        </div>
      </div>
    </>
  );
}
