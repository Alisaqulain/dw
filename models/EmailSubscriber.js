import mongoose from "mongoose";

const EmailSubscriberSchema = new mongoose.Schema(
  {
    email: { type: String, required: true, unique: true, lowercase: true },
    name: { type: String, default: "" },
    marketingOptIn: { type: Boolean, default: true },
    unsubscribed: { type: Boolean, default: false },
    lastMarketingEmailAt: { type: Date, default: null },
    source: { type: String, default: "checkout" },
  },
  { timestamps: true }
);

export default mongoose.models.EmailSubscriber ||
  mongoose.model("EmailSubscriber", EmailSubscriberSchema);
