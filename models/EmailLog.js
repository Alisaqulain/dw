import mongoose from "mongoose";

const EmailLogSchema = new mongoose.Schema(
  {
    to: { type: String, required: true },
    subject: { type: String, required: true },
    type: { type: String, default: "transactional" },
    status: { type: String, enum: ["sent", "failed", "skipped"], default: "sent" },
    error: { type: String, default: null },
  },
  { timestamps: true }
);

export default mongoose.models.EmailLog || mongoose.model("EmailLog", EmailLogSchema);
