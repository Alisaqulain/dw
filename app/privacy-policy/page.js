import PolicyLayout from "@/components/legal/PolicyLayout";
import Link from "next/link";
import { STORE_CONTACT } from "@/lib/constants";
import { buildMetadata } from "@/lib/seo";

export const metadata = buildMetadata({
  title: "Privacy Policy",
  description:
    "TrustSilcon privacy policy — how we collect, use, and protect your personal data. Discreet billing, secure checkout, and confidential order handling.",
  path: "/privacy-policy",
  keywords: ["privacy policy", "data protection", "discreet billing TrustSilcon"],
});

export default function PrivacyPolicyPage() {
  return (
    <PolicyLayout
      title="Privacy Policy"
      subtitle="How TrustSilcon collects, uses, and protects your personal information."
      breadcrumb={[{ href: "/legal", label: "Legal" }, { label: "Privacy Policy" }]}
    >
      <p>At TrustSilcon, we respect your privacy and are committed to protecting your personal information.</p>

      <h2>Information We Collect</h2>
      <p>We collect information you provide during checkout (name, email, phone, address) and when you contact us. We also collect browsing data through cookies and analytics tools.</p>

      <h2>How We Use Your Information</h2>
      <ul>
        <li>Process and deliver your orders</li>
        <li>Send order updates and transactional emails</li>
        <li>Provide customer support</li>
        <li>Send marketing emails (only if you opt in)</li>
        <li>Improve our website and services</li>
      </ul>

      <h2>Discreet Handling</h2>
      <p>All orders are shipped in plain, unmarked packaging. Your purchase details are never shared with third parties except delivery partners necessary to fulfill your order.</p>

      <h2>Marketing Communications</h2>
      <p>We only send marketing emails if you explicitly opt in. Every marketing email includes an unsubscribe link. You can unsubscribe at any time.</p>

      <h2>Data Security</h2>
      <p>We use industry-standard security measures to protect your data. Payment information is processed securely and we do not store card details on our servers.</p>

      <h2>Contact</h2>
      <p>
        For privacy-related inquiries, email{" "}
        <a href={`mailto:${STORE_CONTACT.email}`} className="text-sky-600 hover:underline">{STORE_CONTACT.email}</a>{" "}
        or use our <Link href="/contact" className="text-sky-600 hover:underline">Contact Us</Link> page.
      </p>
    </PolicyLayout>
  );
}
