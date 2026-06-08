import JsonLd from "@/components/seo/JsonLd";
import { buildMetadata, breadcrumbSchema, contactPageSchema, webPageSchema } from "@/lib/seo";

export const metadata = buildMetadata({
  title: "Contact Us — Customer Support",
  description:
    "Contact TrustSilcon for order help, product questions, and discreet delivery support. Email, phone, and WhatsApp available across India.",
  path: "/contact",
  keywords: ["contact TrustSilcon", "customer support", "wellness store help India"],
});

export default function ContactLayout({ children }) {
  return (
    <>
      <JsonLd
        data={[
          contactPageSchema(),
          webPageSchema({ title: "Contact Us", description: "Contact TrustSilcon customer support.", path: "/contact" }),
          breadcrumbSchema([
            { name: "Home", href: "/" },
            { name: "Contact Us" },
          ]),
        ]}
      />
      {children}
    </>
  );
}
