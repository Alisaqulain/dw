import mongoose from "mongoose";

const ProductSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    slug: { type: String, required: true, unique: true },
    shortDescription: { type: String, required: true },
    fullDescription: { type: String, required: true },
    price: { type: Number, required: true, min: 0 },
    comparePrice: { type: Number, default: 0 },
    stock: { type: Number, required: true, default: 0, min: 0 },
    images: [{ url: String, publicId: String }],
    category: { type: String, required: true },
    tags: [{ type: String }],
    material: { type: String, default: "Medical-grade silicone" },
    size: { type: String, default: "" },
    color: { type: String, default: "" },
    discreetPackaging: { type: Boolean, default: true },
    featured: { type: Boolean, default: false },
    active: { type: Boolean, default: true },
    bestseller: { type: Boolean, default: false },
    salesCount: { type: Number, default: 0 },
    shopCollection: { type: String, default: "Wellness" },
    dealOfDay: { type: Boolean, default: false },
    isBundle: { type: Boolean, default: false },
    avgRating: { type: Number, default: 0 },
    reviewCount: { type: Number, default: 0 },
  },
  { timestamps: true }
);

ProductSchema.index({ name: "text", shortDescription: "text", tags: "text" });

export default mongoose.models.Product || mongoose.model("Product", ProductSchema);
