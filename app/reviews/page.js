"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { useToast } from "@/context/ToastContext";
import ContentPageHero from "@/components/layout/ContentPageHero";

function StarsInput({ rating, setRating }) {
  return (
    <div className="flex gap-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <button key={star} type="button" onClick={() => setRating(star)} className="focus:outline-none">
          <svg className={`h-8 w-8 ${star <= rating ? "text-amber-400" : "text-slate-200"} transition hover:scale-110`} fill="currentColor" viewBox="0 0 20 20">
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
          </svg>
        </button>
      ))}
    </div>
  );
}

function ReviewsContent() {
  const searchParams = useSearchParams();
  const { showToast } = useToast();
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [form, setForm] = useState({
    name: "",
    rating: 5,
    review: "",
    orderNumber: "",
    productId: "",
  });

  useEffect(() => {
    setForm((f) => ({
      ...f,
      orderNumber: searchParams.get("order") || "",
      productId: searchParams.get("productId") || "",
    }));
    if (typeof window !== "undefined" && window.location.hash === "#write-review") {
      requestAnimationFrame(() => {
        document.getElementById("write-review")?.scrollIntoView({ behavior: "smooth", block: "start" });
      });
    }
  }, [searchParams]);

  useEffect(() => {
    fetch("/api/reviews")
      .then(async (r) => {
        const d = await r.json();
        if (!r.ok) throw new Error(d.error || "Failed to load reviews");
        setReviews(d.reviews || []);
        setLoadError("");
      })
      .catch((err) => setLoadError(err.message || "Could not load reviews"))
      .finally(() => setLoading(false));
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    const res = await fetch("/api/reviews", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: form.name,
        rating: form.rating,
        review: form.review,
        orderNumber: form.orderNumber,
        productId: form.productId || undefined,
      }),
    });
    const data = await res.json();
    setSubmitting(false);
    if (res.ok) {
      showToast("Review submitted! It will appear after approval.");
      setForm((f) => ({ ...f, name: "", review: "", rating: 5, orderNumber: "" }));
    } else {
      showToast(data.error || "Failed to submit", "error");
    }
  };

  return (
    <>
      <ContentPageHero
        title="Customer Reviews"
        subtitle="Share your TrustSilcon experience — your feedback helps others shop with confidence."
        breadcrumb={[{ label: "Reviews" }]}
      />
      <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
        <form id="write-review" onSubmit={handleSubmit} className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-sky-100">
          <h2 className="font-bold text-slate-800">Write a Review</h2>
          <p className="mt-1 text-sm text-slate-500">Give a 1–5 star rating and tell us about your experience.</p>
          <div className="mt-4 space-y-4">
            <div>
              <label className="text-xs font-medium text-slate-500">Your Name *</label>
              <input required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="mt-1 w-full rounded-xl border border-sky-100 px-4 py-2.5 text-sm outline-none focus:border-sky-300" />
            </div>
            <div>
              <label className="text-xs font-medium text-slate-500">Rating *</label>
              <div className="mt-1"><StarsInput rating={form.rating} setRating={(r) => setForm({ ...form, rating: r })} /></div>
            </div>
            <div>
              <label className="text-xs font-medium text-slate-500">Order ID (optional)</label>
              <input value={form.orderNumber} onChange={(e) => setForm({ ...form, orderNumber: e.target.value })} className="mt-1 w-full rounded-xl border border-sky-100 px-4 py-2.5 text-sm outline-none focus:border-sky-300" />
            </div>
            <div>
              <label className="text-xs font-medium text-slate-500">Your Review *</label>
              <textarea required rows={4} value={form.review} onChange={(e) => setForm({ ...form, review: e.target.value })} className="mt-1 w-full rounded-xl border border-sky-100 px-4 py-2.5 text-sm outline-none focus:border-sky-300" />
            </div>
          </div>
          <button type="submit" disabled={submitting} className="mt-4 rounded-2xl bg-sky-500 px-6 py-2.5 font-semibold text-white disabled:opacity-50">
            {submitting ? "Submitting..." : "Submit Review"}
          </button>
        </form>

        <div className="mt-12">
          <h2 className="text-xl font-bold text-slate-800">All Reviews</h2>
          {loading ? (
            <p className="mt-4 text-slate-500">Loading...</p>
          ) : loadError ? (
            <p className="mt-4 text-sm text-red-500">{loadError}</p>
          ) : reviews.length === 0 ? (
            <p className="mt-4 text-slate-500">No reviews yet. Be the first!</p>
          ) : (
            <div className="mt-6 space-y-4">
              {reviews.map((r) => (
                <div key={r._id} className="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-sky-100">
                  <div className="flex items-center justify-between">
                    <span className="font-semibold">{r.name}</span>
                    <div className="flex">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <svg key={star} className={`h-4 w-4 ${star <= r.rating ? "text-amber-400" : "text-slate-200"}`} fill="currentColor" viewBox="0 0 20 20">
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                      ))}
                    </div>
                  </div>
                  <p className="mt-2 text-sm text-slate-600">{r.review}</p>
                  <p className="mt-2 text-xs text-slate-400">{new Date(r.createdAt).toLocaleDateString()}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  );
}

export default function ReviewsPage() {
  return (
    <Suspense fallback={<div className="py-20 text-center">Loading...</div>}>
      <ReviewsContent />
    </Suspense>
  );
}
