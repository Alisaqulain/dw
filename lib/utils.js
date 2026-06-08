import slugify from "slugify";

export function createSlug(text) {
  return slugify(text, { lower: true, strict: true });
}

export function formatPrice(amount) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(amount || 0);
}

export function generateOrderNumber() {
  const timestamp = Date.now().toString(36).toUpperCase();
  const random = Math.random().toString(36).substring(2, 6).toUpperCase();
  return `TS-${timestamp}${random}`;
}

import crypto from "crypto";

export function generateUnsubscribeToken(email) {
  const secret = process.env.JWT_SECRET || "trustsilcon-unsubscribe";
  return crypto
    .createHmac("sha256", secret)
    .update(email.toLowerCase().trim())
    .digest("hex")
    .substring(0, 32);
}

export function verifyUnsubscribeToken(email, token) {
  return generateUnsubscribeToken(email) === token;
}

export function calculateDiscount(subtotal, coupon) {
  if (!coupon) return 0;
  if (coupon.discountType === "percentage") {
    return Math.round((subtotal * coupon.discountValue) / 100);
  }
  return Math.min(coupon.discountValue, subtotal);
}

export function getDeliveryCharge(subtotal) {
  return subtotal >= 999 ? 0 : 79;
}

export function isLowStock(stock) {
  return stock > 0 && stock <= 5;
}

export function getSiteUrl() {
  return process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
}

export function validateEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

export function validatePhone(phone) {
  return /^[6-9]\d{9}$/.test(phone.replace(/\s/g, ""));
}

export function normalizePhoneDigits(phone) {
  const digits = String(phone || "").replace(/\D/g, "");
  return digits.length > 10 ? digits.slice(-10) : digits;
}

export function validatePincode(pincode) {
  return /^[1-9][0-9]{5}$/.test(pincode);
}
