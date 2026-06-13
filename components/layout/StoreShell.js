"use client";

import { usePathname } from "next/navigation";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import WhatsAppButton from "@/components/layout/WhatsAppButton";
import MobileBottomNav from "@/components/layout/MobileBottomNav";
import CartDrawer from "@/components/cart/CartDrawer";
import QuickViewModal from "@/components/product/QuickViewModal";
import ExitIntentPopup from "@/components/home/ExitIntentPopup";
import NewsletterPopup from "@/components/home/NewsletterPopup";
import AgeVerification from "@/components/legal/AgeVerification";
import CookieConsent from "@/components/legal/CookieConsent";
import { useCart } from "@/context/CartContext";
import { getAgeVerified } from "@/lib/consent";
import { useEffect, useState, Suspense } from "react";

function MobileBottomNavWrapper() {
  return (
    <Suspense fallback={null}>
      <MobileBottomNav />
    </Suspense>
  );
}

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
          <main className="flex-1 pb-[calc(4.25rem+env(safe-area-inset-bottom,0px))] lg:pb-0">{children}</main>
          <Footer />
          <MobileBottomNavWrapper />
          <WhatsAppButton />
          <CookieConsent />
          {loaded && (
            <>
              <CartDrawer />
              <QuickViewModal />
              <ExitIntentPopup />
              <NewsletterPopup />
            </>
          )}
        </>
      )}
    </>
  );
}
