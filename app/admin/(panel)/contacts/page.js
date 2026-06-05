"use client";

import { useEffect, useState } from "react";

export default function AdminContactsPage() {
  const [leads, setLeads] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/contact")
      .then((r) => r.json())
      .then((d) => { setLeads(d.leads || []); setLoading(false); });
  }, []);

  const updateStatus = async (id, status) => {
    await fetch("/api/contact", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, status }),
    });
    setLeads((prev) => prev.map((l) => (l._id === id ? { ...l, status } : l)));
  };

  return (
    <div>
      <h1 className="text-2xl font-bold text-slate-800">Contact Leads</h1>
      {loading ? <p className="mt-8 text-slate-500">Loading...</p> : leads.length === 0 ? (
        <p className="mt-8 text-slate-500">No contact messages</p>
      ) : (
        <div className="mt-8 space-y-4">
          {leads.map((lead) => (
            <div key={lead._id} className="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-slate-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">{lead.name}</p>
                  <p className="text-sm text-slate-500">{lead.email} {lead.phone && `· ${lead.phone}`}</p>
                </div>
                <select value={lead.status} onChange={(e) => updateStatus(lead._id, e.target.value)} className="rounded-lg border border-slate-200 px-2 py-1 text-xs">
                  <option value="new">New</option>
                  <option value="read">Read</option>
                  <option value="replied">Replied</option>
                </select>
              </div>
              <p className="mt-1 text-xs font-medium text-sky-500">{lead.subject}</p>
              <p className="mt-2 text-sm text-slate-600">{lead.message}</p>
              <p className="mt-2 text-xs text-slate-400">{new Date(lead.createdAt).toLocaleString()}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
