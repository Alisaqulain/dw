export const AGE_VERIFIED_KEY = "trustsilcon_age_verified";
export const COOKIE_CONSENT_KEY = "trustsilcon_cookie_consent";

export function getAgeVerified() {
  if (typeof window === "undefined") return false;
  return localStorage.getItem(AGE_VERIFIED_KEY) === "true";
}

export function setAgeVerified() {
  localStorage.setItem(AGE_VERIFIED_KEY, "true");
  document.cookie = `${AGE_VERIFIED_KEY}=true; path=/; max-age=${60 * 60 * 24 * 365}; SameSite=Lax`;
}

export function getCookieConsent() {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(COOKIE_CONSENT_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export function saveCookieConsent(prefs) {
  const data = {
    essential: true,
    analytics: prefs.analytics ?? false,
    marketing: prefs.marketing ?? false,
    timestamp: Date.now(),
  };
  localStorage.setItem(COOKIE_CONSENT_KEY, JSON.stringify(data));
  document.cookie = `${COOKIE_CONSENT_KEY}=${encodeURIComponent(JSON.stringify(data))}; path=/; max-age=${60 * 60 * 24 * 365}; SameSite=Lax`;
  if (typeof window !== "undefined") {
    window.dispatchEvent(new CustomEvent("cookie-consent-updated", { detail: data }));
  }
  return data;
}

export const BLOG_GUIDES = [
  {
    slug: "body-safe-silicone-guide",
    title: "Understanding Body-Safe Silicone",
    excerpt: "Learn why medical-grade silicone matters for intimate wellness and how to choose quality products.",
    readTime: "5 min read",
    category: "Wellness Guide",
    icon: "🛡️",
  },
  {
    slug: "discreet-shopping-guide",
    title: "Your Guide to Discreet Online Shopping",
    excerpt: "How TrustSilcon protects your privacy from checkout to delivery with plain packaging and private billing.",
    readTime: "4 min read",
    category: "Privacy",
    icon: "📦",
  },
  {
    slug: "product-care-guide",
    title: "Product Care & Maintenance",
    excerpt: "Simple steps to clean, store, and maintain your silicone wellness products for lasting quality.",
    readTime: "6 min read",
    category: "Care Tips",
    icon: "✨",
  },
  {
    slug: "first-time-buyer-guide",
    title: "First-Time Buyer's Guide",
    excerpt: "Everything you need to know before your first TrustSilcon order — sizing, materials, and what to expect.",
    readTime: "7 min read",
    category: "Getting Started",
    icon: "📖",
  },
];
