import { buildMetadata } from "@/lib/seo";

export const metadata = buildMetadata({
  title: "Order Confirmed",
  description: "Your TrustSilcon order has been placed.",
  path: "/order-success",
  noIndex: true,
});

export default function OrderSuccessLayout({ children }) {
  return children;
}
