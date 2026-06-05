import { Geist } from "next/font/google";
import "./globals.css";
import StoreShell from "@/components/layout/StoreShell";
import { CartProvider } from "@/context/CartContext";
import { ToastProvider } from "@/context/ToastContext";
import Analytics from "@/components/layout/Analytics";

const geist = Geist({ subsets: ["latin"], variable: "--font-geist" });

export const metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"),
  title: {
    default: "TrustSilcon — Premium Body-Safe Silicone Wellness",
    template: "%s | TrustSilcon",
  },
  description:
    "Shop premium body-safe silicone intimate wellness products with discreet delivery across India. Adult wellness, COD available, plain packaging, fast shipping.",
  keywords: ["intimate wellness", "adult wellness", "body-safe silicone", "discreet delivery", "wellness products India", "TrustSilcon"],
  openGraph: {
    title: "TrustSilcon — Premium Intimate Wellness Products",
    description: "Body-safe silicone intimate wellness with discreet delivery across India.",
    siteName: "TrustSilcon",
    type: "website",
    images: [{ url: "/lgowithbg.png", width: 360, height: 180, alt: "TrustSilcon" }],
  },
  robots: { index: true, follow: true },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${geist.variable} h-full`}>
      <body className="min-h-full flex flex-col bg-white font-sans text-slate-800 antialiased">
        <CartProvider>
          <ToastProvider>
            <Analytics />
            <StoreShell>{children}</StoreShell>
          </ToastProvider>
        </CartProvider>
      </body>
    </html>
  );
}
