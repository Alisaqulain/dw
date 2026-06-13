import { Geist } from "next/font/google";
import "./globals.css";
import StoreShell from "@/components/layout/StoreShell";
import { CartProvider } from "@/context/CartContext";
import { LanguageProvider } from "@/context/LanguageContext";
import { WhatsAppProvider } from "@/context/WhatsAppContext";
import { ToastProvider } from "@/context/ToastContext";
import Analytics from "@/components/layout/Analytics";
import JsonLd from "@/components/seo/JsonLd";
import { organizationSchema, websiteSchema, localBusinessSchema } from "@/lib/seo";

const geist = Geist({ subsets: ["latin"], variable: "--font-geist" });

export const viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  viewportFit: "cover",
  themeColor: "#0c1929",
};

export const metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"),
  title: {
    default: "TrustSilcon — Premium Body-Safe Silicone Wellness India",
    template: "%s | TrustSilcon",
  },
  description:
    "Shop premium body-safe silicone wellness products with discreet delivery across India. Medical-grade materials, COD available, plain packaging, fast 3–7 day shipping.",
  keywords: [
    "intimate wellness India",
    "body-safe silicone",
    "discreet delivery",
    "adult wellness products",
    "medical-grade silicone",
    "wellness products India",
    "TrustSilcon",
  ],
  authors: [{ name: "TrustSilcon", url: process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000" }],
  creator: "TrustSilcon",
  publisher: "TrustSilcon",
  formatDetection: { email: false, address: false, telephone: false },
  openGraph: {
    title: "TrustSilcon — Premium Wellness Products India",
    description: "Body-safe silicone wellness with discreet delivery across India. COD available.",
    siteName: "TrustSilcon",
    type: "website",
    locale: "en_IN",
    images: [{ url: "/og-image.svg", width: 1200, height: 630, alt: "TrustSilcon — Premium Intimate Wellness" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "TrustSilcon — Premium Intimate Wellness India",
    description: "Body-safe silicone wellness with discreet delivery. Shop now.",
    images: ["/og-image.svg"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, "max-image-preview": "large", "max-snippet": -1 },
  },
  alternates: { canonical: process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000" },
  category: "shopping",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en-IN" className={`${geist.variable} h-full`}>
      <body className="min-h-full flex flex-col bg-white font-sans text-slate-800 antialiased">
        <JsonLd data={[organizationSchema(), websiteSchema(), localBusinessSchema()]} />
        <CartProvider>
          <LanguageProvider>
            <WhatsAppProvider>
              <ToastProvider>
                <Analytics />
                <StoreShell>{children}</StoreShell>
              </ToastProvider>
            </WhatsAppProvider>
          </LanguageProvider>
        </CartProvider>
      </body>
    </html>
  );
}
