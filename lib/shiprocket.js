import {
  DELIVERY_STATUS_LABELS,
  DELIVERY_STATUS_STEPS,
  SHIPROCKET_STATUS_CODES,
  SHIPROCKET_STATUS_MESSAGES,
} from "./shiprocket-constants";

const SHIPROCKET_BASE = "https://apiv2.shiprocket.in/v1/external";
const API_TIMEOUT_MS = 15000;
const FORBIDDEN_HINT =
  "Enable API modules in Shiprocket: Settings → API → your API user → Orders, Shipments, Courier, Settings.";

export { DELIVERY_STATUS_LABELS, DELIVERY_STATUS_STEPS };

let cachedToken = null;
let tokenExpiry = null;

async function fetchWithTimeout(url, options = {}, timeoutMs = API_TIMEOUT_MS) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);
  try {
    return await fetch(url, { ...options, signal: controller.signal });
  } catch (err) {
    if (err.name === "AbortError") {
      throw new Error(`Shiprocket API timeout after ${timeoutMs / 1000}s`);
    }
    throw err;
  } finally {
    clearTimeout(timer);
  }
}

export function isShiprocketConfigured() {
  return !!(process.env.SHIPROCKET_EMAIL && process.env.SHIPROCKET_PASSWORD);
}

export function getShiprocketConfigStatus() {
  return {
    configured: isShiprocketConfigured(),
    hasPickupLocation: !!process.env.SHIPROCKET_PICKUP_LOCATION,
    pickupLocation: process.env.SHIPROCKET_PICKUP_LOCATION || "",
    hasWebhookSecret: !!process.env.SHIPROCKET_WEBHOOK_SECRET,
    message: isShiprocketConfigured()
      ? "Shiprocket is configured"
      : "Add SHIPROCKET_EMAIL and SHIPROCKET_PASSWORD to .env",
  };
}

export function hasExistingShipment(order) {
  return !!(order?.shiprocketOrderId || order?.shipmentId || order?.shiprocketShipmentId);
}

export function canCreateShipment(order) {
  if (!order) return false;
  if (hasExistingShipment(order)) return false;
  if (order.paymentMethod === "Online" && order.paymentStatus !== "paid") return false;
  return order.orderStatus !== "cancelled";
}

export function extractShiprocketIds(data) {
  const payload = data?.payload || data?.data || data;
  const orderId = payload?.order_id ?? payload?.orderId ?? null;
  const shipmentId = payload?.shipment_id ?? payload?.shipmentId ?? null;
  return {
    shiprocketOrderId: orderId != null ? String(orderId) : "",
    shipmentId: shipmentId != null ? String(shipmentId) : "",
  };
}

export function hasValidShiprocketIds(data) {
  const { shiprocketOrderId, shipmentId } = extractShiprocketIds(data);
  return Boolean(shiprocketOrderId || shipmentId);
}

export async function getAuthToken() {
  if (!isShiprocketConfigured()) {
    throw new Error("Shiprocket credentials not configured");
  }
  if (cachedToken && tokenExpiry && Date.now() < tokenExpiry) {
    return cachedToken;
  }
  const res = await fetchWithTimeout(`${SHIPROCKET_BASE}/auth/login`, {
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
  const res = await fetchWithTimeout(`${SHIPROCKET_BASE}${path}`, {
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
    const raw = data.message || data.error || data.errors?.[0] || `Shiprocket API error (${res.status})`;
    const lower = String(raw).toLowerCase();
    if (res.status === 403 || lower.includes("forbidden") || lower.includes("access denied")) {
      throw new Error(`${raw}. ${FORBIDDEN_HINT}`);
    }
    throw new Error(raw);
  }
  return data;
}

export async function getPickupLocations() {
  const data = await shiprocketFetch("/settings/company/pickup", { method: "GET" });
  const list = data?.data?.shipping_address || data?.shipping_address || data?.data || [];
  return Array.isArray(list) ? list : [];
}

export async function resolvePickupLocation() {
  const configured = (process.env.SHIPROCKET_PICKUP_LOCATION || "Primary").trim();
  try {
    const locations = await getPickupLocations();
    if (!locations.length) return configured;
    const match = locations.find(
      (loc) =>
        (loc.pickup_location || "").toLowerCase() === configured.toLowerCase() ||
        (loc.nickname || "").toLowerCase() === configured.toLowerCase()
    );
    if (match) return match.pickup_location || match.nickname || configured;
    const names = locations.map((loc) => loc.pickup_location || loc.nickname).filter(Boolean);
    throw new Error(`Pickup location "${configured}" not found. Available: ${names.join(", ") || "none"}`);
  } catch (err) {
    if (err.message.includes("Pickup location")) throw err;
    return configured;
  }
}

export async function testShiprocketConnection() {
  if (!isShiprocketConfigured()) {
    return { ok: false, step: "config", error: "Credentials not configured" };
  }
  try {
    await getAuthToken();
  } catch (err) {
    return { ok: false, step: "auth", error: err.message };
  }
  let pickupLocations = [];
  try {
    pickupLocations = await getPickupLocations();
  } catch (err) {
    return { ok: false, step: "permissions", error: err.message, hint: FORBIDDEN_HINT };
  }
  const names = pickupLocations.map((loc) => loc.pickup_location || loc.nickname).filter(Boolean);
  try {
    const resolved = await resolvePickupLocation();
    return { ok: true, pickupLocation: resolved, availablePickupLocations: names };
  } catch (err) {
    return { ok: false, step: "pickup", error: err.message, availablePickupLocations: names };
  }
}

export function mapShiprocketStatusCode(code) {
  return SHIPROCKET_STATUS_CODES[Number(code)] || "";
}

export function normalizeDeliveryStatus(rawStatus) {
  const s = (rawStatus || "").toUpperCase().replace(/\s+/g, "_");
  if (s.includes("DELIVERED")) return "DELIVERED";
  if (s.includes("OUT_FOR_DELIVERY") || s.includes("OFD")) return "OUT_FOR_DELIVERY";
  if (s.includes("IN_TRANSIT") || s.includes("INTRANSIT")) return "IN_TRANSIT";
  if (s.includes("SHIPPED") || s.includes("DISPATCHED")) return "SHIPPED";
  if (s.includes("PICKED_UP") || s.includes("PICKED UP")) return "PICKED_UP";
  if (s.includes("PICKUP") || s.includes("MANIFEST")) return "PICKED_UP";
  if (s.includes("LABEL") || s.includes("AWB")) return "ORDER_PLACED";
  if (s.includes("RTO") || s.includes("RETURN")) return "RTO";
  if (s.includes("CANCEL")) return "CANCELLED";
  if (s.includes("PROCESS")) return "ORDER_PLACED";
  if (s.includes("ORDER") || s.includes("NEW") || s.includes("CONFIRM")) return "ORDER_PLACED";
  const fromCode = mapShiprocketStatusCode(rawStatus);
  return fromCode || "";
}

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
  return map[deliveryStatus] || undefined;
}

export function mapShiprocketStatusToOrderStatus(shiprocketStatus) {
  const ds = normalizeDeliveryStatus(shiprocketStatus);
  return ds ? mapDeliveryStatusToOrderStatus(ds) : undefined;
}

async function buildCreateOrderPayload(order, pickupLocation) {
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
    billing_phone: String(order.phone).replace(/\s/g, ""),
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

export async function createShiprocketOrder(order) {
  const pickupLocation = await resolvePickupLocation();
  const payload = await buildCreateOrderPayload(order, pickupLocation);
  return shiprocketFetch("/orders/create/adhoc", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export async function assignAWB(shipmentId) {
  return shiprocketFetch("/courier/assign/awb", {
    method: "POST",
    body: JSON.stringify({ shipment_id: [Number(shipmentId) || shipmentId] }),
  });
}

export async function trackShipmentByAWB(awbCode) {
  return shiprocketFetch(`/courier/track/awb/${awbCode}`, { method: "GET" });
}

export async function trackShipmentByOrderId(shiprocketOrderId) {
  return shiprocketFetch(`/courier/track/shipment/${shiprocketOrderId}`, { method: "GET" });
}

export function extractAWBData(awbResult) {
  const data = awbResult?.response?.data || awbResult?.data || awbResult;
  if (Array.isArray(data)) return data[0] || {};
  return data || {};
}

export function getTrackingDataRoot(trackingData) {
  return trackingData?.tracking_data || trackingData?.data?.tracking_data || trackingData || {};
}

export function parseTrackingTimeline(trackingData) {
  const td = getTrackingDataRoot(trackingData);
  const activities = td.shipment_track_activities;
  const track = Array.isArray(td.shipment_track) ? td.shipment_track[0] : null;

  if (Array.isArray(activities) && activities.length > 0) {
    return activities.map((a) => ({
      status: normalizeDeliveryStatus(a["sr-status"] || a.status || a.activity) || "IN_TRANSIT",
      description: a.activity || a["sr-status-label"] || a.status || "",
      location: a.location || "",
      timestamp: a.date ? new Date(a.date) : new Date(),
      source: "shiprocket_api",
    }));
  }

  if (track?.current_status) {
    const status = normalizeDeliveryStatus(track.current_status) || mapShiprocketStatusCode(td.shipment_status);
    return [{
      status: status || "ORDER_PLACED",
      description: track.current_status,
      location: track.destination || track.origin || "",
      timestamp: track.updated_time_stamp ? new Date(track.updated_time_stamp) : new Date(),
      source: "shiprocket_api",
    }];
  }

  if (td.shipment_status != null && td.shipment_status !== "") {
    const status = mapShiprocketStatusCode(td.shipment_status);
    const message = SHIPROCKET_STATUS_MESSAGES[Number(td.shipment_status)] || `Status code ${td.shipment_status}`;
    if (status) {
      return [{ status, description: message, location: "", timestamp: new Date(), source: "shiprocket_api" }];
    }
  }

  return [];
}

export function resolveTrackingFromApi(trackingData) {
  const td = getTrackingDataRoot(trackingData);
  const track = Array.isArray(td.shipment_track) ? td.shipment_track[0] : null;
  let status = "";
  let statusMessage = "";

  if (track?.current_status) {
    statusMessage = track.current_status;
    status = normalizeDeliveryStatus(track.current_status);
  }
  if (!status && td.shipment_status != null && td.shipment_status !== "") {
    status = mapShiprocketStatusCode(td.shipment_status);
    statusMessage = statusMessage || SHIPROCKET_STATUS_MESSAGES[Number(td.shipment_status)] || `Shipment status ${td.shipment_status}`;
  }

  const timeline = parseTrackingTimeline(trackingData);
  const awbCode = track?.awb_code || "";
  const courierName = track?.courier_name || "";
  const trackUrl = td.track_url || (awbCode ? `https://shiprocket.co/tracking/${awbCode}` : "");

  return { status, statusMessage, timeline, awbCode, courierName, trackUrl, edd: track?.edd || td.etd || "" };
}

function eventKey(e) {
  const ts = e.timestamp ? new Date(e.timestamp).toISOString().slice(0, 16) : "";
  return `${e.status}|${e.description}|${e.location}|${ts}`;
}

export function mergeTrackingEvents(existing = [], incoming = []) {
  const map = new Map();
  for (const e of [...existing, ...incoming]) {
    if (!e?.status && !e?.description) continue;
    map.set(eventKey(e), {
      status: e.status || "",
      description: e.description || "",
      location: e.location || "",
      timestamp: e.timestamp ? new Date(e.timestamp) : new Date(),
      source: e.source || "",
    });
  }
  return Array.from(map.values()).sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
}

export function buildOrderUpdateFromShiprocket(srResponse, awbResult = null) {
  if (!hasValidShiprocketIds(srResponse)) {
    throw new Error("Shiprocket did not return a valid order_id or shipment_id");
  }

  const { shiprocketOrderId, shipmentId } = extractShiprocketIds(srResponse);
  const awbData = awbResult ? extractAWBData(awbResult) : {};
  const awbCode = String(awbData.awb_code || awbData.awbCode || srResponse.awb_code || "");
  const courierName = awbData.courier_name || awbData.courierName || "";
  const event = {
    status: "ORDER_PLACED",
    description: "Shipment created on Shiprocket",
    location: "",
    timestamp: new Date(),
    source: "shiprocket_create",
  };

  const updates = {
    shiprocketOrderId,
    shiprocketShipmentId: shipmentId,
    shipmentId,
    deliveryStatus: "ORDER_PLACED",
    currentStatus: "ORDER_PLACED",
    orderStatus: "confirmed",
    shiprocketError: "",
    shiprocketCreateResponse: srResponse,
    shiprocketAwbResponse: awbResult || null,
    lastTrackingSync: new Date(),
    trackingEvents: [event],
    trackingHistory: [event],
  };

  if (awbCode) {
    updates.awbCode = awbCode;
    updates.courierName = courierName;
    updates.trackingUrl = `https://shiprocket.co/tracking/${awbCode}`;
  }

  return updates;
}

export async function createShipmentForOrder(order) {
  if (!isShiprocketConfigured()) {
    return { success: false, error: "Shiprocket credentials not configured", configured: false };
  }
  if (hasExistingShipment(order)) {
    return { success: false, error: "Shipment already exists for this order", configured: true };
  }
  if (!canCreateShipment(order)) {
    return {
      success: false,
      error: order.paymentMethod === "Online" && order.paymentStatus !== "paid"
        ? "Online payment not completed — cannot create shipment"
        : "Order cannot be shipped",
      configured: true,
    };
  }

  try {
    const srResponse = await createShiprocketOrder(order);
    if (!hasValidShiprocketIds(srResponse)) {
      return { success: false, configured: true, error: "Shiprocket returned no order_id or shipment_id", shiprocket: srResponse };
    }

    let awbResult = null;
    const { shipmentId } = extractShiprocketIds(srResponse);
    if (shipmentId) {
      try {
        awbResult = await assignAWB(shipmentId);
      } catch (awbErr) {
        console.error("[Shiprocket] AWB assignment failed:", awbErr.message);
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

export async function fetchLiveTracking(order) {
  if (order.awbCode) return trackShipmentByAWB(order.awbCode);
  if (order.shiprocketOrderId) return trackShipmentByOrderId(order.shiprocketOrderId);
  if (order.shipmentId || order.shiprocketShipmentId) {
    return trackShipmentByOrderId(order.shipmentId || order.shiprocketShipmentId);
  }
  throw new Error("No AWB or Shiprocket order ID to track");
}

function trimTrackResponse(trackingData) {
  const td = getTrackingDataRoot(trackingData);
  const track = Array.isArray(td.shipment_track) ? td.shipment_track[0] : null;
  return {
    shipment_status: td.shipment_status,
    track_url: td.track_url,
    etd: td.etd,
    current_status: track?.current_status,
    awb_code: track?.awb_code,
    courier_name: track?.courier_name,
    syncedAt: new Date().toISOString(),
  };
}

export function buildSyncUpdate(order, trackingData) {
  const resolved = resolveTrackingFromApi(trackingData);
  const timeline = resolved.timeline.length ? resolved.timeline : parseTrackingTimeline(trackingData);
  const deliveryStatus = resolved.status || timeline[0]?.status || order.deliveryStatus;
  const mergedHistory = mergeTrackingEvents(order.trackingHistory || order.trackingEvents || [], timeline);

  const updates = {
    lastTrackingSync: new Date(),
    trackingHistory: mergedHistory,
    trackingEvents: mergedHistory,
    shiprocketError: "",
    shiprocketLastTrackResponse: trimTrackResponse(trackingData),
  };

  if (deliveryStatus) {
    updates.deliveryStatus = deliveryStatus;
    updates.currentStatus = deliveryStatus;
    const mappedOrderStatus = mapDeliveryStatusToOrderStatus(deliveryStatus);
    if (mappedOrderStatus) updates.orderStatus = mappedOrderStatus;
  }

  const awbCode = resolved.awbCode || order.awbCode;
  if (awbCode) {
    updates.awbCode = String(awbCode);
    updates.trackingUrl = resolved.trackUrl || `https://shiprocket.co/tracking/${awbCode}`;
  }
  if (resolved.courierName) updates.courierName = resolved.courierName;

  return { updates, timeline: mergedHistory, resolved };
}

export async function syncOrderTracking(order) {
  if (!isShiprocketConfigured()) return { success: false, error: "Shiprocket not configured" };
  if (!hasExistingShipment(order) && !order.awbCode) {
    return { success: false, error: "No Shiprocket shipment linked to this order" };
  }

  try {
    const trackingData = await fetchLiveTracking(order);
    const { updates, timeline, resolved } = buildSyncUpdate(order, trackingData);
    if (!updates.deliveryStatus && !timeline.length) {
      return { success: false, error: "Shiprocket returned no tracking data yet" };
    }
    return { success: true, updates, timeline, resolved, trackingData };
  } catch (error) {
    return { success: false, error: error.message };
  }
}

export function buildWebhookUpdate(order, payload) {
  const awbCode = payload.awb || payload.awb_code || payload.awbCode;
  const rawStatus =
    payload.current_status || payload.status || payload.shipment_status || payload.scans?.[0]?.status || "";
  const courierName = payload.courier_name || payload.courier || "";
  const location = payload.location || payload.scans?.[0]?.location || "";
  const deliveryStatus = normalizeDeliveryStatus(String(rawStatus));

  const event = {
    status: deliveryStatus || order.deliveryStatus || "ORDER_PLACED",
    description: DELIVERY_STATUS_LABELS[deliveryStatus] || String(rawStatus) || "Status update",
    location,
    timestamp: new Date(),
    source: "webhook",
  };

  const mergedHistory = mergeTrackingEvents(order.trackingHistory || order.trackingEvents || [], [event]);
  const updates = {
    shiprocketError: "",
    lastTrackingSync: new Date(),
    trackingHistory: mergedHistory,
    trackingEvents: mergedHistory,
  };

  if (deliveryStatus) {
    updates.deliveryStatus = deliveryStatus;
    updates.currentStatus = deliveryStatus;
    const mapped = mapDeliveryStatusToOrderStatus(deliveryStatus);
    if (mapped) updates.orderStatus = mapped;
  }
  if (awbCode) {
    updates.awbCode = String(awbCode);
    updates.trackingUrl = `https://shiprocket.co/tracking/${awbCode}`;
  }
  if (courierName) updates.courierName = courierName;

  return updates;
}

export function verifyWebhookSecret(request) {
  const secret = process.env.SHIPROCKET_WEBHOOK_SECRET;
  if (!secret) return true;
  const headerSecret =
    request.headers.get("x-shiprocket-secret") ||
    request.headers.get("x-webhook-secret") ||
    request.headers.get("authorization")?.replace("Bearer ", "");
  return headerSecret === secret;
}
