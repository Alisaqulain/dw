export const DELIVERY_STATUS_LABELS = {
  ORDER_PLACED: "Order Placed",
  PICKED_UP: "Picked Up",
  SHIPPED: "Shipped",
  IN_TRANSIT: "In Transit",
  OUT_FOR_DELIVERY: "Out for Delivery",
  DELIVERED: "Delivered",
  RTO: "Return to Origin",
  CANCELLED: "Cancelled",
};

export const DELIVERY_STATUS_STEPS = [
  "ORDER_PLACED",
  "PICKED_UP",
  "SHIPPED",
  "IN_TRANSIT",
  "OUT_FOR_DELIVERY",
  "DELIVERED",
];

/** Shiprocket numeric shipment_status codes */
export const SHIPROCKET_STATUS_CODES = {
  1: "ORDER_PLACED",
  2: "ORDER_PLACED",
  3: "PICKED_UP",
  4: "PICKED_UP",
  5: "PICKED_UP",
  6: "SHIPPED",
  7: "DELIVERED",
  8: "CANCELLED",
  9: "RTO",
  10: "RTO",
  11: "CANCELLED",
  12: "PICKED_UP",
  13: "RTO",
  14: "PICKED_UP",
  15: "CANCELLED",
  16: "OUT_FOR_DELIVERY",
  17: "IN_TRANSIT",
  18: "PICKED_UP",
  19: "OUT_FOR_DELIVERY",
  20: "IN_TRANSIT",
  21: "DELIVERED",
};

export const SHIPROCKET_STATUS_MESSAGES = {
  1: "AWB Assigned",
  2: "Label Generated",
  3: "Pickup Generated",
  4: "Pickup Queued",
  5: "Manifest Generated",
  6: "Shipped",
  7: "Delivered",
  8: "Cancelled",
  9: "RTO Initiated",
  10: "RTO Delivered",
  16: "Out for Delivery",
  17: "In Transit",
};
