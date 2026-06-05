function PolicyLayout({ title, children }) {
  return (
    <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6 lg:px-8">
      <h1 className="text-3xl font-bold text-slate-800">{title}</h1>
      <div className="mt-8 space-y-4 text-sm leading-relaxed text-slate-600">{children}</div>
      <p className="mt-8 text-xs text-slate-400">Last updated: {new Date().toLocaleDateString("en-IN", { month: "long", year: "numeric" })}</p>
    </div>
  );
}

export const metadata = { title: "Age Verification Policy" };

export default function AgePolicyPage() {
  return (
    <PolicyLayout title="Age Verification Policy">
      <p>TrustSilcon sells adult intimate wellness products intended exclusively for individuals aged 18 years and above.</p>
      <h2 className="text-lg font-bold text-slate-800">Age Requirement</h2>
      <p>By accessing this website and placing an order, you confirm that you are at least 18 years of age and of legal age to purchase adult wellness products in your jurisdiction.</p>
      <h2 className="text-lg font-bold text-slate-800">Verification Process</h2>
      <p>We display an age verification prompt on your first visit. Your confirmation is stored locally on your device. We do not collect or store your date of birth.</p>
      <h2 className="text-lg font-bold text-slate-800">Under 18</h2>
      <p>If you are under 18, you must not access or use this website. Clicking &ldquo;I am under 18&rdquo; will redirect you away from our site.</p>
      <h2 className="text-lg font-bold text-slate-800">Parental Responsibility</h2>
      <p>Parents and guardians are responsible for monitoring minors&apos; internet usage. TrustSilcon is not liable for unauthorised access by minors.</p>
      <h2 className="text-lg font-bold text-slate-800">Contact</h2>
      <p>For questions about this policy, please contact us through our Contact page.</p>
    </PolicyLayout>
  );
}
