"use client";

import { useState } from "react";
import Stars from "@/components/ui/Stars";
import { RevealSection } from "@/hooks/useReveal";

export default function HomeReviews({ reviews }) {
  if (!reviews?.length) return null;

  return (
    <section className="bg-gradient-to-b from-sky-50/50 to-white py-12 sm:py-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <RevealSection className="text-center">
          <span className="text-xs font-bold uppercase tracking-widest text-sky-500">Testimonials</span>
          <h2 className="mt-2 text-2xl font-bold text-slate-900 sm:text-3xl">Loved by Thousands</h2>
          <div className="mt-4 inline-flex items-center gap-2 rounded-full bg-white px-5 py-2 shadow-sm ring-1 ring-slate-100">
            <Stars rating={4.8} size="sm" showValue />
            <span className="text-sm text-slate-500">from verified buyers</span>
          </div>
        </RevealSection>
        <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {reviews.slice(0, 6).map((review, i) => (
            <RevealSection key={review._id} delay={i * 60}>
              <div className="h-full rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-100">
                <Stars rating={review.rating} size="sm" />
                <p className="mt-4 text-sm leading-relaxed text-slate-600">&ldquo;{review.review}&rdquo;</p>
                <div className="mt-5 flex items-center gap-3 border-t border-slate-50 pt-4">
                  <div className="flex h-9 w-9 items-center justify-center rounded-full bg-sky-100 text-sm font-bold text-sky-600">
                    {review.name.charAt(0)}
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-slate-800">{review.name}</p>
                    <p className="text-[10px] text-slate-400">Verified Buyer</p>
                  </div>
                </div>
              </div>
            </RevealSection>
          ))}
        </div>
      </div>
    </section>
  );
}
