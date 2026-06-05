import mongoose from "mongoose";

const ReviewSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    rating: { type: Number, required: true, min: 1, max: 5 },
    review: { type: String, required: true },
    productId: { type: mongoose.Schema.Types.ObjectId, ref: "Product", default: null },
    orderNumber: { type: String, default: "" },
    approved: { type: Boolean, default: false },
  },
  { timestamps: true }
);

export default mongoose.models.Review || mongoose.model("Review", ReviewSchema);
