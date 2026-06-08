import { buildMetadata } from "@/lib/seo";

export const metadata = buildMetadata({
  title: "Shopping Cart",
  description: "Your TrustSilcon shopping cart.",
  path: "/cart",
  noIndex: true,
});

export default function CartLayout({ children }) {
  return children;
}
