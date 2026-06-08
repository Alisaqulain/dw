import JsonLd from "@/components/seo/JsonLd";
import { buildMetadata, breadcrumbSchema, webPageSchema } from "@/lib/seo";

export const metadata = buildMetadata({
  title: "Shop — Premium Body-Safe Wellness Products",
  description:
    "Browse TrustSilcon's full collection of body-safe silicone intimate wellness products. For Him, For Her, Couple Wellness, Starter Kits & more. Discreet delivery & COD across India.",
  path: "/shop",
  keywords: [
    "buy intimate wellness India",
    "body-safe silicone shop",
    "wellness products online",
    "discreet wellness shop",
    "TrustSilcon shop",
  ],
});

export default function ShopLayout({ children }) {
  return (
    <>
      <JsonLd
        data={[
          webPageSchema({
            title: "Shop Wellness Products",
            description: "Browse body-safe silicone intimate wellness products at TrustSilcon.",
            path: "/shop",
          }),
          breadcrumbSchema([
            { name: "Home", href: "/" },
            { name: "Shop" },
          ]),
        ]}
      />
      {children}
    </>
  );
}
