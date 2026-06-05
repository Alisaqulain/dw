import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import Product from "@/models/Product";
import Review from "@/models/Review";

async function attachReviewStats(products) {
  const ids = products.map((p) => p._id);
  const stats = await Review.aggregate([
    { $match: { productId: { $in: ids }, approved: true } },
    { $group: { _id: "$productId", avgRating: { $avg: "$rating" }, reviewCount: { $sum: 1 } } },
  ]);
  const map = Object.fromEntries(stats.map((s) => [s._id.toString(), s]));
  return products.map((p) => {
    const s = map[p._id.toString()];
    return {
      ...p,
      avgRating: s ? Math.round(s.avgRating * 10) / 10 : p.avgRating || 0,
      reviewCount: s ? s.reviewCount : p.reviewCount || 0,
    };
  });
}

export async function GET(request) {
  try {
    await connectDB();
    const { searchParams } = new URL(request.url);

    const search = searchParams.get("search") || "";
    const category = searchParams.get("category") || "";
    const collection = searchParams.get("collection") || "";
    const minPrice = parseFloat(searchParams.get("minPrice")) || 0;
    const maxPrice = parseFloat(searchParams.get("maxPrice")) || Infinity;
    const featured = searchParams.get("featured");
    const bestseller = searchParams.get("bestseller");
    const dealOfDay = searchParams.get("dealOfDay");
    const isBundle = searchParams.get("isBundle");
    const inStock = searchParams.get("inStock");
    const minRating = parseFloat(searchParams.get("minRating")) || 0;
    const slug = searchParams.get("slug");
    const limit = parseInt(searchParams.get("limit")) || 0;
    const sort = searchParams.get("sort") || "newest";

    const query = { active: true };

    if (slug) {
      const product = await Product.findOne({ slug, active: true }).lean();
      if (!product) return NextResponse.json({ product: null });
      const [enriched] = await attachReviewStats([product]);
      return NextResponse.json({ product: enriched });
    }

    if (search) query.$text = { $search: search };
    if (category) query.category = category;
    if (collection) query.shopCollection = collection;
    if (featured === "true") query.featured = true;
    if (bestseller === "true") query.bestseller = true;
    if (dealOfDay === "true") query.dealOfDay = true;
    if (isBundle === "true") query.isBundle = true;
    if (inStock === "true") query.stock = { $gt: 0 };
    if (minRating > 0) query.avgRating = { $gte: minRating };
    query.price = { $gte: minPrice, $lte: maxPrice === Infinity ? 999999 : maxPrice };

    if (sort === "sale") {
      query.$expr = { $gt: ["$comparePrice", "$price"] };
      query.comparePrice = { $gt: 0 };
    }

    let sortOption = { createdAt: -1 };
    if (sort === "price-low") sortOption = { price: 1 };
    if (sort === "price-high") sortOption = { price: -1 };
    if (sort === "bestseller") sortOption = { salesCount: -1 };
    if (sort === "rating") sortOption = { avgRating: -1 };
    if (sort === "newest") sortOption = { createdAt: -1 };

    let dbQuery = Product.find(query).sort(sortOption);
    if (limit > 0) dbQuery = dbQuery.limit(limit);

    let products = await dbQuery.lean();

    if (sort === "sale") {
      products.sort((a, b) => {
        const discA = a.comparePrice > a.price ? (a.comparePrice - a.price) / a.comparePrice : 0;
        const discB = b.comparePrice > b.price ? (b.comparePrice - b.price) / b.comparePrice : 0;
        return discB - discA;
      });
    }

    products = await attachReviewStats(products);

    const categories = await Product.distinct("category", { active: true });
    const collections = await Product.distinct("shopCollection", { active: true });

    return NextResponse.json({ products, categories, collections });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
