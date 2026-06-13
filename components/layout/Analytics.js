import { Suspense } from "react";
import GoogleAnalytics from "@/components/analytics/GoogleAnalytics";
import MetaPixel from "@/components/analytics/MetaPixel";
import Clarity from "@/components/analytics/Clarity";
import PageViewTracker from "@/components/analytics/PageViewTracker";

export default function Analytics() {
  return (
    <>
      <GoogleAnalytics />
      <Clarity />
      <Suspense fallback={null}>
        <MetaPixel />
        <PageViewTracker />
      </Suspense>
    </>
  );
}
