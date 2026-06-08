import { buildMetadata, breadcrumbSchema, webPageSchema } from "@/lib/seo";
import JsonLd from "@/components/seo/JsonLd";

export const metadata = buildMetadata({
  title: "Track Order — Live Delivery Status",
  description:
    "Track your TrustSilcon order in real time. Enter order ID and phone number to see AWB, courier, and delivery status with discreet shipping updates across India.",
  path: "/track-order",
  keywords: ["track order TrustSilcon", "order tracking India", "AWB tracking", "discreet delivery status"],
});

export default function TrackOrderLayout({ children }) {
  return (
    <>
      <JsonLd
        data={[
          webPageSchema({
            title: "Track Order",
            description: "Track TrustSilcon orders with live Shiprocket delivery updates.",
            path: "/track-order",
          }),
          breadcrumbSchema([
            { name: "Home", href: "/" },
            { name: "Track Order" },
          ]),
        ]}
      />
      {children}
    </>
  );
}
