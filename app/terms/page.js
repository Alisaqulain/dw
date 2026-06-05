import PolicyLayout from "@/components/legal/PolicyLayout";
import Link from "next/link";
import { STORE_CONTACT } from "@/lib/constants";

export const metadata = { title: "Terms & Conditions" };

export default function TermsPage() {
  return (
    <PolicyLayout
      title="Terms & Conditions"
      subtitle="Please read these terms carefully before using our website or placing an order."
      breadcrumb={[{ href: "/legal", label: "Legal" }, { label: "Terms & Conditions" }]}
    >
      <p>By using the TrustSilcon website and placing orders, you agree to these terms and conditions.</p>

      <h2>Eligibility</h2>
      <p>You must be 18 years of age or older to browse or purchase from TrustSilcon. By using this site, you confirm that you meet this requirement.</p>

      <h2>Products</h2>
      <p>All products are intended for adult wellness use only. Product images are for illustration purposes; actual products may vary slightly in appearance, packaging, or shade.</p>

      <h2>Orders & Payment</h2>
      <p>We reserve the right to cancel or refuse orders due to stock unavailability, pricing errors, or suspected fraud. COD and online payment options are available as shown at checkout. Prices are listed in INR and include applicable taxes unless stated otherwise.</p>

      <h2>Shipping & Delivery</h2>
      <p>Delivery timelines are estimates. See our <Link href="/shipping-policy" className="text-sky-600 hover:underline">Shipping Policy</Link> for full details on discreet packaging and delivery.</p>

      <h2>Returns & Refunds</h2>
      <p>Returns are subject to our <Link href="/return-refund-policy" className="text-sky-600 hover:underline">Return & Refund Policy</Link>. Opened hygiene products cannot be returned.</p>

      <h2>Privacy</h2>
      <p>Your use of this site is also governed by our <Link href="/privacy-policy" className="text-sky-600 hover:underline">Privacy Policy</Link>.</p>

      <h2>Intellectual Property</h2>
      <p>All content on this website including text, images, logos, and branding is owned by TrustSilcon and may not be reproduced without written permission.</p>

      <h2>Limitation of Liability</h2>
      <p>TrustSilcon is not liable for indirect, incidental, or consequential damages arising from product use. Please follow product care and usage instructions for safe use.</p>

      <h2>Contact</h2>
      <p>
        For questions about these terms, contact us at{" "}
        <a href={`mailto:${STORE_CONTACT.email}`} className="text-sky-600 hover:underline">{STORE_CONTACT.email}</a>{" "}
        or visit our <Link href="/contact" className="text-sky-600 hover:underline">Contact Us</Link> page.
      </p>

      <h2>Governing Law</h2>
      <p>These terms are governed by the laws of India. Disputes shall be subject to the exclusive jurisdiction of Indian courts.</p>
    </PolicyLayout>
  );
}
