import Script from "next/script";

/** GA4 Measurement ID — TrustSilCon Website (Stream 15068285740) */
export const GA_MEASUREMENT_ID =
  process.env.NEXT_PUBLIC_GA_ID?.trim() || "G-7E63SQ3RPY";

export default function GoogleAnalytics() {
  const gaId = GA_MEASUREMENT_ID;
  if (!gaId || !gaId.startsWith("G-")) return null;

  const debugMode = process.env.NEXT_PUBLIC_GA_DEBUG === "true";

  return (
    <>
      <Script
        id="google-analytics-gtag"
        src={`https://www.googletagmanager.com/gtag/js?id=${gaId}`}
        strategy="afterInteractive"
      />
      <Script id="google-analytics-init" strategy="afterInteractive">
        {`
          window.dataLayer = window.dataLayer || [];
          window.gtag = window.gtag || function gtag(){window.dataLayer.push(arguments);};
          window.gtag('js', new Date());
          window.gtag('config', '${gaId}', {
            send_page_view: false${debugMode ? ",\n            debug_mode: true" : ""}
          });
        `}
      </Script>
    </>
  );
}
