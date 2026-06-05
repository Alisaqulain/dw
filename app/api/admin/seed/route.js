import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import { requireAdmin } from "@/lib/auth";
import Product from "@/models/Product";
import Coupon from "@/models/Coupon";

const sampleProducts = [
  {
    name: "Silicone Wellness Massager",
    slug: "silicone-wellness-massager",
    shortDescription: "Premium body-safe silicone massager for daily wellness and comfort.",
    fullDescription: "Crafted from medical-grade silicone, this wellness massager offers a smooth, body-safe experience. Waterproof, easy to clean, and designed for personal comfort. Includes discreet packaging.",
    price: 1299, comparePrice: 1799, stock: 50,
    images: [{ url: "https://images.unsplash.com/photo-1556228720-195a672e8a03?w=600&h=600&fit=crop", publicId: "" }],
    category: "Wellness", shopCollection: "For Her", tags: ["wellness", "silicone"],
    material: "Medical-grade silicone", size: "Standard", color: "Sky Blue",
    discreetPackaging: true, featured: true, active: true, bestseller: true, dealOfDay: true,
  },
  {
    name: "Men's Premium Wellness Device",
    slug: "mens-premium-wellness-device",
    shortDescription: "Ergonomic silicone wellness device designed for men.",
    fullDescription: "Premium body-safe silicone device with ergonomic design. Waterproof, rechargeable, and whisper-quiet. Ships in discreet plain packaging.",
    price: 1599, comparePrice: 1999, stock: 45,
    images: [{ url: "https://images.unsplash.com/photo-1612817288484-6f916006177a?w=600&h=600&fit=crop", publicId: "" }],
    category: "Wellness", shopCollection: "For Him", tags: ["wellness", "men"],
    material: "Medical-grade silicone", size: "Standard", color: "Navy",
    discreetPackaging: true, featured: true, active: true, bestseller: true,
  },
  {
    name: "Couple Wellness Set",
    slug: "couple-wellness-set",
    shortDescription: "Shared wellness experience set for couples.",
    fullDescription: "A curated couple's set featuring premium silicone products for shared wellness. Body-safe, easy to clean, discreet packaging included.",
    price: 2999, comparePrice: 3499, stock: 25,
    images: [{ url: "https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?w=600&h=600&fit=crop", publicId: "" }],
    category: "Wellness", shopCollection: "Couple Wellness", tags: ["couple", "set"],
    material: "Medical-grade silicone", size: "Set of 2", color: "Multi",
    discreetPackaging: true, featured: true, active: true, isBundle: true,
  },
  {
    name: "Starter Wellness Kit",
    slug: "starter-wellness-kit",
    shortDescription: "Perfect first-timer kit with essentials.",
    fullDescription: "Everything you need to begin your wellness journey. Includes premium silicone product, care guide, and storage pouch.",
    price: 999, comparePrice: 1299, stock: 60,
    images: [{ url: "https://images.unsplash.com/photo-1596755389378-c31d8fd0c8f3?w=600&h=600&fit=crop", publicId: "" }],
    category: "Care", shopCollection: "Starter Kits", tags: ["starter", "kit"],
    material: "Medical-grade silicone", size: "Kit", color: "White",
    discreetPackaging: true, featured: false, active: true, bestseller: true,
  },
  {
    name: "Silicone Care Lube 100ml",
    slug: "silicone-care-lube",
    shortDescription: "Premium water-based care formula.",
    fullDescription: "Body-safe, pH-balanced care formula compatible with silicone products. Non-staining, easy to clean.",
    price: 499, comparePrice: 649, stock: 100,
    images: [{ url: "https://images.unsplash.com/photo-1556228720-195a672e8a03?w=600&h=600&fit=crop", publicId: "" }],
    category: "Care", shopCollection: "Lubes & Accessories", tags: ["lube", "care"],
    material: "Water-based formula", size: "100ml", color: "Clear",
    discreetPackaging: true, featured: false, active: true,
  },
  {
    name: "Luxury Gift Combo Box",
    slug: "luxury-gift-combo-box",
    shortDescription: "Premium gift set in elegant packaging.",
    fullDescription: "A luxurious gift combo featuring our bestsellers in premium gift packaging. Perfect for special occasions.",
    price: 3499, comparePrice: 4299, stock: 20,
    images: [{ url: "https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?w=600&h=600&fit=crop", publicId: "" }],
    category: "Wellness", shopCollection: "Gift Combos", tags: ["gift", "combo"],
    material: "Medical-grade silicone", size: "Combo", color: "Multi",
    discreetPackaging: true, featured: true, active: true, isBundle: true, bestseller: true,
  },
  {
    name: "Premium Silicone Wellness Ring",
    slug: "premium-silicone-wellness-ring",
    shortDescription: "Soft silicone wellness ring for enhanced comfort.",
    fullDescription: "Flexible, body-safe silicone ring designed for wellness and comfort. Stretchable, durable, and easy to maintain.",
    price: 899, comparePrice: 1199, stock: 75,
    images: [{ url: "https://images.unsplash.com/photo-1596755389378-c31d8fd0c8f3?w=600&h=600&fit=crop", publicId: "" }],
    category: "Wellness", shopCollection: "For Him", tags: ["wellness", "comfort"],
    material: "Medical-grade silicone", size: "One Size", color: "Clear",
    discreetPackaging: true, featured: false, active: true, bestseller: true,
  },
  {
    name: "Rechargeable Personal Care Device",
    slug: "rechargeable-personal-care-device",
    shortDescription: "Elegant rechargeable device with silicone finish.",
    fullDescription: "USB rechargeable wellness device with premium silicone exterior. Whisper-quiet, fully waterproof.",
    price: 1899, comparePrice: 2299, stock: 40,
    images: [{ url: "https://images.unsplash.com/photo-1612817288484-6f916006177a?w=600&h=600&fit=crop", publicId: "" }],
    category: "Care", shopCollection: "For Her", tags: ["rechargeable"],
    material: "Medical-grade silicone", size: "Compact", color: "Rose",
    discreetPackaging: true, featured: true, active: true,
  },
];

export async function POST() {
  try {
    await requireAdmin();
    await connectDB();
    for (const product of sampleProducts) {
      await Product.findOneAndUpdate({ slug: product.slug }, product, { upsert: true });
    }
    await Coupon.findOneAndUpdate(
      { code: "WELCOME10" },
      { code: "WELCOME10", discountType: "percentage", discountValue: 10, minOrderAmount: 499, maxUses: 100, active: true },
      { upsert: true }
    );
    return NextResponse.json({ success: true, message: "Sample data seeded (8 products)" });
  } catch (error) {
    if (error.message === "Unauthorized") return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
