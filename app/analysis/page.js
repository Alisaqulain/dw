"use client";

import { useCallback, useEffect, useState } from "react";
import { GA_MEASUREMENT_ID } from "@/lib/analytics";

const META_PIXEL_ID = process.env.NEXT_PUBLIC_META_PIXEL_ID || "";
const GA_ID_ENV = process.env.NEXT_PUBLIC_GA_ID?.trim() || "";
const CLARITY_ID = process.env.NEXT_PUBLIC_CLARITY_ID || "";

const TEST_VALUE = 999;
const TEST_CURRENCY = "INR";
const TEST_ITEM = {
  item_id: "analysis-test-product",
  item_name: "Analysis Test Product",
  price: TEST_VALUE,
  quantity: 1,
};

function StatusBadge({ ok, label }) {
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold ${
        ok ? "bg-emerald-100 text-emerald-800" : "bg-red-100 text-red-700"
      }`}
    >
      <span className={`h-2 w-2 rounded-full ${ok ? "bg-emerald-500" : "bg-red-500"}`} />
      {label}
    </span>
  );
}

function IdRow({ label, value, hint }) {
  const set = Boolean(value);
  return (
    <div className="rounded-xl bg-slate-50 px-4 py-3 ring-1 ring-slate-100">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <span className="text-sm font-medium text-slate-600">{label}</span>
        <code className={`text-sm ${set ? "text-slate-800" : "text-red-600"}`}>
          {set ? value : "Not configured"}
        </code>
      </div>
      {hint && <p className="mt-1 text-xs text-slate-400">{hint}</p>}
    </div>
  );
}

export default function AnalysisPage() {
  const [browser, setBrowser] = useState({ fbq: false, gtag: false, clarity: false });
  const [log, setLog] = useState([]);

  const pushLog = useCallback((type, message) => {
    setLog((prev) => [
      { id: Date.now() + Math.random(), type, message, time: new Date().toLocaleTimeString("en-IN") },
      ...prev.slice(0, 24),
    ]);
  }, []);

  const refreshBrowserCheck = useCallback(() => {
    const next = {
      fbq: typeof window !== "undefined" && typeof window.fbq === "function",
      gtag: typeof window !== "undefined" && typeof window.gtag === "function",
      clarity: typeof window !== "undefined" && typeof window.clarity === "function",
    };
    setBrowser(next);
    return next;
  }, []);

  useEffect(() => {
    refreshBrowserCheck();
    const interval = setInterval(refreshBrowserCheck, 500);
    const stop = setTimeout(() => clearInterval(interval), 8000);
    return () => {
      clearInterval(interval);
      clearTimeout(stop);
    };
  }, [refreshBrowserCheck]);

  const metaParams = {
    viewContent: {
      content_ids: ["analysis-test-product"],
      content_name: "Analysis Test Product",
      content_type: "product",
      value: TEST_VALUE,
      currency: TEST_CURRENCY,
    },
    addToCart: {
      content_ids: ["analysis-test-product"],
      content_name: "Analysis Test Product",
      content_type: "product",
      value: TEST_VALUE,
      currency: TEST_CURRENCY,
    },
    initiateCheckout: { value: TEST_VALUE, currency: TEST_CURRENCY, num_items: 1 },
    purchase: { value: TEST_VALUE, currency: TEST_CURRENCY },
  };

  const runMeta = (eventName, params = {}) => {
    refreshBrowserCheck();
    if (typeof window.fbq !== "function") {
      pushLog("error", `Meta: window.fbq missing — cannot fire ${eventName}`);
      return false;
    }
    try {
      window.fbq("track", eventName, params);
      pushLog("success", `Meta: fbq('track', '${eventName}')`);
      return true;
    } catch (e) {
      pushLog("error", `Meta ${eventName}: ${e.message}`);
      return false;
    }
  };

  const runGA4 = (eventName, params = {}) => {
    refreshBrowserCheck();
    if (typeof window.gtag !== "function") {
      pushLog("error", `GA4: window.gtag missing — set NEXT_PUBLIC_GA_ID on Vercel and redeploy`);
      return false;
    }
    try {
      window.gtag("event", eventName, params);
      pushLog("success", `GA4: gtag('event', '${eventName}') → ${GA_MEASUREMENT_ID}`);
      return true;
    } catch (e) {
      pushLog("error", `GA4 ${eventName}: ${e.message}`);
      return false;
    }
  };

  const runClarity = () => {
    refreshBrowserCheck();
    if (typeof window.clarity !== "function") {
      pushLog("error", "Clarity: window.clarity missing");
      return false;
    }
    try {
      window.clarity("event", "test_event");
      window.clarity("set", "test_user", "analysis_page");
      pushLog("success", "Clarity: test_event + test_user=analysis_page");
      return true;
    } catch (e) {
      pushLog("error", `Clarity: ${e.message}`);
      return false;
    }
  };

  const combinedTests = [
    { id: "pageview", label: "Test PageView", desc: "Meta PageView + GA4 page_view", action: () => {
      runMeta("PageView");
      runGA4("page_view", { page_path: "/analysis", page_location: window.location.href, page_title: document.title });
    }},
    { id: "viewcontent", label: "Test ViewContent", desc: "Meta ViewContent + GA4 view_item", action: () => {
      runMeta("ViewContent", metaParams.viewContent);
      runGA4("view_item", { currency: TEST_CURRENCY, value: TEST_VALUE, items: [TEST_ITEM] });
    }},
    { id: "addtocart", label: "Test AddToCart", desc: "Meta AddToCart + GA4 add_to_cart", action: () => {
      runMeta("AddToCart", metaParams.addToCart);
      runGA4("add_to_cart", { currency: TEST_CURRENCY, value: TEST_VALUE, items: [TEST_ITEM] });
    }},
    { id: "checkout", label: "Test InitiateCheckout", desc: "Meta + GA4 begin_checkout", action: () => {
      runMeta("InitiateCheckout", metaParams.initiateCheckout);
      runGA4("begin_checkout", { currency: TEST_CURRENCY, value: TEST_VALUE, items: [TEST_ITEM] });
    }},
    { id: "purchase", label: "Test Purchase", desc: "Meta + GA4 purchase (click only)", action: () => {
      const txId = `TEST-${Date.now()}`;
      runMeta("Purchase", { ...metaParams.purchase, order_id: txId });
      runGA4("purchase", { currency: TEST_CURRENCY, value: TEST_VALUE, transaction_id: txId, items: [TEST_ITEM] });
    }},
    { id: "clarity", label: "Test Clarity Event", desc: "Custom Clarity event + tag", action: runClarity },
  ];

  const ga4OnlyTests = [
    { id: "ga-pageview", label: "GA4 page_view", action: () => runGA4("page_view", { page_path: "/analysis", page_title: "Analysis" }) },
    { id: "ga-viewitem", label: "GA4 view_item", action: () => runGA4("view_item", { currency: TEST_CURRENCY, value: TEST_VALUE, items: [TEST_ITEM] }) },
    { id: "ga-addtocart", label: "GA4 add_to_cart", action: () => runGA4("add_to_cart", { currency: TEST_CURRENCY, value: TEST_VALUE, items: [TEST_ITEM] }) },
    { id: "ga-checkout", label: "GA4 begin_checkout", action: () => runGA4("begin_checkout", { currency: TEST_CURRENCY, value: TEST_VALUE, items: [TEST_ITEM] }) },
    { id: "ga-purchase", label: "GA4 purchase", action: () => runGA4("purchase", { currency: TEST_CURRENCY, value: TEST_VALUE, transaction_id: `TEST-${Date.now()}`, items: [TEST_ITEM] }) },
  ];

  return (
    <div className="mx-auto max-w-3xl px-4 py-8 sm:px-6 sm:py-12">
      <div className="rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900">
        <strong>Testing only.</strong> Do not link this page publicly. Purchase fires only on button click.
      </div>

      <header className="mt-8">
        <p className="text-xs font-bold uppercase tracking-widest text-sky-600">Private QA</p>
        <h1 className="mt-2 text-2xl font-bold text-slate-900 sm:text-3xl">Tracking Analysis</h1>
        <p className="mt-2 text-sm text-slate-500">Verify Meta Pixel, GA4, and Clarity after deployment.</p>
      </header>

      <section className="mt-8 space-y-3">
        <h2 className="text-sm font-bold uppercase tracking-wider text-slate-500">Configured IDs</h2>
        <IdRow label="Meta Pixel ID" value={META_PIXEL_ID || "(not set)"} />
        <IdRow
          label="GA4 Measurement ID"
          value={GA_MEASUREMENT_ID}
          hint={GA_ID_ENV ? `Env: ${GA_ID_ENV}` : "Env NEXT_PUBLIC_GA_ID empty — using build fallback G-7E63SQ3RPY. Add to Vercel and redeploy."}
        />
        <IdRow
          label="GA4 Loaded"
          value={browser.gtag ? "Yes" : "No"}
        />
        <IdRow label="Microsoft Clarity ID" value={CLARITY_ID || "(not set)"} />
      </section>

      <section className="mt-8 rounded-2xl bg-white p-5 shadow-sm ring-1 ring-slate-200">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h2 className="text-sm font-bold uppercase tracking-wider text-slate-500">Browser Script Check</h2>
          <button type="button" onClick={() => { refreshBrowserCheck(); pushLog("success", "Browser check refreshed"); }} className="rounded-lg bg-slate-100 px-3 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-200">
            Refresh
          </button>
        </div>
        <div className="mt-4 flex flex-wrap gap-2">
          <StatusBadge ok={browser.fbq} label={browser.fbq ? "window.fbq = true" : "window.fbq = false"} />
          <StatusBadge ok={browser.gtag} label={browser.gtag ? "window.gtag = true" : "window.gtag = false"} />
          <StatusBadge ok={browser.clarity} label={browser.clarity ? "window.clarity = true" : "window.clarity = false"} />
        </div>
        {!browser.gtag && (
          <p className="mt-3 text-xs text-amber-700">
            GA4 fix: set <code className="rounded bg-amber-100 px-1">NEXT_PUBLIC_GA_ID=G-7E63SQ3RPY</code> in Vercel → Environment Variables → redeploy. Accept cookies if Meta also blocked.
          </p>
        )}
      </section>

      <section className="mt-8">
        <h2 className="text-sm font-bold uppercase tracking-wider text-slate-500">GA4 Event Tests (DebugView / Realtime)</h2>
        <div className="mt-4 grid gap-2 sm:grid-cols-2">
          {ga4OnlyTests.map((test) => (
            <button key={test.id} type="button" onClick={test.action} className="rounded-xl border border-orange-200 bg-orange-50 px-4 py-3 text-left text-sm font-semibold text-orange-900 hover:bg-orange-100">
              {test.label}
            </button>
          ))}
        </div>
      </section>

      <section className="mt-8">
        <h2 className="text-sm font-bold uppercase tracking-wider text-slate-500">Combined Platform Tests</h2>
        <div className="mt-4 grid gap-3 sm:grid-cols-2">
          {combinedTests.map((test) => (
            <button key={test.id} type="button" onClick={test.action} className="rounded-2xl border border-slate-200 bg-white p-4 text-left shadow-sm transition hover:border-sky-300 hover:shadow-md active:scale-[0.99]">
              <p className="font-semibold text-slate-900">{test.label}</p>
              <p className="mt-1 text-xs text-slate-500">{test.desc}</p>
            </button>
          ))}
        </div>
      </section>

      <section className="mt-8 rounded-2xl bg-slate-900 p-5 text-slate-100">
        <h2 className="text-sm font-bold uppercase tracking-wider text-slate-400">Event Log</h2>
        {log.length === 0 ? (
          <p className="mt-4 text-sm text-slate-500">Click a test button — results appear here.</p>
        ) : (
          <ul className="mt-4 max-h-72 space-y-2 overflow-y-auto text-sm">
            {log.map((entry) => (
              <li key={entry.id} className={`rounded-lg px-3 py-2 ${entry.type === "success" ? "bg-emerald-900/40 text-emerald-200" : "bg-red-900/40 text-red-200"}`}>
                <span className="text-xs text-slate-400">{entry.time}</span>
                <span className="ml-2">{entry.message}</span>
              </li>
            ))}
          </ul>
        )}
      </section>

      <section className="mt-8 rounded-2xl bg-sky-50 p-5 ring-1 ring-sky-100">
        <h2 className="text-sm font-bold text-sky-900">Where to verify</h2>
        <ul className="mt-3 space-y-2 text-sm text-sky-800">
          <li>• Meta → Events Manager → Test Events</li>
          <li>• GA4 → Reports → Realtime (or Admin → DebugView with GA Debugger extension)</li>
          <li>• Clarity → Recordings / Dashboard</li>
        </ul>
      </section>
    </div>
  );
}
