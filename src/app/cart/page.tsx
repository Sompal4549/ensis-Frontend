"use client";

import Image from "next/image";
import Link from "next/link";
import {
  ArrowLeft,
  Heart,
  Minus,
  Plus,
  ShoppingBag,
  Trash2,
  X,
} from "lucide-react";
import { useShop, type CartItem } from "@/context/ShopContext";
import { Container } from "@/components/ui/Container";
import BookButton from "@/components/ui/BookButton";
import CartProductCard from "@/components/cart/CartProductCard";
import { formatCurrency } from "@/utils";



export default function CartPage() {
  const { cartItems, clearCart, subtotal } = useShop();
  const hasItems = cartItems.length > 0;
  const taxLabel = "Included";

  return (
    <div className="min-h-screen bg-[#fbf8f2] py-8 text-[#101010] md:py-12">
      <Container>
        <div className="mb-2 flex flex-wrap items-center justify-between gap-4">
          <div>
            <Link
              href="/products"
              className="mb-4 inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.16em] text-[#6f675d] transition-colors hover:text-[#263016]"
            >
              <ArrowLeft size={15} />
              Continue Shopping
            </Link>
            <h2 className="text-xl font-black uppercase leading-none text-[#101010] md:text-2xl mb-4">
              Your Cart
            </h2>
          </div>

          {hasItems && (
            <button
              type="button"
              onClick={clearCart}
              className="inline-flex items-center gap-2 border border-[#d8d0c4] bg-white px-4 py-2 rounded-md text-xs font-bold uppercase tracking-wide text-[#4f4941] transition-colors hover:bg-[#f2ebe1]"
            >
              <Trash2 size={15} />
              Clear Cart
            </button>
          )}
        </div>

        {hasItems ? (
          <div className="grid gap-5 lg:grid-cols-[1fr_400px] lg:items-start">
            <div className="bg-[#fbf8f2]">
              {cartItems.map((item) => (
                <CartProductCard key={item.id} item={item} />
              ))}
            </div>

            <aside className="bg-[#f0eee9] p-4 lg:sticky lg:top-28">
              <div className="space-y-2">
                {cartItems.map((item) => (
                  <div
                    key={item.id}
                    className="flex items-start justify-between gap-2 text-xs uppercase"
                  >
                    <span className="">
                      {item.name}
                      {item.quantity > 1 && (
                        <span className="text-[#6f675d]">
                          {" "}
                          x{item.quantity}
                        </span>
                      )}
                    </span>
                    <span className="shrink-0">
                      {formatCurrency(item.price * item.quantity)}
                    </span>
                  </div>
                ))}

                <div className="border-t border-[#9c968e] pt-2">
                  <div className="flex items-center justify-between text-sm font-black uppercase">
                    <span>Total</span>
                    <span>{formatCurrency(subtotal)}</span>
                  </div>
                </div>

              <div className="mt-4 max-w-54 mx-auto">
                <BookButton leftIcon={<ShoppingBag size={17} className="mr-2" />} text=" Proceed To Checkout" path="/products"/> 
                </div>
              </div>
            </aside>
          </div>
        ) : (
          <div className="flex min-h-[420px] flex-col items-center justify-center border border-[#e3d9cb] bg-white px-6 text-center">
            <ShoppingBag size={42} className="mb-5 text-[#c8a45d]" />
            <h2 className="text-2xl font-black uppercase text-[#101010]">
              Your cart is empty
            </h2>
            <p className="mt-3 max-w-md text-sm">
              Select wellness equipment from the products page and it will
              appear here with quantity controls and order totals.
            </p>
            <div className="mt-7">

            <BookButton text="Browse Products" path="/products"/>
            </div>
          </div>
        )}
      </Container>
    </div>
  );
}
