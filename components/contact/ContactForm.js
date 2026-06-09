"use client";

import { useState } from "react";
import { useToast } from "@/context/ToastContext";
import { STORE_CONTACT } from "@/lib/constants";
import { getWhatsAppDisplay, getWhatsAppUrl } from "@/lib/whatsapp";

export default function ContactForm() {
  const { showToast } = useToast();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", phone: "", subject: "General Inquiry", message: "" });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const res = await fetch("/api/contact", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    const data = await res.json();
    setLoading(false);
    if (res.ok) {
      showToast("Message sent successfully!");
      setForm({ name: "", email: "", phone: "", subject: "General Inquiry", message: "" });
    } else {
      showToast(data.error || "Failed to send", "error");
    }
  };

  const inputClass = "mt-1 w-full rounded-xl border border-sky-100 px-4 py-2.5 text-sm outline-none focus:border-sky-300 focus:ring-2 focus:ring-sky-100";

  return (
    <form onSubmit={handleSubmit} className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-sky-100 lg:col-span-3">
      <div className="space-y-4">
        <div>
          <label className="text-xs font-medium text-slate-500">Name *</label>
          <input required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className={inputClass} />
        </div>
        <div>
          <label className="text-xs font-medium text-slate-500">Email *</label>
          <input type="email" required value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} className={inputClass} />
        </div>
        <div>
          <label className="text-xs font-medium text-slate-500">Phone</label>
          <input value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} className={inputClass} />
        </div>
        <div>
          <label className="text-xs font-medium text-slate-500">Subject</label>
          <select value={form.subject} onChange={(e) => setForm({ ...form, subject: e.target.value })} className={inputClass}>
            <option>General Inquiry</option>
            <option>Order Support</option>
            <option>Product Question</option>
            <option>Return/Refund</option>
            <option>Other</option>
          </select>
        </div>
        <div>
          <label className="text-xs font-medium text-slate-500">Message *</label>
          <textarea required rows={5} value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} className={inputClass} />
        </div>
      </div>
      <button type="submit" disabled={loading} className="mt-6 w-full rounded-2xl bg-sky-500 py-3 font-semibold text-white disabled:opacity-50">
        {loading ? "Sending..." : "Send Message"}
      </button>
    </form>
  );
}

export function ContactInfo() {
  return (
    <div className="space-y-4 lg:col-span-2">
      <div className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-sky-100">
        <h2 className="text-sm font-bold uppercase tracking-wider text-sky-600">Get in Touch</h2>
        <div className="mt-5 space-y-4">
          <a href={`mailto:${STORE_CONTACT.email}`} className="flex items-start gap-3 rounded-xl bg-sky-50/50 p-4 transition hover:bg-sky-50">
            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-sky-500 text-white">
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
            </span>
            <div>
              <p className="text-xs font-medium text-slate-500">Email</p>
              <p className="mt-0.5 text-sm font-semibold text-slate-800">{STORE_CONTACT.email}</p>
            </div>
          </a>
          {STORE_CONTACT.phones.map((phone) => (
            <a key={phone.tel} href={`tel:${phone.tel}`} className="flex items-start gap-3 rounded-xl bg-sky-50/50 p-4 transition hover:bg-sky-50">
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#0c1929] text-white">
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" /></svg>
              </span>
              <div>
                <p className="text-xs font-medium text-slate-500">Phone</p>
                <p className="mt-0.5 text-sm font-semibold text-slate-800">{phone.display}</p>
              </div>
            </a>
          ))}
          <a
            href={getWhatsAppUrl("Hi TrustSilcon, I need help.")}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-start gap-3 rounded-xl bg-emerald-50 p-4 transition hover:bg-emerald-100/80"
          >
            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-emerald-500 text-white">
              <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.435 9.884-9.884 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" /></svg>
            </span>
            <div>
              <p className="text-xs font-medium text-slate-500">WhatsApp</p>
              <p className="mt-0.5 text-sm font-semibold text-emerald-700">+91 {getWhatsAppDisplay()}</p>
            </div>
          </a>
          {STORE_CONTACT.instagram && (
            <a
              href={STORE_CONTACT.instagram}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-start gap-3 rounded-xl bg-gradient-to-br from-purple-50 to-pink-50 p-4 transition hover:from-purple-100 hover:to-pink-100"
            >
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-purple-500 via-pink-500 to-orange-400 text-white">
                <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                </svg>
              </span>
              <div>
                <p className="text-xs font-medium text-slate-500">Instagram</p>
                <p className="mt-0.5 text-sm font-semibold text-slate-800">{STORE_CONTACT.instagramHandle}</p>
              </div>
            </a>
          )}
        </div>
      </div>
      <p className="text-xs text-slate-400">We typically respond within 24–48 hours on business days.</p>
    </div>
  );
}
