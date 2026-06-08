import { buildMetadata } from "@/lib/seo";

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
  return children;
}
