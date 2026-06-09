import { getCookieConsent } from "@/lib/consent";

export const META_PIXEL_ID =
  process.env.NEXT_PUBLIC_META_PIXEL_ID || "26146042491738408";

export function canUseMetaPixel() {
  if (typeof window === "undefined" || !META_PIXEL_ID) return false;
  const consent = getCookieConsent();
  if (!consent) return false;
  return consent.marketing === true || consent.analytics === true;
}

export function trackMetaEvent(eventName, params = {}) {
  if (!canUseMetaPixel() || typeof window === "undefined" || !window.fbq) return;
  window.fbq("track", eventName, params);
}

export function trackMetaPageView() {
  trackMetaEvent("PageView");
}

export function trackViewContent(product) {
  if (!product) return;
  trackMetaEvent("ViewContent", {
    content_ids: [String(product._id || product.productId || product.slug)],
    content_name: product.name,
    content_type: "product",
    value: Number(product.price) || 0,
    currency: "INR",
  });
}

export function trackAddToCart(product, quantity = 1) {
  if (!product) return;
  const qty = Number(quantity) || 1;
  const price = Number(product.price) || 0;
  trackMetaEvent("AddToCart", {
    content_ids: [String(product._id || product.productId || product.slug)],
    content_name: product.name,
    content_type: "product",
    value: price * qty,
    currency: "INR",
    contents: [
      {
        id: String(product._id || product.productId || product.slug),
        quantity: qty,
        item_price: price,
      },
    ],
  });
}

export function trackInitiateCheckout({ cart, cartTotal, cartCount }) {
  if (!cart?.length) return;
  trackMetaEvent("InitiateCheckout", {
    value: Number(cartTotal) || 0,
    currency: "INR",
    num_items: Number(cartCount) || cart.reduce((sum, item) => sum + item.quantity, 0),
    contents: cart.map((item) => ({
      id: String(item.productId),
      quantity: item.quantity,
      item_price: Number(item.price) || 0,
    })),
  });
}

export function trackPurchase(order) {
  if (!order) return;
  const items = order.items || [];
  trackMetaEvent("Purchase", {
    value: Number(order.total) || 0,
    currency: "INR",
    content_ids: items.map((item) => String(item.productId)),
    content_type: "product",
    num_items: items.reduce((sum, item) => sum + (item.quantity || 0), 0),
    order_id: order.orderNumber,
    contents: items.map((item) => ({
      id: String(item.productId),
      quantity: item.quantity,
      item_price: Number(item.price) || 0,
    })),
  });
}
