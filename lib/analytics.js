/**
 * TrustSilcon analytics utility — GA4 e-commerce + server-side funnel events.
 * Requires NEXT_PUBLIC_GA_ID (e.g. G-7E63SQ3RPY) for Google Analytics.
 */

export const GA_MEASUREMENT_ID = process.env.NEXT_PUBLIC_GA_ID || "";

const SESSION_KEY = "ts_session";

const GA_EVENT_MAP = {
  page_view: "page_view",
  product_view: "view_item",
  add_to_cart: "add_to_cart",
  initiate_checkout: "begin_checkout",
  purchase: "purchase",
};

export function getSessionId() {
  if (typeof window === "undefined") return "";
  let id = sessionStorage.getItem(SESSION_KEY);
  if (!id) {
    id = `ts_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`;
    sessionStorage.setItem(SESSION_KEY, id);
  }
  return id;
}

function buildItem(product, quantity = 1) {
  return {
    item_id: String(product._id || product.productId || product.slug),
    item_name: product.name,
    price: Number(product.price) || 0,
    quantity: Number(quantity) || 1,
  };
}

export function trackGA4(eventType, params = {}) {
  if (typeof window === "undefined" || !window.gtag || !GA_MEASUREMENT_ID) return;
  const gaEvent = GA_EVENT_MAP[eventType] || eventType;
  window.gtag("event", gaEvent, params);
}

export function trackServerEvent(eventType, data = {}) {
  if (typeof window === "undefined") return;
  fetch("/api/analytics", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      eventType,
      sessionId: getSessionId(),
      page: window.location.pathname,
      ...data,
    }),
    keepalive: true,
  }).catch(() => {});
}

/** Fires on every route change (homepage, cart, checkout, etc.) */
export function trackPageView() {
  const pagePath = typeof window !== "undefined" ? window.location.pathname : "";
  trackServerEvent("page_view");
  trackGA4("page_view", {
    page_path: pagePath,
    page_location: typeof window !== "undefined" ? window.location.href : "",
    page_title: typeof document !== "undefined" ? document.title : "",
  });
}

/** Product page — GA4 view_item */
export function trackProductView(product) {
  if (!product) return;
  const price = Number(product.price) || 0;
  trackServerEvent("product_view", {
    productId: product._id,
    productSlug: product.slug,
    productName: product.name,
    cartValue: price,
  });
  trackGA4("view_item", {
    currency: "INR",
    value: price,
    items: [buildItem(product, 1)],
  });
}

/** Add to Cart button — GA4 add_to_cart */
export function trackAddToCartEvent(product, quantity = 1) {
  if (!product) return;
  const qty = Number(quantity) || 1;
  const price = Number(product.price) || 0;
  trackServerEvent("add_to_cart", {
    productId: product._id,
    productSlug: product.slug,
    productName: product.name,
    cartValue: price * qty,
  });
  trackGA4("add_to_cart", {
    currency: "INR",
    value: price * qty,
    items: [buildItem(product, qty)],
  });
}

/** Checkout page load — GA4 begin_checkout */
export function trackInitiateCheckoutEvent({ cart, cartTotal }) {
  if (!cart?.length) return;
  const value = Number(cartTotal) || 0;
  trackServerEvent("initiate_checkout", { cartValue: value });
  trackGA4("begin_checkout", {
    currency: "INR",
    value,
    items: cart.map((item) => ({
      item_id: String(item.productId),
      item_name: item.name,
      quantity: item.quantity,
      price: Number(item.price) || 0,
    })),
  });
}

/** Order success page — GA4 purchase */
export function trackPurchaseEvent(order) {
  if (!order) return;
  const value = Number(order.total) || 0;
  trackServerEvent("purchase", {
    orderNumber: order.orderNumber,
    cartValue: value,
  });
  trackGA4("purchase", {
    transaction_id: order.orderNumber,
    currency: "INR",
    value,
    items: (order.items || []).map((item) => ({
      item_id: String(item.productId),
      item_name: item.name,
      quantity: item.quantity,
      price: Number(item.price) || 0,
    })),
  });
}

export async function syncCartSession(cart, cartTotal, contact = {}) {
  if (typeof window === "undefined" || !cart?.length) return;
  fetch("/api/cart/session", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      sessionId: getSessionId(),
      items: cart,
      cartValue: cartTotal,
      ...contact,
    }),
    keepalive: true,
  }).catch(() => {});
}
