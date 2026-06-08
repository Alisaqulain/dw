import { getSiteUrl } from "@/lib/utils";

export default function manifest() {
  return {
    name: "TrustSilcon — Premium Intimate Wellness",
    short_name: "TrustSilcon",
    description: "Body-safe silicone wellness products with discreet delivery across India.",
    start_url: "/",
    display: "standalone",
    background_color: "#ffffff",
    theme_color: "#0c1929",
    icons: [
      { src: "/lgowithbg.png", sizes: "360x180", type: "image/png" },
    ],
    categories: ["shopping", "health"],
    lang: "en-IN",
    scope: "/",
  };
}
