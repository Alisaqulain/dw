import { connectDB } from "@/lib/mongodb";
import Product from "@/models/Product";
import Review from "@/models/Review";
import PremiumHero from "@/components/cro/PremiumHero";
import BestSellersSection from "@/components/cro/BestSellersSection";
import CategoryTiles from "@/components/home/CategoryTiles";
import WhyChooseUs from "@/components/cro/WhyChooseUs";
import HomeReviews from "@/components/home/HomeReviews";
import FAQ from "@/components/home/FAQ";
import { DiscreetDeliverySection } from "@/components/home/ContentSections";
import WhatsAppHelpCTA from "@/components/cro/WhatsAppHelpCTA";
import JsonLd from "@/components/seo/JsonLd";
import { buildMetadata, faqSchema } from "@/lib/seo";
import { FAQ_ITEMS } from "@/lib/faq";

export const revalidate = 60;

export const metadata = buildMetadata({
  title: "TrustSilcon — Premium Silicone Wellness Collection India",
  description:
    "Shop premium body-safe silicone wellness products with discreet delivery across India. Medical-grade materials, COD available, plain packaging, 3–7 day shipping. Trusted by 50,000+ customers.",
  path: "/",
  keywords: [
    "intimate wellness India",
    "body-safe silicone products",
    "discreet delivery India",
    "adult wellness shop",
    "medical-grade silicone",
    "COD wellness products",
    "TrustSilcon",
  ],
});

async function getHomeData() {
  try {
    await connectDB();
    const [bestsellers, allActive, reviews] = await Promise.all([
      Product.find({ active: true, bestseller: true }).limit(12).lean(),
      Product.find({ active: true }).sort({ createdAt: -1 }).limit(12).lean(),
      Review.find({ approved: true }).sort({ createdAt: -1 }).limit(12).lean(),
    ]);

    const merged = [...bestsellers];
    for (const p of allActive) {
      if (merged.length >= 8) break;
      if (!merged.some((b) => String(b._id) === String(p._id))) merged.push(p);
    }

    const featured = merged[0] || allActive[0] || null;

    return {
      bestsellers: JSON.parse(JSON.stringify(merged)),
      featuredProduct: featured ? JSON.parse(JSON.stringify(featured)) : null,
      reviews: JSON.parse(JSON.stringify(reviews)),
    };
  } catch {
    return { bestsellers: [], featuredProduct: null, reviews: [] };
  }
}

export default async function HomePage() {
  const { bestsellers, featuredProduct, reviews } = await getHomeData();

  return (
    <>
      <JsonLd data={faqSchema(FAQ_ITEMS.slice(0, 6))} />
      <PremiumHero featuredProduct={featuredProduct} />
      <BestSellersSection products={bestsellers} />
      <CategoryTiles />
      <WhyChooseUs />
      <HomeReviews reviews={reviews} />
      <FAQ />
      <DiscreetDeliverySection />
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <WhatsAppHelpCTA context="homepage" />
      </div>
    </>
  );
}
