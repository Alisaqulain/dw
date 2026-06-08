import { connectDB } from "@/lib/mongodb";
import Product from "@/models/Product";
import { getAllGuideSlugs } from "@/lib/guides";
import { getSiteUrl } from "@/lib/utils";

export default async function sitemap() {
  const baseUrl = getSiteUrl();

  const staticPages = [
    "", "shop", "collections", "about", "contact", "faq", "legal", "reviews", "track-order",
    "blog", "discreet-delivery", "body-safe-silicone",
    "privacy-policy", "cookie-policy", "shipping-policy",
    "return-refund-policy", "terms", "age-policy",
  ].map((path) => ({
    url: `${baseUrl}/${path}`,
    lastModified: new Date(),
    changeFrequency: path === "" ? "daily" : path === "blog" ? "weekly" : "weekly",
    priority: path === "" ? 1 : path === "shop" || path === "collections" ? 0.9 : 0.8,
  }));

  const blogPages = getAllGuideSlugs().map((slug) => ({
    url: `${baseUrl}/blog/${slug}`,
    lastModified: new Date(),
    changeFrequency: "monthly",
    priority: 0.7,
  }));

  let productPages = [];
  try {
    await connectDB();
    const products = await Product.find({ active: true }).select("slug updatedAt").lean();
    productPages = products.map((p) => ({
      url: `${baseUrl}/products/${p.slug}`,
      lastModified: p.updatedAt || new Date(),
      changeFrequency: "weekly",
      priority: 0.85,
    }));
  } catch {
    // DB unavailable during build — static pages still included
  }

  return [...staticPages, ...blogPages, ...productPages];
}
