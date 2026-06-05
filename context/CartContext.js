"use client";

import { createContext, useContext, useEffect, useState, useCallback } from "react";

const CartContext = createContext(null);
const CART_KEY = "trustsilcon_cart";
const RECENT_KEY = "trustsilcon_recent";
const NEWSLETTER_KEY = "trustsilcon_newsletter_dismissed";

export function CartProvider({ children }) {
  const [cart, setCart] = useState([]);
  const [recentlyViewed, setRecentlyViewed] = useState([]);
  const [loaded, setLoaded] = useState(false);
  const [cartOpen, setCartOpen] = useState(false);
  const [quickViewProduct, setQuickViewProduct] = useState(null);

  useEffect(() => {
    try {
      const saved = localStorage.getItem(CART_KEY);
      const recent = localStorage.getItem(RECENT_KEY);
      if (saved) setCart(JSON.parse(saved));
      if (recent) setRecentlyViewed(JSON.parse(recent));
    } catch {}
    setLoaded(true);
  }, []);

  useEffect(() => {
    if (loaded) localStorage.setItem(CART_KEY, JSON.stringify(cart));
  }, [cart, loaded]);

  useEffect(() => {
    document.body.style.overflow = cartOpen || quickViewProduct ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [cartOpen, quickViewProduct]);

  const addToCart = useCallback((product, quantity = 1, openDrawer = true) => {
    setCart((prev) => {
      const id = product._id || product.productId;
      const existing = prev.find((item) => item.productId === id);
      if (existing) {
        return prev.map((item) =>
          item.productId === id ? { ...item, quantity: item.quantity + quantity } : item
        );
      }
      return [
        ...prev,
        {
          productId: id,
          name: product.name,
          slug: product.slug,
          price: product.price,
          comparePrice: product.comparePrice || 0,
          image: product.images?.[0]?.url || product.image || "",
          quantity,
          stock: product.stock,
        },
      ];
    });
    if (openDrawer) setCartOpen(true);
  }, []);

  const removeFromCart = useCallback((productId) => {
    setCart((prev) => prev.filter((item) => item.productId !== productId));
  }, []);

  const updateQuantity = useCallback((productId, quantity) => {
    if (quantity <= 0) {
      setCart((prev) => prev.filter((item) => item.productId !== productId));
      return;
    }
    setCart((prev) =>
      prev.map((item) => (item.productId === productId ? { ...item, quantity } : item))
    );
  }, []);

  const clearCart = useCallback(() => setCart([]), []);
  const openCart = useCallback(() => setCartOpen(true), []);
  const closeCart = useCallback(() => setCartOpen(false), []);

  const addRecentlyViewed = useCallback((product) => {
    setRecentlyViewed((prev) => {
      const filtered = prev.filter((p) => p._id !== product._id);
      const updated = [{
        _id: product._id, name: product.name, slug: product.slug,
        price: product.price, comparePrice: product.comparePrice,
        image: product.images?.[0]?.url || "",
      }, ...filtered].slice(0, 8);
      localStorage.setItem(RECENT_KEY, JSON.stringify(updated));
      return updated;
    });
  }, []);

  const cartTotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);
  const cartSavings = cart.reduce((sum, item) => {
    const save = (item.comparePrice || 0) - item.price;
    return sum + (save > 0 ? save * item.quantity : 0);
  }, 0);

  return (
    <CartContext.Provider
      value={{
        cart, cartTotal, cartCount, cartSavings, cartOpen,
        addToCart, removeFromCart, updateQuantity, clearCart,
        openCart, closeCart, setCartOpen,
        quickViewProduct, setQuickViewProduct,
        recentlyViewed, addRecentlyViewed, loaded,
        newsletterDismissed: () => typeof window !== "undefined" && localStorage.getItem(NEWSLETTER_KEY),
        dismissNewsletter: () => localStorage.setItem(NEWSLETTER_KEY, "1"),
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within CartProvider");
  return ctx;
}
