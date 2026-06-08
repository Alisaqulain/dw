import { getSiteUrl } from "@/lib/utils";
import { STORE_CONTACT } from "@/lib/constants";

const SITE_NAME = "TrustSilcon";
const DEFAULT_OG_IMAGE = "/og-image.svg";

export function buildMetadata({
  title,
  description,
  path = "",
  keywords = [],
  image = DEFAULT_OG_IMAGE,
  type = "website",
  noIndex = false,
}) {
  const url = `${getSiteUrl()}${path.startsWith("/") ? path : `/${path}`}`;
  const fullTitle = title.includes(SITE_NAME) ? title : `${title} | ${SITE_NAME}`;

  return {
    title,
    description,
    keywords: keywords.length ? keywords : undefined,
    alternates: { canonical: url },
    openGraph: {
      title: fullTitle,
      description,
      url,
      siteName: SITE_NAME,
      type,
      locale: "en_IN",
      images: [{ url: image, width: 1200, height: 630, alt: SITE_NAME }],
    },
    twitter: {
      card: "summary_large_image",
      title: fullTitle,
      description,
      images: [image],
    },
    robots: noIndex ? { index: false, follow: false } : { index: true, follow: true },
  };
}

export function organizationSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: SITE_NAME,
    url: getSiteUrl(),
    logo: `${getSiteUrl()}/lgowithbg.png`,
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
      logo: { "@type": "ImageObject", url: `${getSiteUrl()}/lgowithbg.png` },
    },
    image: `${getSiteUrl()}${DEFAULT_OG_IMAGE}`,
  };
}

export function productSchema(product) {
  const url = `${getSiteUrl()}/products/${product.slug}`;
  const images = (product.images || []).filter(Boolean);
  const schema = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    description: product.description || product.shortDescription,
    url,
    sku: product._id?.toString() || product.slug,
    brand: { "@type": "Brand", name: SITE_NAME },
    offers: {
      "@type": "Offer",
      url,
      priceCurrency: "INR",
      price: product.price,
      availability:
        product.stock > 0
          ? "https://schema.org/InStock"
          : "https://schema.org/OutOfStock",
      seller: { "@type": "Organization", name: SITE_NAME },
    },
  };
  if (images.length) schema.image = images.map((img) => (img.startsWith("http") ? img : `${getSiteUrl()}${img}`));
  if (product.avgRating) {
    schema.aggregateRating = {
      "@type": "AggregateRating",
      ratingValue: product.avgRating,
      reviewCount: product.reviewCount || 1,
    };
  }
  return schema;
}

export function localBusinessSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "Store",
    name: SITE_NAME,
    url: getSiteUrl(),
    image: `${getSiteUrl()}/lgowithbg.png`,
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
