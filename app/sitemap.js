export default function sitemap() {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

  const staticPages = [
    "", "shop", "about", "contact", "faq", "legal", "reviews", "track-order",
    "privacy-policy", "cookie-policy", "shipping-policy",
    "return-refund-policy", "terms", "age-policy",
  ].map((path) => ({
    url: `${baseUrl}/${path}`,
    lastModified: new Date(),
    changeFrequency: path === "" ? "daily" : "weekly",
    priority: path === "" ? 1 : 0.8,
  }));

  return staticPages;
}
