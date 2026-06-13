import { connectDB } from "@/lib/mongodb";
import Product from "@/models/Product";
import Review from "@/models/Review";
import HeroBannerSlider from "@/components/home/HeroBannerSlider";
import StatsBar from "@/components/home/StatsBar";
import PromoFeatures from "@/components/home/PromoFeatures";
import HotSaleSection from "@/components/home/HotSaleSection";
import CategoryTiles from "@/components/home/CategoryTiles";
import ProductCarousel from "@/components/home/ProductSections";
import DealOfDay, { BundleSection } from "@/components/home/DealAndBundle";
import WhyTrustSilcon from "@/components/home/WhyTrustSilcon";
import HomeTrustSection from "@/components/home/HomeTrustSection";
import HomeCTA from "@/components/home/HomeCTA";
import { DiscreetDeliverySection, BodySafeSection, ShiprocketSection, BlogGuideSection } from "@/components/home/ContentSections";
import HomeReviews from "@/components/home/HomeReviews";
import FAQ, { NewsletterSection } from "@/components/home/FAQ";
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
    const [bestsellers, newArrivals, dealProducts, bundles, reviews, saleCandidates] = await Promise.all([
      Product.find({ active: true, bestseller: true }).limit(10).lean(),
      Product.find({ active: true }).sort({ createdAt: -1 }).limit(8).lean(),
      Product.find({ active: true, dealOfDay: true }).limit(1).lean(),
      Product.find({ active: true, isBundle: true }).limit(4).lean(),
      Review.find({ approved: true }).sort({ createdAt: -1 }).limit(8).lean(),
      Product.find({ active: true, comparePrice: { $gt: 0 } }).limit(24).lean(),
    ]);

    const dealOfDay = dealProducts[0] || (await Product.findOne({ active: true, comparePrice: { $gt: 0 } }).sort({ createdAt: -1 }).lean());

    const hotSale = saleCandidates
      .filter((p) => p.comparePrice > p.price)
      .sort((a, b) => (b.comparePrice - b.price) / b.comparePrice - (a.comparePrice - a.price) / a.comparePrice)
      .slice(0, 8);

    return {
      bestsellers: JSON.parse(JSON.stringify(bestsellers)),
      newArrivals: JSON.parse(JSON.stringify(newArrivals)),
      hotSale: JSON.parse(JSON.stringify(hotSale)),
      dealOfDay: dealOfDay ? JSON.parse(JSON.stringify(dealOfDay)) : null,
      bundles: JSON.parse(JSON.stringify(bundles)),
      reviews: JSON.parse(JSON.stringify(reviews)),
    };
  } catch {
    return { bestsellers: [], newArrivals: [], hotSale: [], dealOfDay: null, bundles: [], reviews: [] };
  }
}

export default async function HomePage() {
  const { bestsellers, newArrivals, hotSale, dealOfDay, bundles, reviews } = await getHomeData();

  return (
    <>
      <JsonLd data={faqSchema(FAQ_ITEMS.slice(0, 6))} />
      <HeroBannerSlider />
      <StatsBar />
      <PromoFeatures />
      <HomeTrustSection />
      <HotSaleSection products={hotSale} />
      <CategoryTiles />
      <ProductCarousel title="Bestsellers" subtitle="Most loved by our community" products={bestsellers} viewAllHref="/shop?sort=bestseller" />
      {/* 7. New arrivals */}
      <div className="bg-sky-50/30">
        <ProductCarousel title="New Arrivals" subtitle="Fresh additions to our wellness collection" products={newArrivals} viewAllHref="/shop?sort=newest" />
      </div>
      {/* 8. Deal of the day */}
      <DealOfDay product={dealOfDay} />
      {/* 9. Bundle offers */}
      <BundleSection products={bundles} />
      {/* 10. Why choose TrustSilcon */}
      <WhyTrustSilcon />
      {/* 11. Discreet delivery */}
      <DiscreetDeliverySection />
      {/* 12. Body-safe silicone */}
      <BodySafeSection />
      {/* 13. Shiprocket tracking */}
      <ShiprocketSection />
      {/* 14. Customer reviews */}
      <HomeReviews reviews={reviews} />
      {/* 15. CTA banner */}
      <HomeCTA />
      {/* 16. FAQ */}
      <FAQ />
      {/* 16. Blog/guide */}
      <BlogGuideSection />
      {/* 17. Newsletter */}
      <NewsletterSection />
    </>
  );
}
