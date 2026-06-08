import { buildMetadata } from "@/lib/seo";

export const metadata = buildMetadata({
  title: "Unsubscribe",
  description: "Manage your TrustSilcon email preferences.",
  path: "/unsubscribe",
  noIndex: true,
});

export default function UnsubscribeLayout({ children }) {
  return children;
}
