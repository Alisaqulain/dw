"use client";

import { useState } from "react";
import { RevealSection } from "@/hooks/useReveal";

export default function FAQAccordion({ items }) {
  const [open, setOpen] = useState(0);

  return (
    <div className="space-y-3">
      {items.map((faq, i) => (
        <RevealSection key={faq.q} delay={i * 40}>
          <div className="overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-slate-100">
            <button
              type="button"
              onClick={() => setOpen(open === i ? -1 : i)}
              className="flex w-full items-center justify-between px-5 py-4 text-left"
            >
              <span className="pr-4 text-sm font-semibold text-slate-800">{faq.q}</span>
              <svg
                className={`h-5 w-5 shrink-0 text-sky-400 transition ${open === i ? "rotate-180" : ""}`}
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>
            {open === i && (
              <div className="border-t border-slate-50 px-5 py-4">
                <p className="text-sm leading-relaxed text-slate-500">{faq.a}</p>
              </div>
            )}
          </div>
        </RevealSection>
      ))}
    </div>
  );
}
