import { getSiteUrl } from "@/lib/utils";
import { SITE_LOGO, STORE_CONTACT } from "@/lib/constants";

const SITE_NAME = "TrustSilcon";
const DEFAULT_OG_IMAGE = "/og-image.svg";
const DEFAULT_KEYWORDS = [
  "intimate wellness India",
  "body-safe silicone",
  "discreet delivery",
  "adult wellness products",
  "medical-grade silicone",
  "TrustSilcon",
];

function pageUrl(path = "") {
  const base = getSiteUrl().replace(/\/$/, "");
  if (!path || path === "/") return base;
  return `${base}${path.startsWith("/") ? path : `/${path}`}`;
}

export function buildMetadata({
  title,
  description,
  path = "",
  keywords = [],
  image = DEFAULT_OG_IMAGE,
  type = "website",
  noIndex = false,
}) {
  const url = pageUrl(path);
  const fullTitle = title.includes(SITE_NAME) ? title : `${title} | ${SITE_NAME}`;
  const allKeywords = [...new Set([...keywords, ...DEFAULT_KEYWORDS])];

  return {
    title,
    description,
    keywords: allKeywords,
    applicationName: SITE_NAME,
    alternates: { canonical: url },
    openGraph: {
      title: fullTitle,
      description,
      url,
      siteName: SITE_NAME,
      type,
      locale: "en_IN",
      images: [{ url: image, width: 1200, height: 630, alt: `${SITE_NAME} — ${title}` }],
    },
    twitter: {
      card: "summary_large_image",
      title: fullTitle,
      description,
      images: [image],
    },
    robots: noIndex
      ? { index: false, follow: false, nocache: true }
      : { index: true, follow: true, googleBot: { index: true, follow: true, "max-image-preview": "large", "max-snippet": -1 } },
  };
}

export function webPageSchema({ title, description, path }) {
  return {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: title,
    description,
    url: pageUrl(path),
    isPartOf: { "@type": "WebSite", name: SITE_NAME, url: getSiteUrl() },
    inLanguage: "en-IN",
  };
}

export function organizationSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: SITE_NAME,
    url: getSiteUrl(),
    logo: `${getSiteUrl()}${SITE_LOGO}`,
    description:
      "Premium body-safe silicone intimate wellness products with discreet delivery across India.",
    email: STORE_CONTACT.email,
    telephone: STORE_CONTACT.phones[0]?.tel,
    sameAs: STORE_CONTACT.instagram ? [STORE_CONTACT.instagram] : [],
    contactPoint: {
      "@type": "ContactPoint",
      telephone: STORE_CONTACT.phones[0]?.tel,
      contactType: "customer service",
      email: STORE_CONTACT.email,
      areaServed: "IN",
      availableLanguage: ["English", "Hindi"],
    },
  };
}

export function websiteSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: SITE_NAME,
    url: getSiteUrl(),
    description: "Shop premium body-safe silicone wellness products with discreet delivery across India.",
    potentialAction: {
      "@type": "SearchAction",
      target: {
        "@type": "EntryPoint",
        urlTemplate: `${getSiteUrl()}/shop?search={search_term_string}`,
      },
      "query-input": "required name=search_term_string",
    },
  };
}

export function breadcrumbSchema(items) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: item.name,
      item: item.href ? `${getSiteUrl()}${item.href}` : undefined,
    })),
  };
}

export function faqSchema(items) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: items.map((item) => ({
      "@type": "Question",
      name: item.q,
      acceptedAnswer: { "@type": "Answer", text: item.a },
    })),
  };
}

export function articleSchema({ title, description, slug, datePublished, dateModified }) {
  return {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: title,
    description,
    url: `${getSiteUrl()}/blog/${slug}`,
    datePublished,
    dateModified: dateModified || datePublished,
    author: { "@type": "Organization", name: SITE_NAME },
    publisher: {
      "@type": "Organization",
      name: SITE_NAME,
      logo: { "@type": "ImageObject", url: `${getSiteUrl()}${SITE_LOGO}` },
    },
    image: `${getSiteUrl()}${DEFAULT_OG_IMAGE}`,
  };
}

function resolveImageUrl(img) {
  const src = typeof img === "string" ? img : img?.url;
  if (!src || typeof src !== "string") return null;
  return src.startsWith("http") ? src : `${getSiteUrl()}${src.startsWith("/") ? src : `/${src}`}`;
}

export function getProductImageUrl(images, fallback = "/og-image.svg") {
  const resolved = (images || []).map(resolveImageUrl).filter(Boolean);
  return resolved[0] || `${getSiteUrl()}${fallback}`;
}

export function productSchema(product) {
  const url = pageUrl(`/products/${product.slug}`);
  const images = (product.images || []).map(resolveImageUrl).filter(Boolean);
  const description = product.shortDescription || product.fullDescription || product.description || "";
  const schema = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    description,
    url,
    sku: product._id?.toString() || product.slug,
    category: product.category || product.shopCollection || "Intimate Wellness",
    material: product.material || "Medical-grade silicone",
    brand: { "@type": "Brand", name: SITE_NAME },
    offers: {
      "@type": "Offer",
      url,
      priceCurrency: "INR",
      price: product.price,
      priceValidUntil: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
      availability:
        product.stock > 0
          ? "https://schema.org/InStock"
          : "https://schema.org/OutOfStock",
      itemCondition: "https://schema.org/NewCondition",
      seller: { "@type": "Organization", name: SITE_NAME },
      shippingDetails: {
        "@type": "OfferShippingDetails",
        shippingDestination: { "@type": "DefinedRegion", addressCountry: "IN" },
      },
    },
  };
  if (images.length) schema.image = images;
  if (product.avgRating && product.reviewCount) {
    schema.aggregateRating = {
      "@type": "AggregateRating",
      ratingValue: product.avgRating,
      reviewCount: product.reviewCount,
      bestRating: 5,
      worstRating: 1,
    };
  }
  return schema;
}

export function itemListSchema({ name, items }) {
  return {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name,
    itemListElement: items.map((item, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: item.name,
      url: item.url,
    })),
  };
}

export function contactPageSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "ContactPage",
    name: "Contact TrustSilcon",
    url: pageUrl("/contact"),
    mainEntity: {
      "@type": "Organization",
      name: SITE_NAME,
      email: STORE_CONTACT.email,
      telephone: STORE_CONTACT.phones[0]?.tel,
      url: getSiteUrl(),
    },
  };
}

export function localBusinessSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "Store",
    name: SITE_NAME,
    url: getSiteUrl(),
    image: `${getSiteUrl()}${SITE_LOGO}`,
    description: "Online intimate wellness store — body-safe silicone, discreet delivery India-wide.",
    priceRange: "₹₹",
    address: {
      "@type": "PostalAddress",
      addressCountry: "IN",
    },
    areaServed: { "@type": "Country", name: "India" },
    email: STORE_CONTACT.email,
    telephone: STORE_CONTACT.phones[0]?.tel,
  };
}
