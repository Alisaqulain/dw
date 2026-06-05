import ContentPageHero from "@/components/layout/ContentPageHero";
import ContactForm, { ContactInfo } from "@/components/contact/ContactForm";

export default function ContactPage() {
  return (
    <>
      <ContentPageHero
        title="Contact Us"
        subtitle="We're here to help with orders, products, returns, and any questions — discreetly."
        breadcrumb={[{ label: "Contact Us" }]}
      />
      <div className="mx-auto max-w-5xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid gap-8 lg:grid-cols-5">
          <ContactInfo />
          <ContactForm />
        </div>
      </div>
    </>
  );
}
