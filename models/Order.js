import mongoose from "mongoose";

const OrderItemSchema = new mongoose.Schema({
  productId: { type: mongoose.Schema.Types.ObjectId, ref: "Product" },
  name: String,
  slug: String,
  price: Number,
  quantity: Number,
  image: String,
});

const TrackingEventSchema = new mongoose.Schema({
  status: String,
  description: String,
  location: String,
  timestamp: { type: Date, default: Date.now },
});

const OrderSchema = new mongoose.Schema(
  {
    orderNumber: { type: String, required: true, unique: true },
    customerName: { type: String, required: true },
    phone: { type: String, required: true },
    email: { type: String, required: true },
    address: { type: String, required: true },
    city: { type: String, required: true },
    state: { type: String, required: true },
    pincode: { type: String, required: true },
    items: [OrderItemSchema],
    subtotal: { type: Number, required: true },
    deliveryCharge: { type: Number, default: 0 },
    discount: { type: Number, default: 0 },
    couponCode: { type: String, default: "" },
    total: { type: Number, required: true },
    paymentMethod: { type: String, enum: ["COD", "Online"], default: "COD" },
    paymentStatus: {
      type: String,
      enum: ["pending", "paid", "failed", "refunded"],
      default: "pending",
    },
    orderStatus: {
      type: String,
      enum: [
        "pending",
        "confirmed",
        "processing",
        "shipped",
        "out_for_delivery",
        "delivered",
        "cancelled",
        "returned",
      ],
      default: "pending",
    },
    marketingOptIn: { type: Boolean, default: false },
    shiprocketOrderId: { type: String, default: "" },
    shiprocketShipmentId: { type: String, default: "" },
    awbCode: { type: String, default: "" },
    courierName: { type: String, default: "" },
    trackingUrl: { type: String, default: "" },
    deliveryStatus: {
      type: String,
      enum: [
        "ORDER_PLACED",
        "PICKED_UP",
        "SHIPPED",
        "IN_TRANSIT",
        "OUT_FOR_DELIVERY",
        "DELIVERED",
        "RTO",
        "CANCELLED",
        "",
      ],
      default: "",
    },
    shiprocketError: { type: String, default: "" },
    trackingEvents: [TrackingEventSchema],
    reviewRequestSent: { type: Boolean, default: false },
    statusEmailsSent: {
      shipped: { type: Boolean, default: false },
      outForDelivery: { type: Boolean, default: false },
      delivered: { type: Boolean, default: false },
    },
  },
  { timestamps: true }
);

export default mongoose.models.Order || mongoose.model("Order", OrderSchema);
