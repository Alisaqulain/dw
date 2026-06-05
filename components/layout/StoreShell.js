"use client";

import { usePathname } from "next/navigation";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import WhatsAppButton from "@/components/layout/WhatsAppButton";
import CartDrawer from "@/components/cart/CartDrawer";
import QuickViewModal from "@/components/product/QuickViewModal";
import NewsletterPopup from "@/components/home/NewsletterPopup";
import AgeVerification from "@/components/legal/AgeVerification";
import CookieConsent from "@/components/legal/CookieConsent";
import { useCart } from "@/context/CartContext";
import { getAgeVerified } from "@/lib/consent";
import { useEffect, useState } from "react";

export default function StoreShell({ children }) {
  const pathname = usePathname();
  const isAdmin = pathname?.startsWith("/admin");
  const { loaded } = useCart();
  const [ageOk, setAgeOk] = useState(false);

  useEffect(() => {
    setAgeOk(getAgeVerified());
    const handler = () => setAgeOk(true);
    window.addEventListener("age-verified", handler);
    return () => window.removeEventListener("age-verified", handler);
  }, []);

  if (isAdmin) return <>{children}</>;

  return (
    <>
      <AgeVerification />
      {ageOk && (
        <>
          <Header />
          <main className="flex-1">{children}</main>
          <Footer />
          <WhatsAppButton />
          <CookieConsent />
          {loaded && (
            <>
              <CartDrawer />
              <QuickViewModal />
              <NewsletterPopup />
            </>
          )}
        </>
      )}
    </>
  );
}
