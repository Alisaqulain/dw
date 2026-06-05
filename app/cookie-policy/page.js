function PolicyLayout({ title, children }) {
  return (
    <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6 lg:px-8">
      <h1 className="text-3xl font-bold text-slate-800">{title}</h1>
      <div className="mt-8 space-y-4 text-sm leading-relaxed text-slate-600">{children}</div>
      <p className="mt-8 text-xs text-slate-400">Last updated: {new Date().toLocaleDateString("en-IN", { month: "long", year: "numeric" })}</p>
    </div>
  );
}

export const metadata = { title: "Cookie Policy" };

export default function CookiePolicyPage() {
  return (
    <PolicyLayout title="Cookie Policy">
      <p>TrustSilcon uses cookies and similar technologies to provide, protect, and improve our shopping experience.</p>
      <h2 className="text-lg font-bold text-slate-800">What Are Cookies?</h2>
      <p>Cookies are small text files stored on your device when you visit our website. They help us remember your preferences and improve site functionality.</p>
      <h2 className="text-lg font-bold text-slate-800">Types of Cookies We Use</h2>
      <ul className="list-inside list-disc space-y-2">
        <li><strong>Essential Cookies:</strong> Required for cart, checkout, age verification, and security. Cannot be disabled.</li>
        <li><strong>Analytics Cookies:</strong> Help us understand how visitors use our site (e.g., Google Analytics). Optional.</li>
        <li><strong>Marketing Cookies:</strong> Used for personalised offers and ad measurement (e.g., Meta Pixel). Optional.</li>
      </ul>
      <h2 className="text-lg font-bold text-slate-800">Managing Your Preferences</h2>
      <p>You can manage cookie preferences via the cookie banner on your first visit, or clear cookies through your browser settings. Rejecting non-essential cookies will not affect core shopping functionality.</p>
      <h2 className="text-lg font-bold text-slate-800">Third-Party Cookies</h2>
      <p>We may use third-party services (analytics, payment, delivery partners) that set their own cookies. Please refer to their respective privacy policies.</p>
      <h2 className="text-lg font-bold text-slate-800">Contact</h2>
      <p>For cookie-related inquiries, visit our Contact page.</p>
    </PolicyLayout>
  );
}
