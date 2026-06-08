import { buildMetadata } from "@/lib/seo";

export const metadata = buildMetadata({
  title: "Checkout",
  description: "Complete your TrustSilcon order securely.",
  path: "/checkout",
  noIndex: true,
});

export default function CheckoutLayout({ children }) {
  return children;
}
