const SHIPROCKET_BASE = "https://apiv2.shiprocket.in/v1/external";

let cachedToken = null;
let tokenExpiry = null;

/** Check if Shiprocket env credentials are configured */
export function isShiprocketConfigured() {
  return !!(process.env.SHIPROCKET_EMAIL && process.env.SHIPROCKET_PASSWORD);
}

export function getShiprocketConfigStatus() {
  return {
    configured: isShiprocketConfigured(),
    hasPickupLocation: !!process.env.SHIPROCKET_PICKUP_LOCATION,
    hasWebhookSecret: !!process.env.SHIPROCKET_WEBHOOK_SECRET,
    message: isShiprocketConfigured()
      ? "Shiprocket is configured"
      : "Shiprocket credentials not configured. Add SHIPROCKET_EMAIL and SHIPROCKET_PASSWORD to .env",
  };
}

/** Login and cache JWT token (~9 days) */
export async function getAuthToken() {
  if (!isShiprocketConfigured()) {
    throw new Error("Shiprocket credentials not configured");
  }

  if (cachedToken && tokenExpiry && Date.now() < tokenExpiry) {
    return cachedToken;
  }

  const res = await fetch(`${SHIPROCKET_BASE}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      email: process.env.SHIPROCKET_EMAIL,
      password: process.env.SHIPROCKET_PASSWORD,
    }),
  });

  const data = await res.json();
  if (!res.ok || !data.token) {
    cachedToken = null;
    tokenExpiry = null;
    throw new Error(data.message || data.error || "Shiprocket authentication failed");
  }

  cachedToken = data.token;
  tokenExpiry = Date.now() + 9 * 24 * 60 * 60 * 1000;
  return cachedToken;
}

async function shiprocketFetch(path, options = {}) {
  const token = await getAuthToken();
  const res = await fetch(`${SHIPROCKET_BASE}${path}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
      ...options.headers,
    },
  });

  let data;
  try {
    data = await res.json();
  } catch {
    data = { message: "Invalid response from Shiprocket" };
  }

  if (!res.ok) {
    const msg = data.message || data.error || data.errors?.[0] || `Shiprocket API error (${res.status})`;
    throw new Error(msg);
  }

  return data;
}

/** Normalize Shiprocket status string to deliveryStatus enum */
export function normalizeDeliveryStatus(rawStatus) {
  const s = (rawStatus || "").toUpperCase().replace(/\s+/g, "_");

  if (s.includes("DELIVERED")) return "DELIVERED";
  if (s.includes("OUT_FOR_DELIVERY") || s.includes("OFD")) return "OUT_FOR_DELIVERY";
  if (s.includes("IN_TRANSIT") || s.includes("INTRANSIT")) return "IN_TRANSIT";
  if (s.includes("SHIPPED") || s.includes("DISPATCHED")) return "SHIPPED";
  if (s.includes("PICKED") || s.includes("PICKUP")) return "PICKED_UP";
  if (s.includes("RTO") || s.includes("RETURN")) return "RTO";
  if (s.includes("CANCEL")) return "CANCELLED";
  if (s.includes("ORDER") || s.includes("NEW") || s.includes("CONFIRM")) return "ORDER_PLACED";

  return "ORDER_PLACED";
}

/** Map deliveryStatus to internal orderStatus */
export function mapDeliveryStatusToOrderStatus(deliveryStatus) {
  const map = {
    ORDER_PLACED: "confirmed",
    PICKED_UP: "processing",
    SHIPPED: "shipped",
    IN_TRANSIT: "shipped",
    OUT_FOR_DELIVERY: "out_for_delivery",
    DELIVERED: "delivered",
    RTO: "returned",
    CANCELLED: "cancelled",
  };
  return map[deliveryStatus] || "processing";
}

/** Legacy mapper for webhook free-text statuses */
export function mapShiprocketStatusToOrderStatus(shiprocketStatus) {
  return mapDeliveryStatusToOrderStatus(normalizeDeliveryStatus(shiprocketStatus));
}

/** Build create-order payload from MongoDB order */
function buildCreateOrderPayload(order) {
  const pickupLocation = process.env.SHIPROCKET_PICKUP_LOCATION || "Primary";
  const nameParts = (order.customerName || "Customer").trim().split(" ");

  return {
    order_id: order.orderNumber,
    order_date: new Date(order.createdAt || Date.now()).toISOString().split("T")[0],
    pickup_location: pickupLocation,
    billing_customer_name: nameParts[0] || "Customer",
    billing_last_name: nameParts.slice(1).join(" ") || ".",
    billing_address: order.address,
    billing_city: order.city,
    billing_pincode: String(order.pincode),
    billing_state: order.state,
    billing_country: "India",
    billing_email: order.email,
    billing_phone: String(order.phone),
    shipping_is_billing: true,
    order_items: (order.items || []).map((item) => ({
      name: item.name,
      sku: item.productId?.toString() || item.slug || item.name,
      units: item.quantity,
      selling_price: item.price,
      discount: 0,
      tax: 0,
      hsn: 0,
    })),
    payment_method: order.paymentMethod === "COD" ? "COD" : "Prepaid",
    sub_total: order.subtotal,
    length: 15,
    breadth: 10,
    height: 5,
    weight: 0.3,
  };
}

/** Create order on Shiprocket */
export async function createShiprocketOrder(order) {
  return shiprocketFetch("/orders/create/adhoc", {
    method: "POST",
    body: JSON.stringify(buildCreateOrderPayload(order)),
  });
}

/** Assign AWB to shipment */
export async function assignAWB(shipmentId) {
  return shiprocketFetch("/courier/assign/awb", {
    method: "POST",
    body: JSON.stringify({ shipment_id: [Number(shipmentId) || shipmentId] }),
  });
}

/** Track by AWB code */
export async function trackShipmentByAWB(awbCode) {
  return shiprocketFetch(`/courier/track/awb/${awbCode}`, { method: "GET" });
}

/** Track by Shiprocket order ID */
export async function trackShipmentByOrderId(shiprocketOrderId) {
  return shiprocketFetch(`/courier/track/shipment/${shiprocketOrderId}`, { method: "GET" });
}

/** Cancel Shiprocket order by Shiprocket order ID */
export async function cancelShipment(shiprocketOrderId) {
  return shiprocketFetch("/orders/cancel", {
    method: "POST",
    body: JSON.stringify({ ids: [Number(shiprocketOrderId) || shiprocketOrderId] }),
  });
}

/** Generate pickup request */
export async function generatePickup(shipmentId) {
  return shiprocketFetch("/courier/generate/pickup", {
    method: "POST",
    body: JSON.stringify({ shipment_id: [Number(shipmentId) || shipmentId] }),
  });
}

/** Extract AWB data from assign response */
export function extractAWBData(awbResult) {
  const data = awbResult?.response?.data || awbResult?.data || awbResult;
  if (Array.isArray(data)) return data[0] || {};
  return data || {};
}

/** Build MongoDB update object from Shiprocket create + optional AWB response */
export function buildOrderUpdateFromShiprocket(srResponse, awbResult = null) {
  const awbData = awbResult ? extractAWBData(awbResult) : {};
  const shipmentId = String(srResponse.shipment_id || srResponse.shipmentId || "");
  const shiprocketOrderId = String(srResponse.order_id || srResponse.orderId || shipmentId || "");
  const awbCode = String(awbData.awb_code || awbData.awbCode || srResponse.awb_code || "");
  const courierName = awbData.courier_name || awbData.courierName || "";

  const updates = {
    shiprocketOrderId,
    shiprocketShipmentId: shipmentId,
    deliveryStatus: "ORDER_PLACED",
    orderStatus: "confirmed",
    shiprocketError: "",
    $push: {
      trackingEvents: {
        status: "ORDER_PLACED",
        description: "Shipment created on Shiprocket",
        location: "",
        timestamp: new Date(),
      },
    },
  };

  if (awbCode) {
    updates.awbCode = awbCode;
    updates.courierName = courierName;
    updates.trackingUrl = `https://shiprocket.co/tracking/${awbCode}`;
  }

  return updates;
}

/** Full flow: create order + assign AWB */
export async function createShipmentForOrder(order) {
  if (!isShiprocketConfigured()) {
    return { success: false, error: "Shiprocket credentials not configured", configured: false };
  }

  try {
    const srResponse = await createShiprocketOrder(order);
    let awbResult = null;

    const shipmentId = srResponse.shipment_id || srResponse.shipmentId;
    if (shipmentId) {
      try {
        awbResult = await assignAWB(shipmentId);
      } catch (awbErr) {
        console.error("AWB assignment failed (order still created):", awbErr.message);
      }
    }

    return {
      success: true,
      configured: true,
      shiprocket: srResponse,
      awb: awbResult,
      updates: buildOrderUpdateFromShiprocket(srResponse, awbResult),
    };
  } catch (error) {
    return { success: false, configured: true, error: error.message };
  }
}

/** Parse tracking API response into timeline events */
export function parseTrackingTimeline(trackingData) {
  const activities =
    trackingData?.tracking_data?.shipment_track_activities ||
    trackingData?.shipment_track_activities ||
    trackingData?.data?.tracking_data?.shipment_track_activities ||
    [];

  if (Array.isArray(activities) && activities.length > 0) {
    return activities.map((a) => ({
      status: normalizeDeliveryStatus(a["sr-status"] || a.status || a.activity),
      description: a.activity || a["sr-status-label"] || a.status || "",
      location: a.location || "",
      timestamp: a.date ? new Date(a.date) : new Date(),
    }));
  }

  const currentStatus =
    trackingData?.tracking_data?.shipment_status ||
    trackingData?.current_status ||
    trackingData?.status ||
    "";

  if (currentStatus) {
    return [{
      status: normalizeDeliveryStatus(currentStatus),
      description: currentStatus,
      location: "",
      timestamp: new Date(),
    }];
  }

  return [];
}

export { DELIVERY_STATUS_LABELS, DELIVERY_STATUS_STEPS } from "./shiprocket-constants";
