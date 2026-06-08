import { buildMetadata } from "@/lib/seo";

function PolicyLayout({ title, children }) {
  return (
    <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6 lg:px-8">
      <h1 className="text-3xl font-bold text-slate-800">{title}</h1>
      <div className="mt-8 space-y-4 text-sm leading-relaxed text-slate-600">{children}</div>
      <p className="mt-8 text-xs text-slate-400">Last updated: {new Date().toLocaleDateString("en-IN", { month: "long", year: "numeric" })}</p>
    </div>
  );
}

export const metadata = buildMetadata({
  title: "Return & Refund Policy",
  description: "TrustSilcon return and refund policy for unopened wellness products within 7 days. Hygiene rules, refund process, and exchange guidelines.",
  path: "/return-refund-policy",
});

export default function ReturnRefundPolicyPage() {
  return (
    <PolicyLayout title="Return & Refund Policy">
      <h2 className="text-lg font-bold text-slate-800">Return Eligibility</h2>
      <p>Due to hygiene and safety regulations, opened or used intimate wellness products cannot be returned or exchanged. Unopened products in original sealed packaging may be returned within 7 days of delivery.</p>
      <h2 className="text-lg font-bold text-slate-800">Non-Returnable Items</h2>
      <ul className="list-inside list-disc space-y-1">
        <li>Opened or used products</li>
        <li>Products with broken hygiene seals</li>
        <li>Items marked as final sale</li>
      </ul>
      <h2 className="text-lg font-bold text-slate-800">Return Process</h2>
      <p>Contact our support team with your order ID and reason for return. Once approved, we arrange a pickup. Refunds are processed within 5–7 business days after receiving the returned item.</p>
      <h2 className="text-lg font-bold text-slate-800">Damaged or Defective Items</h2>
      <p>If you receive a damaged or defective product, contact us within 48 hours with photos. We will arrange a replacement or full refund at no extra cost.</p>
      <h2 className="text-lg font-bold text-slate-800">Refund Method</h2>
      <p>Refunds are credited to the original payment method. For COD orders, refunds are processed via bank transfer or UPI within 7 business days.</p>
    </PolicyLayout>
  );
}
