import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import Product from "@/models/Product";
import Review from "@/models/Review";
import {
  buildProductSearchQuery,
  applyProductSort,
  filterByMinRating,
} from "@/lib/productFilters";

async function attachReviewStats(products) {
  const ids = products.map((p) => p._id);
  if (!ids.length) return products;

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
    const minPriceRaw = searchParams.get("minPrice");
    const maxPriceRaw = searchParams.get("maxPrice");
    const minPrice = minPriceRaw !== null && minPriceRaw !== "" ? parseFloat(minPriceRaw) : null;
    const maxPrice = maxPriceRaw !== null && maxPriceRaw !== "" ? parseFloat(maxPriceRaw) : null;
    const featured = searchParams.get("featured");
    const bestseller = searchParams.get("bestseller");
    const dealOfDay = searchParams.get("dealOfDay");
    const isBundle = searchParams.get("isBundle");
    const onSale = searchParams.get("onSale");
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

    const searchQuery = buildProductSearchQuery(search);
    if (searchQuery) Object.assign(query, searchQuery);

    if (category) query.category = category;
    if (collection) {
      const escaped = collection.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
      query.shopCollection = { $regex: new RegExp(`^${escaped}$`, "i") };
    }
    if (featured === "true") query.featured = true;
    if (bestseller === "true") query.bestseller = true;
    if (dealOfDay === "true") query.dealOfDay = true;
    if (isBundle === "true") query.isBundle = true;
    if (inStock === "true") query.stock = { $gt: 0 };

    if (minPrice !== null && !Number.isNaN(minPrice)) {
      query.price = { ...(query.price || {}), $gte: minPrice };
    }
    if (maxPrice !== null && !Number.isNaN(maxPrice)) {
      query.price = { ...(query.price || {}), $lte: maxPrice };
    }

    const postSort = ["sale", "rating"].includes(sort);
    let sortOption = { createdAt: -1 };
    if (sort === "price-low") sortOption = { price: 1 };
    if (sort === "price-high") sortOption = { price: -1 };
    if (sort === "bestseller") sortOption = { salesCount: -1 };

    let dbQuery = Product.find(query);
    if (!postSort) dbQuery = dbQuery.sort(sortOption);
    if (limit > 0 && !postSort && minRating <= 0) dbQuery = dbQuery.limit(limit);

    let products = await dbQuery.lean();
    products = await attachReviewStats(products);

    if (onSale === "true" || sort === "sale") {
      products = products.filter((p) => p.comparePrice > p.price && p.comparePrice > 0);
    }

    products = filterByMinRating(products, minRating);
    products = applyProductSort(products, sort);

    if (limit > 0) products = products.slice(0, limit);

    const categories = await Product.distinct("category", { active: true });
    const collections = await Product.distinct("shopCollection", { active: true });

    return NextResponse.json({ products, categories, collections, total: products.length });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
