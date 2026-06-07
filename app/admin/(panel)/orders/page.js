"use client";

import { useEffect, useState } from "react";
import { formatPrice } from "@/lib/utils";
import { StatusBadge, DeliveryTimeline } from "@/components/shiprocket/DeliveryTimeline";

const statuses = ["all", "pending", "confirmed", "processing", "shipped", "out_for_delivery", "delivered", "cancelled", "returned"];

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState([]);
  const [filter, setFilter] = useState("all");
  const [selected, setSelected] = useState(null);
  const [loading, setLoading] = useState(true);
  const [shipConfig, setShipConfig] = useState(null);
  const [shipmentLoading, setShipmentLoading] = useState(false);
  const [toast, setToast] = useState(null);

  const showToast = (message, type = "success") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 4000);
  };

  const fetchOrders = () => {
    setLoading(true);
    fetch(`/api/admin/orders?status=${filter}`)
      .then((r) => r.json())
      .then((d) => { setOrders(d.orders || []); setLoading(false); });
  };

  const refreshSelected = async (id) => {
    const res = await fetch(`/api/admin/orders?id=${id}`);
    const data = await res.json();
    if (data.order) setSelected(data.order);
  };

  useEffect(() => {
    fetchOrders();
    fetch("/api/shiprocket/create-order")
      .then((r) => r.json())
      .then(setShipConfig)
      .catch(() => setShipConfig({ configured: false, message: "Unable to check Shiprocket config" }));
  }, [filter]);

  const updateStatus = async (id, orderStatus) => {
    await fetch("/api/admin/orders", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, orderStatus }),
    });
    fetchOrders();
    refreshSelected(id);
  };

  const deleteOrder = async (id, orderNumber) => {
    if (!window.confirm(`Delete order ${orderNumber}? This cannot be undone.`)) return;

    const res = await fetch(`/api/admin/orders?id=${id}`, { method: "DELETE" });
    const data = await res.json();

    if (res.ok) {
      showToast("Order deleted");
      setSelected(null);
      fetchOrders();
    } else {
      showToast(data.error || "Failed to delete order", "error");
    }
  };

  const createShipment = async (orderId, retry = false) => {
    setShipmentLoading(true);
    try {
      const res = await fetch("/api/shiprocket/create-order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ orderId, retry }),
      });
      const data = await res.json();
      if (data.success) {
        showToast("Shipment created successfully!");
        setSelected(data.order);
        fetchOrders();
      } else {
        showToast(data.error || data.message || "Failed to create shipment", "error");
      }
    } catch {
      showToast("Network error creating shipment", "error");
    }
    setShipmentLoading(false);
  };

  return (
    <div>
      {toast && (
        <div className={`fixed bottom-6 right-6 z-50 rounded-xl px-5 py-3 text-sm font-medium text-white shadow-lg ${toast.type === "error" ? "bg-red-500" : "bg-emerald-500"}`}>
          {toast.message}
        </div>
      )}

      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <h1 className="text-2xl font-bold text-slate-800">Orders</h1>
        {shipConfig && !shipConfig.configured && (
          <div className="rounded-xl bg-amber-50 px-4 py-2.5 text-sm text-amber-800 ring-1 ring-amber-200">
            ⚠️ Shiprocket credentials not configured
          </div>
        )}
      </div>

      <div className="mt-4 flex flex-wrap gap-2">
        {statuses.map((s) => (
          <button key={s} onClick={() => setFilter(s)} className={`rounded-lg px-3 py-1.5 text-xs font-medium capitalize ${filter === s ? "bg-sky-500 text-white" : "bg-white text-slate-600 ring-1 ring-slate-200"}`}>
            {s.replace(/_/g, " ")}
          </button>
        ))}
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-3">
          {loading ? <p className="text-slate-500">Loading...</p> : orders.length === 0 ? (
            <p className="text-slate-500">No orders found</p>
          ) : orders.map((order) => (
            <div key={order._id} onClick={() => setSelected(order)} className={`cursor-pointer rounded-xl bg-white p-4 shadow-sm ring-1 transition ${selected?._id === order._id ? "ring-sky-400" : "ring-slate-200 hover:ring-sky-200"}`}>
              <div className="flex items-center justify-between gap-3">
                <div>
                  <p className="font-medium">{order.orderNumber}</p>
                  <p className="text-xs text-slate-500">{order.customerName} · {order.phone}</p>
                </div>
                <div className="text-right">
                  <p className="font-semibold">{formatPrice(order.total)}</p>
                  <div className="mt-1 flex flex-wrap justify-end gap-1">
                    <StatusBadge status={order.orderStatus} />
                    {order.deliveryStatus && <StatusBadge status={order.deliveryStatus} type="delivery" />}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {selected && (
          <div className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-200 h-fit sticky top-6 space-y-5">
            <div className="flex items-start justify-between">
              <h2 className="font-bold text-slate-800">Order Details</h2>
              <div className="flex flex-col items-end gap-1">
                <StatusBadge status={selected.orderStatus} />
                {selected.deliveryStatus && <StatusBadge status={selected.deliveryStatus} type="delivery" />}
              </div>
            </div>

            <div className="space-y-2 text-sm">
              <p><span className="text-slate-500">Order ID:</span> <strong>{selected.orderNumber}</strong></p>
              <p><span className="text-slate-500">Customer:</span> {selected.customerName}</p>
              <p><span className="text-slate-500">Phone:</span> {selected.phone}</p>
              <p><span className="text-slate-500">Email:</span> {selected.email}</p>
              <p><span className="text-slate-500">Address:</span> {selected.address}, {selected.city}, {selected.state} - {selected.pincode}</p>
              <p><span className="text-slate-500">Payment:</span> {selected.paymentMethod} · {formatPrice(selected.total)}</p>
            </div>

            {/* Shiprocket info */}
            <div className="rounded-xl bg-sky-50 p-4 ring-1 ring-sky-100">
              <p className="text-xs font-bold uppercase tracking-wider text-sky-600">Shiprocket Shipment</p>
              {selected.shiprocketOrderId ? (
                <div className="mt-3 space-y-1.5 text-sm">
                  <p><span className="text-slate-500">SR Order ID:</span> {selected.shiprocketOrderId}</p>
                  {selected.shiprocketShipmentId && <p><span className="text-slate-500">Shipment ID:</span> {selected.shiprocketShipmentId}</p>}
                  {selected.awbCode && <p><span className="text-slate-500">AWB:</span> <strong className="font-mono">{selected.awbCode}</strong></p>}
                  {selected.courierName && <p><span className="text-slate-500">Courier:</span> {selected.courierName}</p>}
                  {selected.trackingUrl && (
                    <a href={selected.trackingUrl} target="_blank" rel="noopener noreferrer" className="inline-block text-sky-600 hover:underline text-xs font-medium">
                      Open Tracking URL →
                    </a>
                  )}
                </div>
              ) : (
                <p className="mt-2 text-sm text-slate-500">No shipment created yet</p>
              )}
              {selected.shiprocketError && (
                <p className="mt-2 text-xs text-red-600">Last error: {selected.shiprocketError}</p>
              )}
            </div>

            {/* Shipment actions */}
            <div className="flex flex-col gap-2">
              {!shipConfig?.configured ? (
                <p className="text-xs text-amber-600">Configure SHIPROCKET_EMAIL and SHIPROCKET_PASSWORD in .env to enable shipments.</p>
              ) : !selected.shiprocketOrderId ? (
                <button onClick={() => createShipment(selected._id)} disabled={shipmentLoading} className="rounded-xl bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-indigo-700 disabled:opacity-50">
                  {shipmentLoading ? "Creating..." : "Create Shipment"}
                </button>
              ) : (
                <button onClick={() => createShipment(selected._id, true)} disabled={shipmentLoading} className="rounded-xl border border-indigo-200 bg-indigo-50 px-4 py-2.5 text-sm font-semibold text-indigo-700 hover:bg-indigo-100 disabled:opacity-50">
                  {shipmentLoading ? "Retrying..." : "Retry Create Shipment"}
                </button>
              )}
            </div>

            {/* Items */}
            <div>
              <p className="text-xs font-medium text-slate-500 mb-2">Items</p>
              {selected.items?.map((item, i) => (
                <p key={i} className="text-sm">{item.name} × {item.quantity} — {formatPrice(item.price * item.quantity)}</p>
              ))}
            </div>

            {/* Delivery timeline */}
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-3">Delivery Timeline</p>
              <DeliveryTimeline events={[...(selected.trackingEvents || [])].reverse()} currentStatus={selected.deliveryStatus} />
            </div>

            {/* Manual status override */}
            <div>
              <label className="text-xs font-medium text-slate-500">Update Order Status</label>
              <select value={selected.orderStatus} onChange={(e) => updateStatus(selected._id, e.target.value)} className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm">
                {statuses.filter((s) => s !== "all").map((s) => (
                  <option key={s} value={s}>{s.replace(/_/g, " ")}</option>
                ))}
              </select>
            </div>

            <button
              type="button"
              onClick={() => deleteOrder(selected._id, selected.orderNumber)}
              className="w-full rounded-xl border border-red-200 bg-red-50 px-4 py-2.5 text-sm font-semibold text-red-600 transition hover:bg-red-100"
            >
              Delete Order
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
