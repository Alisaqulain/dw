import { getSiteUrl } from "@/lib/utils";

export default function robots() {
  const base = getSiteUrl();
  return {
    rules: [
      { userAgent: "*", allow: "/", disallow: ["/admin/", "/api/", "/checkout", "/cart", "/order-success"] },
      { userAgent: "Googlebot", allow: "/", disallow: ["/admin/", "/api/"] },
    ],
    sitemap: `${base}/sitemap.xml`,
    host: base.replace(/^https?:\/\//, ""),
  };
}
