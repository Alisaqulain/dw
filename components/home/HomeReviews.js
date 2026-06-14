"use client";

import { useState } from "react";
import Stars from "@/components/ui/Stars";
import { RevealSection } from "@/hooks/useReveal";
import { trackCTA } from "@/lib/analytics";

export default function HomeReviews({ reviews }) {
  const [expanded, setExpanded] = useState(false);

  if (!reviews?.length) return null;

  const avgRating =
    Math.round((reviews.reduce((s, r) => s + r.rating, 0) / reviews.length) * 10) / 10;
  const visible = expanded ? reviews : reviews.slice(0, 6);

  return (
    <section className="bg-gradient-to-b from-sky-50/50 to-white py-12 sm:py-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <RevealSection className="text-center">
          <span className="text-xs font-bold uppercase tracking-widest text-sky-500">Customer Reviews</span>
          <h2 className="mt-2 text-2xl font-bold text-slate-900 sm:text-3xl">Loved by Thousands</h2>
          <div className="mt-4 inline-flex flex-wrap items-center justify-center gap-3">
            <div className="inline-flex items-center gap-2 rounded-full bg-white px-5 py-2 shadow-sm ring-1 ring-slate-100">
              <Stars rating={avgRating} size="sm" showValue />
              <span className="text-sm text-slate-500">{reviews.length}+ reviews</span>
            </div>
            <span className="rounded-full bg-emerald-50 px-4 py-2 text-xs font-bold text-emerald-700 ring-1 ring-emerald-100">
              ✓ Verified Buyers
            </span>
          </div>
        </RevealSection>
        <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {visible.map((review, i) => (
            <RevealSection key={review._id} delay={i * 40}>
              <div className="h-full rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-100 transition hover:shadow-md">
                <Stars rating={review.rating} size="sm" />
                <p className="mt-4 text-sm leading-relaxed text-slate-600">&ldquo;{review.review}&rdquo;</p>
                <div className="mt-5 flex items-center gap-3 border-t border-slate-50 pt-4">
                  <div className="flex h-9 w-9 items-center justify-center rounded-full bg-sky-100 text-sm font-bold text-sky-600">
                    {review.name.charAt(0)}
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-slate-800">
                      {review.name}
                      {review.city ? `, ${review.city}` : ""}
                    </p>
                    {review.verifiedBuyer && (
                      <p className="text-[10px] font-bold text-emerald-600">✓ Verified Buyer</p>
                    )}
                  </div>
                </div>
              </div>
            </RevealSection>
          ))}
        </div>
        {reviews.length > 6 && (
          <div className="mt-8 text-center">
            <button
              type="button"
              onClick={() => {
                setExpanded(!expanded);
                trackCTA("reviews_toggle", expanded ? "collapse" : "expand");
              }}
              className="rounded-full bg-[#0c1929] px-6 py-2.5 text-sm font-semibold text-white hover:bg-[#1e3a5f]"
            >
              {expanded ? "Show Less" : `Show All ${reviews.length} Reviews`}
            </button>
          </div>
        )}
      </div>
    </section>
  );
}
