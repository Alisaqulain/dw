"use client";

import { useCart } from "@/context/CartContext";
import Image from "next/image";
import Link from "next/link";
import { formatPrice, getDeliveryCharge } from "@/lib/utils";
import { EmptyState } from "@/components/ui/Loading";

export default function CartPage() {
  const { cart, cartTotal, updateQuantity, removeFromCart } = useCart();
  const deliveryCharge = getDeliveryCharge(cartTotal);

  if (cart.length === 0) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <EmptyState
          title="Your cart is empty"
          description="Browse our premium wellness collection and add items to your cart."
          action={<Link href="/shop" className="rounded-xl bg-sky-500 px-6 py-2.5 text-sm font-semibold text-white">Shop Now</Link>}
        />
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <h1 className="text-3xl font-bold text-slate-800">Shopping Cart</h1>
      <div className="mt-8 grid gap-8 lg:grid-cols-3">
        <div className="space-y-4 lg:col-span-2">
          {cart.map((item) => (
            <div key={item.lineId || item.productId} className="flex gap-4 rounded-2xl bg-white p-4 shadow-sm ring-1 ring-sky-100">
              <div className="relative h-24 w-24 shrink-0 overflow-hidden rounded-xl bg-sky-50">
                {item.image ? (
                  <Image src={item.image} alt={item.name} fill className="object-cover" sizes="96px" />
                ) : (
                  <div className="flex h-full items-center justify-center bg-sky-100" />
                )}
              </div>
              <div className="flex flex-1 flex-col">
                <Link href={`/products/${item.slug}`} className="font-semibold text-slate-800 hover:text-sky-600">{item.name}</Link>
                {(item.color || item.size) && (
                  <p className="mt-1 text-sm text-slate-500">
                    {[item.color && `Colour: ${item.color}`, item.size && `Size: ${item.size}`].filter(Boolean).join(" · ")}
                  </p>
                )}
                <p className="mt-1 text-lg font-bold text-slate-800">{formatPrice(item.price)}</p>
                <div className="mt-auto flex items-center justify-between">
                  <div className="flex items-center rounded-lg border border-sky-100">
                    <button onClick={() => updateQuantity(item.lineId || item.productId, item.quantity - 1)} className="px-2.5 py-1 text-slate-500">−</button>
                    <span className="px-3 text-sm font-medium">{item.quantity}</span>
                    <button onClick={() => updateQuantity(item.lineId || item.productId, item.quantity + 1)} className="px-2.5 py-1 text-slate-500">+</button>
                  </div>
                  <button onClick={() => removeFromCart(item.lineId || item.productId)} className="text-sm text-red-500 hover:text-red-600">Remove</button>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-sky-100 h-fit">
          <h2 className="text-lg font-bold text-slate-800">Order Summary</h2>
          <div className="mt-4 space-y-3 text-sm">
            <div className="flex justify-between"><span className="text-slate-500">Subtotal</span><span>{formatPrice(cartTotal)}</span></div>
            <div className="flex justify-between"><span className="text-slate-500">Delivery</span><span>{deliveryCharge === 0 ? "FREE" : formatPrice(deliveryCharge)}</span></div>
            {cartTotal < 999 && <p className="text-xs text-sky-500">Add {formatPrice(999 - cartTotal)} more for free delivery</p>}
            <div className="border-t border-sky-100 pt-3 flex justify-between font-bold text-lg">
              <span>Total</span><span>{formatPrice(cartTotal + deliveryCharge)}</span>
            </div>
          </div>
          <Link href="/checkout" className="mt-6 block w-full rounded-2xl bg-gradient-to-r from-sky-500 to-sky-400 py-3.5 text-center font-semibold text-white shadow-lg shadow-sky-200">
            Proceed to Checkout
          </Link>
        </div>
      </div>
    </div>
  );
}
