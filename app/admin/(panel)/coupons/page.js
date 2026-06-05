"use client";

import { useEffect, useState } from "react";

export default function AdminCouponsPage() {
  const [coupons, setCoupons] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ code: "", discountType: "percentage", discountValue: "", minOrderAmount: 0, maxUses: 0, active: true });

  const fetchCoupons = () => {
    fetch("/api/coupons").then((r) => r.json()).then((d) => setCoupons(d.coupons || []));
  };

  useEffect(() => { fetchCoupons(); }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    await fetch("/api/coupons", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...form, discountValue: Number(form.discountValue), minOrderAmount: Number(form.minOrderAmount), maxUses: Number(form.maxUses) }),
    });
    setShowForm(false);
    setForm({ code: "", discountType: "percentage", discountValue: "", minOrderAmount: 0, maxUses: 0, active: true });
    fetchCoupons();
  };

  const handleDelete = async (id) => {
    if (!confirm("Delete coupon?")) return;
    await fetch(`/api/coupons?id=${id}`, { method: "DELETE" });
    fetchCoupons();
  };

  const inputClass = "mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm";

  return (
    <div>
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-slate-800">Coupons</h1>
        <button onClick={() => setShowForm(true)} className="rounded-xl bg-sky-500 px-4 py-2 text-sm font-semibold text-white">+ Add Coupon</button>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="mt-6 rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
          <div className="grid gap-3 sm:grid-cols-2">
            <div><label className="text-xs text-slate-500">Code *</label><input required value={form.code} onChange={(e) => setForm({ ...form, code: e.target.value.toUpperCase() })} className={inputClass} /></div>
            <div><label className="text-xs text-slate-500">Type</label><select value={form.discountType} onChange={(e) => setForm({ ...form, discountType: e.target.value })} className={inputClass}><option value="percentage">Percentage</option><option value="fixed">Fixed</option></select></div>
            <div><label className="text-xs text-slate-500">Value *</label><input required type="number" value={form.discountValue} onChange={(e) => setForm({ ...form, discountValue: e.target.value })} className={inputClass} /></div>
            <div><label className="text-xs text-slate-500">Min Order</label><input type="number" value={form.minOrderAmount} onChange={(e) => setForm({ ...form, minOrderAmount: e.target.value })} className={inputClass} /></div>
            <div><label className="text-xs text-slate-500">Max Uses (0=unlimited)</label><input type="number" value={form.maxUses} onChange={(e) => setForm({ ...form, maxUses: e.target.value })} className={inputClass} /></div>
          </div>
          <div className="mt-4 flex gap-3">
            <button type="submit" className="rounded-xl bg-sky-500 px-6 py-2 text-sm font-semibold text-white">Save</button>
            <button type="button" onClick={() => setShowForm(false)} className="rounded-xl bg-slate-200 px-6 py-2 text-sm">Cancel</button>
          </div>
        </form>
      )}

      <div className="mt-8 space-y-3">
        {coupons.map((c) => (
          <div key={c._id} className="flex items-center justify-between rounded-xl bg-white p-4 shadow-sm ring-1 ring-slate-200">
            <div>
              <p className="font-mono font-bold text-sky-600">{c.code}</p>
              <p className="text-sm text-slate-500">{c.discountType === "percentage" ? `${c.discountValue}% off` : `₹${c.discountValue} off`} · Used {c.usedCount}{c.maxUses > 0 ? `/${c.maxUses}` : ""}</p>
            </div>
            <button onClick={() => handleDelete(c._id)} className="text-sm text-red-500">Delete</button>
          </div>
        ))}
      </div>
    </div>
  );
}
