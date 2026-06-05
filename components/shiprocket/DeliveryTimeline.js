"use client";

import {
  DELIVERY_STATUS_LABELS,
  DELIVERY_STATUS_STEPS,
} from "@/lib/shiprocket-constants";

export const ORDER_STATUS_COLORS = {
  pending: "bg-yellow-100 text-yellow-800 ring-yellow-200",
  confirmed: "bg-blue-100 text-blue-800 ring-blue-200",
  processing: "bg-indigo-100 text-indigo-800 ring-indigo-200",
  shipped: "bg-purple-100 text-purple-800 ring-purple-200",
  out_for_delivery: "bg-orange-100 text-orange-800 ring-orange-200",
  delivered: "bg-emerald-100 text-emerald-800 ring-emerald-200",
  cancelled: "bg-red-100 text-red-800 ring-red-200",
  returned: "bg-slate-100 text-slate-800 ring-slate-200",
};

export const DELIVERY_STATUS_COLORS = {
  ORDER_PLACED: "bg-sky-100 text-sky-800 ring-sky-200",
  PICKED_UP: "bg-indigo-100 text-indigo-800 ring-indigo-200",
  SHIPPED: "bg-purple-100 text-purple-800 ring-purple-200",
  IN_TRANSIT: "bg-violet-100 text-violet-800 ring-violet-200",
  OUT_FOR_DELIVERY: "bg-orange-100 text-orange-800 ring-orange-200",
  DELIVERED: "bg-emerald-100 text-emerald-800 ring-emerald-200",
  RTO: "bg-amber-100 text-amber-800 ring-amber-200",
  CANCELLED: "bg-red-100 text-red-800 ring-red-200",
};

export function StatusBadge({ status, type = "order" }) {
  const colors = type === "delivery" ? DELIVERY_STATUS_COLORS : ORDER_STATUS_COLORS;
  const label =
    type === "delivery"
      ? DELIVERY_STATUS_LABELS[status] || status?.replace(/_/g, " ")
      : status?.replace(/_/g, " ");

  return (
    <span className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold capitalize ring-1 ${colors[status] || "bg-slate-100 text-slate-700 ring-slate-200"}`}>
      {label}
    </span>
  );
}

export function DeliveryTimeline({ events = [], currentStatus = "" }) {
  const stepIndex = DELIVERY_STATUS_STEPS.indexOf(currentStatus);

  return (
    <div className="space-y-6">
      {/* Progress steps */}
      <div className="hidden sm:flex items-center justify-between">
        {DELIVERY_STATUS_STEPS.map((step, i) => {
          const done = stepIndex >= i || currentStatus === "DELIVERED";
          const active = currentStatus === step;
          return (
            <div key={step} className="flex flex-1 flex-col items-center">
              <div className={`flex h-8 w-8 items-center justify-center rounded-full text-xs font-bold ${done ? "bg-sky-500 text-white" : active ? "bg-sky-100 text-sky-600 ring-2 ring-sky-400" : "bg-slate-100 text-slate-400"}`}>
                {done ? "✓" : i + 1}
              </div>
              <p className={`mt-2 text-center text-[10px] font-medium leading-tight ${done || active ? "text-sky-600" : "text-slate-400"}`}>
                {DELIVERY_STATUS_LABELS[step]}
              </p>
            </div>
          );
        })}
      </div>

      {/* Event log */}
      {events.length > 0 ? (
        <div className="space-y-0">
          {events.map((event, i) => (
            <div key={i} className="flex gap-4">
              <div className="flex flex-col items-center">
                <div className={`h-3 w-3 rounded-full ${i === 0 ? "bg-sky-500" : "bg-sky-300"}`} />
                {i < events.length - 1 && <div className="w-0.5 flex-1 min-h-[40px] bg-sky-100" />}
              </div>
              <div className="pb-5 flex-1">
                <p className="text-sm font-semibold text-slate-800">
                  {DELIVERY_STATUS_LABELS[event.status] || event.status?.replace(/_/g, " ") || event.description}
                </p>
                {event.description && event.description !== event.status && (
                  <p className="text-xs text-slate-500 mt-0.5">{event.description}</p>
                )}
                {event.location && <p className="text-xs text-slate-400 mt-0.5">📍 {event.location}</p>}
                {event.timestamp && (
                  <p className="text-xs text-slate-400 mt-1">{new Date(event.timestamp).toLocaleString("en-IN")}</p>
                )}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-sm text-slate-500 text-center py-4">Tracking updates will appear once your order is shipped.</p>
      )}
    </div>
  );
}
