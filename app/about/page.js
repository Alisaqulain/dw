import Link from "next/link";
import ContentPageHero from "@/components/layout/ContentPageHero";
import JsonLd from "@/components/seo/JsonLd";
import { STORE_CONTACT } from "@/lib/constants";
import { buildMetadata, breadcrumbSchema } from "@/lib/seo";

export const metadata = buildMetadata({
  title: "About Us — India's Premium Intimate Wellness Brand",
  description:
    "TrustSilcon is India's premium intimate wellness brand. Medical-grade body-safe silicone, discreet packaging, fast delivery, and trusted by 50,000+ customers.",
  path: "/about",
  keywords: ["about TrustSilcon", "intimate wellness brand India", "body-safe silicone brand"],
});

export default function AboutPage() {
  return (
    <>
      <JsonLd
        data={breadcrumbSchema([
          { name: "Home", href: "/" },
          { name: "About Us" },
        ])}
      />
      <ContentPageHero
        title="About TrustSilcon"
        subtitle="India's premium intimate wellness brand — body-safe, discreet, and trusted."
        breadcrumb={[{ label: "About Us" }]}
      />
      <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid gap-10 lg:grid-cols-3">
          <div className="lg:col-span-2 space-y-8 text-slate-600 leading-relaxed">
            <section>
              <h2 className="text-xl font-bold text-slate-800">Who We Are</h2>
              <p className="mt-3">
                TrustSilcon is a premium wellness brand dedicated to providing body-safe silicone products
                that prioritize your comfort, safety, and privacy. We believe personal wellness should be
                accessible, discreet, and backed by quality you can trust.
              </p>
            </section>
            <section>
              <h2 className="text-xl font-bold text-slate-800">Our Mission</h2>
              <p className="mt-3">
                To deliver premium wellness products made from medical-grade silicone, with complete
                discretion from order to delivery. Every product is designed with care, tested for safety,
                and shipped in plain, unmarked packaging.
              </p>
            </section>
            <section>
              <h2 className="text-xl font-bold text-slate-800">Quality Promise</h2>
              <ul className="mt-3 list-inside list-disc space-y-2">
                <li>Medical-grade, body-safe silicone materials</li>
                <li>Non-toxic, hypoallergenic, and easy to clean</li>
                <li>Discreet packaging on every order</li>
                <li>Secure checkout and reliable delivery</li>
                <li>Dedicated customer support</li>
              </ul>
            </section>
            <section>
              <h2 className="text-xl font-bold text-slate-800">Why Choose Us</h2>
              <p className="mt-3">
                We understand that privacy matters. That&apos;s why every aspect of our service — from our
                website to our packaging — is designed to be professional, discreet, and respectful of
                your personal choices.
              </p>
            </section>
          </div>
          <aside className="space-y-4">
            {[
              { icon: "🛡️", title: "Body-Safe", desc: "Medical-grade silicone" },
              { icon: "📦", title: "Discreet", desc: "Plain unmarked packaging" },
              { icon: "🚀", title: "Fast Delivery", desc: "3–7 days across India" },
              { icon: "💳", title: "COD Available", desc: "Pay on delivery" },
            ].map((item) => (
              <div key={item.title} className="rounded-2xl bg-sky-50 p-5 ring-1 ring-sky-100">
                <span className="text-2xl">{item.icon}</span>
                <h3 className="mt-2 font-bold text-slate-800">{item.title}</h3>
                <p className="text-sm text-slate-500">{item.desc}</p>
              </div>
            ))}
            <Link href="/contact" className="block rounded-full bg-[#0c1929] py-3 text-center text-sm font-semibold text-white hover:bg-[#1e3a5f]">
              Contact Us →
            </Link>
          </aside>
        </div>
      </div>
    </>
  );
}
