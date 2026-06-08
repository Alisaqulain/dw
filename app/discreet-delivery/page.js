import Link from "next/link";
import ContentPageHero from "@/components/layout/ContentPageHero";
import JsonLd from "@/components/seo/JsonLd";
import { buildMetadata, breadcrumbSchema, faqSchema } from "@/lib/seo";

const FAQ = [
  { q: "Will anyone know what's inside my package?", a: "No. All orders ship in plain brown boxes with no product names, brand labels, or revealing descriptions on the outside." },
  { q: "What shows on my bank statement?", a: "A discreet merchant name with no product details. Your intimate purchase remains completely private on billing records." },
  { q: "Can I choose a specific delivery time?", a: "While exact time slots aren't guaranteed, you receive SMS tracking updates so you know when your package is arriving." },
  { q: "Is the inner packaging sealed?", a: "Yes. Products are sealed in hygienic inner packaging inside the plain outer box for double privacy." },
];

export const metadata = buildMetadata({
  title: "Discreet Delivery — 100% Private Packaging India",
  description:
    "TrustSilcon guarantees discreet delivery across India. Plain unmarked boxes, private billing, sealed inner packaging. Your privacy protected from checkout to doorstep.",
  path: "/discreet-delivery",
  keywords: [
    "discreet delivery India",
    "private packaging intimate products",
    "discreet shipping wellness",
    "plain box delivery",
    "TrustSilcon discreet",
  ],
});

const STEPS = [
  { step: "01", title: "Secure Checkout", desc: "Encrypted payment with discreet billing — no product names on your statement." },
  { step: "02", title: "Plain Packaging", desc: "Your order is packed in an unmarked brown box that looks like any regular parcel." },
  { step: "03", title: "Silent Shipping Label", desc: "Courier labels show only sender info — never product contents or intimate item names." },
  { step: "04", title: "Track & Receive", desc: "Real-time SMS tracking so you know exactly when your private package arrives." },
];

export default function DiscreetDeliveryPage() {
  return (
    <>
      <JsonLd
        data={[
          breadcrumbSchema([
            { name: "Home", href: "/" },
            { name: "Discreet Delivery" },
          ]),
          faqSchema(FAQ),
        ]}
      />
      <ContentPageHero
        title="100% Discreet Delivery"
        subtitle="Your privacy is sacred. Every order arrives in plain packaging with private billing — guaranteed."
        breadcrumb={[{ label: "Discreet Delivery" }]}
      />
      <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {STEPS.map((item) => (
            <div key={item.step} className="rounded-3xl bg-slate-50 p-6 ring-1 ring-slate-100">
              <span className="text-3xl font-bold text-sky-200">{item.step}</span>
              <h2 className="mt-3 text-lg font-bold text-slate-900">{item.title}</h2>
              <p className="mt-2 text-sm leading-relaxed text-slate-500">{item.desc}</p>
            </div>
          ))}
        </div>
        <div className="mt-16 grid gap-12 lg:grid-cols-2">
          <section>
            <h2 className="text-2xl font-bold text-slate-900">What Makes Our Delivery Discreet?</h2>
            <ul className="mt-6 space-y-4">
              {[
                "Plain brown cardboard — no logos or product hints",
                "Neutral sender name on shipping label",
                "Sealed hygienic inner packaging",
                "Discreet merchant on bank/payment records",
                "No itemized product names on invoices",
                "Professional courier partners nationwide",
              ].map((item) => (
                <li key={item} className="flex items-start gap-3 text-slate-600">
                  <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-sky-100 text-xs text-sky-600">✓</span>
                  {item}
                </li>
              ))}
            </ul>
            <Link href="/blog/discreet-shopping-delivery-guide" className="mt-6 inline-flex text-sm font-semibold text-sky-600 hover:text-sky-700">
              Read our full discreet shopping guide →
            </Link>
          </section>
          <section className="rounded-3xl bg-[#0c1929] p-8 text-white">
            <h2 className="text-xl font-bold">Frequently Asked</h2>
            <dl className="mt-6 space-y-5">
              {FAQ.map((item) => (
                <div key={item.q}>
                  <dt className="font-semibold text-sky-300">{item.q}</dt>
                  <dd className="mt-1 text-sm text-slate-300">{item.a}</dd>
                </div>
              ))}
            </dl>
          </section>
        </div>
        <div className="mt-16 text-center">
          <Link href="/shop" className="inline-flex rounded-full bg-sky-500 px-10 py-3.5 text-sm font-semibold text-white hover:bg-sky-400">
            Shop with Confidence →
          </Link>
        </div>
      </div>
    </>
  );
}
