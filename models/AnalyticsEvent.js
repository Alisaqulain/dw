import mongoose from "mongoose";

const AnalyticsEventSchema = new mongoose.Schema(
  {
    eventType: {
      type: String,
      enum: ["page_view", "product_view", "add_to_cart", "initiate_checkout", "purchase"],
      required: true,
      index: true,
    },
    sessionId: { type: String, index: true },
    productId: { type: mongoose.Schema.Types.ObjectId, ref: "Product" },
    productSlug: String,
    productName: String,
    cartValue: { type: Number, default: 0 },
    orderNumber: String,
    page: String,
  },
  { timestamps: true }
);

AnalyticsEventSchema.index({ createdAt: -1 });

export default mongoose.models.AnalyticsEvent ||
  mongoose.model("AnalyticsEvent", AnalyticsEventSchema);
