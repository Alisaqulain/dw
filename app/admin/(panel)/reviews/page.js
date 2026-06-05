"use client";

import { useEffect, useState } from "react";

export default function AdminReviewsPage() {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchReviews = () => {
    fetch("/api/reviews?approved=all")
      .then((r) => r.json())
      .then((d) => { setReviews(d.reviews || []); setLoading(false); });
  };

  useEffect(() => { fetchReviews(); }, []);

  const toggleApproval = async (id, approved) => {
    await fetch("/api/reviews", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, approved }),
    });
    fetchReviews();
  };

  const handleDelete = async (id) => {
    if (!confirm("Delete review?")) return;
    await fetch(`/api/reviews?id=${id}`, { method: "DELETE" });
    fetchReviews();
  };

  return (
    <div>
      <h1 className="text-2xl font-bold text-slate-800">Reviews</h1>
      <p className="text-slate-500">Approve or reject customer reviews</p>

      {loading ? <p className="mt-8 text-slate-500">Loading...</p> : reviews.length === 0 ? (
        <p className="mt-8 text-slate-500">No pending reviews</p>
      ) : (
        <div className="mt-8 space-y-4">
          {reviews.map((r) => (
            <div key={r._id} className="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-slate-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">{r.name}</p>
                  <p className="text-sm text-amber-500">{"★".repeat(r.rating)}{"☆".repeat(5 - r.rating)}</p>
                </div>
                <span className={`rounded-lg px-2 py-0.5 text-xs font-medium ${r.approved ? "bg-emerald-100 text-emerald-700" : "bg-yellow-100 text-yellow-700"}`}>
                  {r.approved ? "Approved" : "Pending"}
                </span>
              </div>
              <p className="mt-2 text-sm text-slate-600">{r.review}</p>
              <div className="mt-4 flex gap-2">
                {!r.approved && (
                  <button onClick={() => toggleApproval(r._id, true)} className="rounded-lg bg-emerald-500 px-4 py-1.5 text-xs font-medium text-white">Approve</button>
                )}
                {r.approved && (
                  <button onClick={() => toggleApproval(r._id, false)} className="rounded-lg bg-yellow-500 px-4 py-1.5 text-xs font-medium text-white">Reject</button>
                )}
                <button onClick={() => handleDelete(r._id)} className="rounded-lg bg-red-100 px-4 py-1.5 text-xs font-medium text-red-600">Delete</button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
