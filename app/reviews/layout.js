import { connectDB } from "@/lib/mongodb";
import Review from "@/models/Review";
import JsonLd from "@/components/seo/JsonLd";
import { buildMetadata, breadcrumbSchema, webPageSchema } from "@/lib/seo";
import { getSiteUrl } from "@/lib/utils";

export const metadata = buildMetadata({
  title: "Customer Reviews — Trusted by Thousands",
  description:
    "Read verified TrustSilcon customer reviews. Real ratings on body-safe silicone wellness products, discreet delivery, and shopping experience across India.",
  path: "/reviews",
  keywords: ["TrustSilcon reviews", "intimate wellness reviews", "customer ratings India"],
});

async function getReviewSchema() {
  try {
    await connectDB();
    const reviews = await Review.find({ approved: true }).sort({ createdAt: -1 }).limit(10).lean();
    if (!reviews.length) return null;
    return {
      "@context": "https://schema.org",
      "@type": "Product",
      name: "TrustSilcon Wellness Products",
      url: getSiteUrl(),
      aggregateRating: {
        "@type": "AggregateRating",
        ratingValue: (reviews.reduce((s, r) => s + r.rating, 0) / reviews.length).toFixed(1),
        reviewCount: reviews.length,
        bestRating: 5,
        worstRating: 1,
      },
      review: reviews.slice(0, 5).map((r) => ({
        "@type": "Review",
        author: { "@type": "Person", name: r.name || "Verified Buyer" },
        reviewRating: { "@type": "Rating", ratingValue: r.rating, bestRating: 5 },
        reviewBody: r.review || "",
        datePublished: r.createdAt,
      })),
    };
  } catch {
    return null;
  }
}

export default async function ReviewsLayout({ children }) {
  const reviewSchema = await getReviewSchema();
  const schemas = [
    webPageSchema({
      title: "Customer Reviews",
      description: "Verified TrustSilcon customer reviews and ratings.",
      path: "/reviews",
    }),
    breadcrumbSchema([
      { name: "Home", href: "/" },
      { name: "Reviews" },
    ]),
  ];
  if (reviewSchema) schemas.push(reviewSchema);

  return (
    <>
      <JsonLd data={schemas} />
      {children}
    </>
  );
}
