function PolicyLayout({ title, children }) {
  return (
    <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6 lg:px-8">
      <h1 className="text-3xl font-bold text-slate-800">{title}</h1>
      <div className="mt-8 space-y-4 text-sm leading-relaxed text-slate-600">{children}</div>
      <p className="mt-8 text-xs text-slate-400">Last updated: {new Date().toLocaleDateString("en-IN", { month: "long", year: "numeric" })}</p>
    </div>
  );
}

export const metadata = { title: "Shipping Policy" };

export default function ShippingPolicyPage() {
  return (
    <PolicyLayout title="Shipping Policy">
      <h2 className="text-lg font-bold text-slate-800">Delivery Areas</h2>
      <p>We deliver across India to most serviceable pin codes via our shipping partner Shiprocket.</p>
      <h2 className="text-lg font-bold text-slate-800">Processing Time</h2>
      <p>Orders are processed within 1–2 business days. You will receive a confirmation email with your order ID upon placement.</p>
      <h2 className="text-lg font-bold text-slate-800">Delivery Time</h2>
      <p>Standard delivery takes 3–7 business days depending on your location. Remote areas may take longer.</p>
      <h2 className="text-lg font-bold text-slate-800">Shipping Charges</h2>
      <p>Delivery is FREE on orders above ₹999. For orders below ₹999, a flat shipping fee of ₹79 applies.</p>
      <h2 className="text-lg font-bold text-slate-800">Discreet Packaging</h2>
      <p>All orders are shipped in plain, unmarked boxes with no product names or brand labels visible on the outside.</p>
      <h2 className="text-lg font-bold text-slate-800">Order Tracking</h2>
      <p>Track your order anytime using your Order ID and phone number on our Track Order page.</p>
    </PolicyLayout>
  );
}
