"use client";

import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { useCart } from "@/context/CartContext";
import { formatPrice, getDeliveryCharge } from "@/lib/utils";

export default function CartDrawer() {
  const { cart, cartOpen, closeCart, updateQuantity, removeFromCart, cartTotal, cartCount, cartSavings } = useCart();
  const router = useRouter();
  const delivery = getDeliveryCharge(cartTotal);

  if (!cartOpen) return null;

  return (
    <>
      <div className="fixed inset-0 z-[60] bg-black/40 backdrop-blur-sm animate-fade-in" onClick={closeCart} />
      <div className="fixed inset-y-0 right-0 z-[70] flex w-full max-w-md flex-col bg-white shadow-2xl animate-slide-in-right">
        <div className="flex items-center justify-between border-b border-slate-100 px-5 py-4">
          <div>
            <h2 className="text-lg font-bold text-slate-900">Your Bag</h2>
            <p className="text-xs text-slate-500">{cartCount} item{cartCount !== 1 ? "s" : ""}</p>
          </div>
          <button onClick={closeCart} className="flex h-9 w-9 items-center justify-center rounded-full hover:bg-slate-100" aria-label="Close cart">
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
          </button>
        </div>

        {cart.length === 0 ? (
          <div className="flex flex-1 flex-col items-center justify-center px-6 text-center">
            <div className="flex h-20 w-20 items-center justify-center rounded-full bg-sky-50 text-3xl">🛍️</div>
            <p className="mt-4 font-semibold text-slate-800">Your bag is empty</p>
            <p className="mt-1 text-sm text-slate-500">Discover premium wellness products</p>
            <Link href="/shop" onClick={closeCart} className="mt-6 rounded-full bg-sky-500 px-8 py-3 text-sm font-semibold text-white hover:bg-sky-600">
              Start Shopping
            </Link>
          </div>
        ) : (
          <>
            <div className="flex-1 overflow-y-auto px-5 py-4">
              <div className="space-y-4">
                {cart.map((item) => (
                  <div key={item.lineId || item.productId} className="flex gap-3 rounded-2xl bg-slate-50 p-3">
                    <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-xl bg-white">
                      {item.image ? (
                        <Image src={item.image} alt={item.name} fill className="object-cover" sizes="80px" />
                      ) : (
                        <div className="flex h-full items-center justify-center bg-sky-100 text-sky-300">TS</div>
                      )}
                    </div>
                    <div className="flex flex-1 flex-col">
                      <Link href={`/products/${item.slug}`} onClick={closeCart} className="line-clamp-2 text-sm font-medium text-slate-800 hover:text-sky-600">{item.name}</Link>
                      {(item.color || item.size) && (
                        <p className="mt-1 text-xs text-slate-500">
                          {[item.color && `Colour: ${item.color}`, item.size && `Size: ${item.size}`].filter(Boolean).join(" · ")}
                        </p>
                      )}
                      <p className="mt-1 text-sm font-bold text-slate-900">{formatPrice(item.price)}</p>
                      <div className="mt-auto flex items-center justify-between">
                        <div className="flex items-center rounded-lg border border-slate-200 bg-white">
                          <button onClick={() => updateQuantity(item.lineId || item.productId, item.quantity - 1)} className="px-2.5 py-1 text-slate-500">−</button>
                          <span className="min-w-[24px] text-center text-sm font-medium">{item.quantity}</span>
                          <button onClick={() => updateQuantity(item.lineId || item.productId, item.quantity + 1)} className="px-2.5 py-1 text-slate-500">+</button>
                        </div>
                        <button onClick={() => removeFromCart(item.lineId || item.productId)} className="text-xs text-red-500 hover:text-red-600">Remove</button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="border-t border-slate-100 bg-white p-5">
              {cartSavings > 0 && (
                <p className="mb-2 text-center text-xs font-medium text-emerald-600">You save {formatPrice(cartSavings)} on this order!</p>
              )}
              <div className="space-y-1.5 text-sm">
                <div className="flex justify-between text-slate-600"><span>Subtotal</span><span>{formatPrice(cartTotal)}</span></div>
                <div className="flex justify-between text-slate-600"><span>Delivery</span><span>{delivery === 0 ? "FREE" : formatPrice(delivery)}</span></div>
                <div className="flex justify-between pt-2 text-base font-bold text-slate-900"><span>Total</span><span>{formatPrice(cartTotal + delivery)}</span></div>
              </div>
              <button
                onClick={() => { closeCart(); router.push("/checkout"); }}
                className="mt-4 w-full rounded-full bg-[#0c1929] py-3.5 text-sm font-semibold text-white hover:bg-[#1e3a5f]"
              >
                Checkout
              </button>
              <button onClick={() => { closeCart(); router.push("/cart"); }} className="mt-2 w-full py-2 text-center text-sm font-medium text-sky-600 hover:text-sky-700">
                View Full Cart
              </button>
            </div>
          </>
        )}
      </div>
    </>
  );
}
