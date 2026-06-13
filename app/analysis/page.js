"use client";

import { useCallback, useEffect, useState } from "react";

const META_PIXEL_ID = process.env.NEXT_PUBLIC_META_PIXEL_ID || "";
const GA_ID = process.env.NEXT_PUBLIC_GA_ID || "";
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

function IdRow({ label, value }) {
  const set = Boolean(value);
  return (
    <div className="flex flex-wrap items-center justify-between gap-2 rounded-xl bg-slate-50 px-4 py-3 ring-1 ring-slate-100">
      <span className="text-sm font-medium text-slate-600">{label}</span>
      <code className={`text-sm ${set ? "text-slate-800" : "text-red-600"}`}>
        {set ? value : "Not configured"}
      </code>
    </div>
  );
}

export default function AnalysisPage() {
  const [browser, setBrowser] = useState({ fbq: false, gtag: false, clarity: false });
  const [log, setLog] = useState([]);

  const pushLog = useCallback((type, message) => {
    setLog((prev) => [
      { id: Date.now() + Math.random(), type, message, time: new Date().toLocaleTimeString("en-IN") },
      ...prev.slice(0, 19),
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
    const timer = setTimeout(refreshBrowserCheck, 1500);
    return () => clearTimeout(timer);
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
    initiateCheckout: {
      value: TEST_VALUE,
      currency: TEST_CURRENCY,
      num_items: 1,
    },
    purchase: {
      value: TEST_VALUE,
      currency: TEST_CURRENCY,
      order_id: `TEST-${Date.now()}`,
    },
  };

  const gaParams = {
    view_item: { currency: TEST_CURRENCY, value: TEST_VALUE, items: [TEST_ITEM] },
    add_to_cart: { currency: TEST_CURRENCY, value: TEST_VALUE, items: [TEST_ITEM] },
    begin_checkout: { currency: TEST_CURRENCY, value: TEST_VALUE, items: [TEST_ITEM] },
    purchase: {
      currency: TEST_CURRENCY,
      value: TEST_VALUE,
      transaction_id: `TEST-${Date.now()}`,
      items: [TEST_ITEM],
    },
  };

  const runMeta = (eventName, params = {}) => {
    refreshBrowserCheck();
    if (!window.fbq) {
      pushLog("error", `Meta: window.fbq missing — cannot fire ${eventName}`);
      return false;
    }
    try {
      window.fbq("track", eventName, params);
      pushLog("success", `Meta Pixel: fbq('track', '${eventName}') fired`);
      return true;
    } catch (e) {
      pushLog("error", `Meta ${eventName}: ${e.message}`);
      return false;
    }
  };

  const runGA4 = (eventName, params = {}) => {
    refreshBrowserCheck();
    if (!window.gtag) {
      pushLog("error", `GA4: window.gtag missing — cannot fire ${eventName}`);
      return false;
    }
    try {
      window.gtag("event", eventName, params);
      pushLog("success", `GA4: gtag('event', '${eventName}') fired`);
      return true;
    } catch (e) {
      pushLog("error", `GA4 ${eventName}: ${e.message}`);
      return false;
    }
  };

  const runClarity = () => {
    refreshBrowserCheck();
    if (!window.clarity) {
      pushLog("error", "Clarity: window.clarity missing — script may not be loaded yet");
      return false;
    }
    try {
      window.clarity("event", "test_event");
      window.clarity("set", "test_user", "analysis_page");
      pushLog("success", "Clarity: event 'test_event' + set test_user=analysis_page");
      return true;
    } catch (e) {
      pushLog("error", `Clarity: ${e.message}`);
      return false;
    }
  };

  const tests = [
    {
      id: "pageview",
      label: "Test PageView",
      desc: "Meta PageView + GA4 page_view",
      action: () => {
        runMeta("PageView");
        runGA4("page_view", {
          page_path: "/analysis",
          page_location: window.location.href,
          page_title: document.title,
        });
      },
    },
    {
      id: "viewcontent",
      label: "Test ViewContent",
      desc: "Meta ViewContent + GA4 view_item",
      action: () => {
        runMeta("ViewContent", metaParams.viewContent);
        runGA4("view_item", gaParams.view_item);
      },
    },
    {
      id: "addtocart",
      label: "Test AddToCart",
      desc: "Meta AddToCart + GA4 add_to_cart",
      action: () => {
        runMeta("AddToCart", metaParams.addToCart);
        runGA4("add_to_cart", gaParams.add_to_cart);
      },
    },
    {
      id: "checkout",
      label: "Test InitiateCheckout",
      desc: "Meta InitiateCheckout + GA4 begin_checkout",
      action: () => {
        runMeta("InitiateCheckout", metaParams.initiateCheckout);
        runGA4("begin_checkout", gaParams.begin_checkout);
      },
    },
    {
      id: "purchase",
      label: "Test Purchase",
      desc: "Meta Purchase + GA4 purchase (manual only)",
      action: () => {
        const txId = `TEST-${Date.now()}`;
        runMeta("Purchase", { ...metaParams.purchase, order_id: txId });
        runGA4("purchase", { ...gaParams.purchase, transaction_id: txId });
      },
    },
    {
      id: "ga4",
      label: "Test GA4 Event",
      desc: "Custom analysis_test event",
      action: () => {
        runGA4("analysis_test", {
          event_category: "testing",
          event_label: "analysis_page",
          value: TEST_VALUE,
        });
      },
    },
    {
      id: "clarity",
      label: "Test Clarity Custom Event",
      desc: "clarity('event') + clarity('set')",
      action: runClarity,
    },
  ];

  return (
    <div className="mx-auto max-w-3xl px-4 py-8 sm:px-6 sm:py-12">
      <div className="rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900">
        <strong>Testing only.</strong> Do not link this page publicly. Events use test data (₹999). Purchase does not fire on page load.
      </div>

      <header className="mt-8">
        <p className="text-xs font-bold uppercase tracking-widest text-sky-600">Private QA</p>
        <h1 className="mt-2 text-2xl font-bold text-slate-900 sm:text-3xl">Tracking Analysis</h1>
        <p className="mt-2 text-sm text-slate-500">
          Verify Meta Pixel, Google Analytics 4, and Microsoft Clarity after deployment.
        </p>
      </header>

      <section className="mt-8 space-y-3">
        <h2 className="text-sm font-bold uppercase tracking-wider text-slate-500">Configured IDs</h2>
        <IdRow label="Meta Pixel" value={META_PIXEL_ID} />
        <IdRow label="Google Analytics 4" value={GA_ID} />
        <IdRow label="Microsoft Clarity" value={CLARITY_ID} />
      </section>

      <section className="mt-8 rounded-2xl bg-white p-5 shadow-sm ring-1 ring-slate-200">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h2 className="text-sm font-bold uppercase tracking-wider text-slate-500">Browser Script Check</h2>
          <button
            type="button"
            onClick={() => {
              refreshBrowserCheck();
              pushLog("success", "Browser check refreshed");
            }}
            className="rounded-lg bg-slate-100 px-3 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-200"
          >
            Refresh
          </button>
        </div>
        <div className="mt-4 flex flex-wrap gap-2">
          <StatusBadge ok={browser.fbq} label={browser.fbq ? "window.fbq ✓" : "window.fbq ✗"} />
          <StatusBadge ok={browser.gtag} label={browser.gtag ? "window.gtag ✓" : "window.gtag ✗"} />
          <StatusBadge ok={browser.clarity} label={browser.clarity ? "window.clarity ✓" : "window.clarity ✗"} />
        </div>
        {!browser.fbq && (
          <p className="mt-3 text-xs text-slate-500">
            Meta Pixel may require cookie consent on the store. Accept cookies on the homepage first, then return here.
          </p>
        )}
      </section>

      <section className="mt-8">
        <h2 className="text-sm font-bold uppercase tracking-wider text-slate-500">Fire Test Events</h2>
        <div className="mt-4 grid gap-3 sm:grid-cols-2">
          {tests.map((test) => (
            <button
              key={test.id}
              type="button"
              onClick={test.action}
              className="rounded-2xl border border-slate-200 bg-white p-4 text-left shadow-sm transition hover:border-sky-300 hover:shadow-md active:scale-[0.99]"
            >
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
              <li
                key={entry.id}
                className={`rounded-lg px-3 py-2 ${
                  entry.type === "success" ? "bg-emerald-900/40 text-emerald-200" : "bg-red-900/40 text-red-200"
                }`}
              >
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
          <li>• Meta Events Manager → Test Events (or Overview)</li>
          <li>• Google Analytics → Realtime or DebugView</li>
          <li>• Microsoft Clarity → Recordings / Dashboard (custom tags)</li>
        </ul>
      </section>
    </div>
  );
}
