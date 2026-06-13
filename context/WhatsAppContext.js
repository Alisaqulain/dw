"use client";

import { createContext, useContext, useState, useCallback } from "react";

const WhatsAppContext = createContext(null);

export function WhatsAppProvider({ children }) {
  const [productName, setProductName] = useState(null);

  const clearProduct = useCallback(() => setProductName(null), []);

  return (
    <WhatsAppContext.Provider value={{ productName, setProductName, clearProduct }}>
      {children}
    </WhatsAppContext.Provider>
  );
}

export function useWhatsAppContext() {
  const ctx = useContext(WhatsAppContext);
  if (!ctx) throw new Error("useWhatsAppContext must be used within WhatsAppProvider");
  return ctx;
}
