"use client";

import { useEffect, useState } from "react";

export default function AdminSubscribersPage() {
  const [subscribers, setSubscribers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/subscribers", { method: "POST" })
      .then((r) => r.json())
      .then((d) => { setSubscribers(d.subscribers || []); setLoading(false); });
  }, []);

  return (
    <div>
      <h1 className="text-2xl font-bold text-slate-800">Email Subscribers</h1>
      <p className="text-slate-500">Marketing opt-in list and unsubscribe status</p>

      {loading ? <p className="mt-8 text-slate-500">Loading...</p> : (
        <div className="mt-8 overflow-x-auto rounded-2xl bg-white shadow-sm ring-1 ring-slate-200">
          <table className="w-full text-sm">
            <thead className="border-b border-slate-200 bg-slate-50">
              <tr>
                <th className="px-4 py-3 text-left font-medium text-slate-600">Email</th>
                <th className="px-4 py-3 text-left font-medium text-slate-600">Name</th>
                <th className="px-4 py-3 text-left font-medium text-slate-600">Opt-in</th>
                <th className="px-4 py-3 text-left font-medium text-slate-600">Unsubscribed</th>
                <th className="px-4 py-3 text-left font-medium text-slate-600">Last Email</th>
                <th className="px-4 py-3 text-left font-medium text-slate-600">Source</th>
              </tr>
            </thead>
            <tbody>
              {subscribers.map((s) => (
                <tr key={s._id} className="border-b border-slate-100">
                  <td className="px-4 py-3">{s.email}</td>
                  <td className="px-4 py-3">{s.name || "—"}</td>
                  <td className="px-4 py-3">{s.marketingOptIn ? "✓" : "✗"}</td>
                  <td className="px-4 py-3">{s.unsubscribed ? "Yes" : "No"}</td>
                  <td className="px-4 py-3">{s.lastMarketingEmailAt ? new Date(s.lastMarketingEmailAt).toLocaleDateString() : "Never"}</td>
                  <td className="px-4 py-3 capitalize">{s.source}</td>
                </tr>
              ))}
            </tbody>
          </table>
          {subscribers.length === 0 && <p className="p-8 text-center text-slate-500">No subscribers yet</p>}
        </div>
      )}
    </div>
  );
}
