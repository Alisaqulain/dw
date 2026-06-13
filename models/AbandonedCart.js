import mongoose from "mongoose";

const CartItemSchema = new mongoose.Schema({
  productId: { type: mongoose.Schema.Types.ObjectId, ref: "Product" },
  name: String,
  slug: String,
  price: Number,
  quantity: Number,
  color: { type: String, default: "" },
  size: { type: String, default: "" },
});

const AbandonedCartSchema = new mongoose.Schema(
  {
    sessionId: { type: String, required: true, index: true },
    phone: { type: String, default: "" },
    email: { type: String, default: "" },
    customerName: { type: String, default: "" },
    items: [CartItemSchema],
    cartValue: { type: Number, default: 0 },
    checkoutStarted: { type: Boolean, default: false },
    converted: { type: Boolean, default: false },
    lastActiveAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

AbandonedCartSchema.index({ lastActiveAt: -1 });
AbandonedCartSchema.index({ converted: 1, checkoutStarted: 1 });

export default mongoose.models.AbandonedCart ||
  mongoose.model("AbandonedCart", AbandonedCartSchema);
