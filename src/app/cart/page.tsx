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

const formatCurrency = (amount: number) =>
  `\u20b9${amount.toLocaleString("en-IN")}`;

function CartProductCard({ item }: { item: CartItem }) {
  const {
    decreaseQuantity,
    increaseQuantity,
    removeFromCart,
    toggleLike,
    isLiked,
  } = useShop();
  const liked = isLiked(item.id);

  return (
    <article className="grid gap-5 border-b border-[#d8d0c4] py-7 last:border-b-0 md:grid-cols-[220px_1fr] md:gap-8">
      <Link
        href={`/products/${item.slug}`}
        className="relative aspect-[1.15/1] overflow-hidden bg-[#eee7de]"
      >
        <Image
          src={item.image}
          alt={item.name}
          fill
          sizes="(max-width: 768px) 100vw, 220px"
          className="object-cover"
        />
      </Link>

      <div className="relative pr-10">
        <button
          type="button"
          aria-label={`Remove ${item.name}`}
          onClick={() => removeFromCart(item.id)}
          className="absolute right-0 top-0 inline-flex size-8 items-center justify-center text-[#6f675d] transition-colors hover:text-[#1a1a1a]"
        >
          <X size={20} />
        </button>

        <p className="mb-2 text-[10px] font-bold uppercase tracking-[0.22em] text-[#c8a45d]">
          {item.category}
        </p>
        <Link href={`/products/${item.slug}`}>
          <h2 className="max-w-[560px] text-2xl font-black uppercase leading-tight text-[#101010] md:text-3xl">
            {item.name}
          </h2>
        </Link>

        <p className="mt-3 text-base text-[#4f4941]">
          {formatCurrency(item.price)}
        </p>

        <div className="mt-7 flex flex-wrap items-center gap-6">
          <div>
            <p className="mb-3 text-xs font-black uppercase text-[#101010]">
              Quantity
            </p>
            <div className="flex h-9 items-center gap-3">
              <button
                type="button"
                aria-label={`Decrease ${item.name} quantity`}
                onClick={() => decreaseQuantity(item.id)}
                className="inline-flex size-8 items-center justify-center border border-transparent text-[#101010] transition-colors hover:border-[#d8d0c4]"
              >
                <Minus size={14} />
              </button>
              <span className="inline-flex size-8 items-center justify-center bg-[#101010] text-lg font-semibold text-white">
                {item.quantity}
              </span>
              <button
                type="button"
                aria-label={`Increase ${item.name} quantity`}
                onClick={() => increaseQuantity(item.id)}
                className="inline-flex size-8 items-center justify-center border border-transparent text-[#101010] transition-colors hover:border-[#d8d0c4]"
              >
                <Plus size={14} />
              </button>
            </div>
          </div>

          <button
            type="button"
            onClick={() => toggleLike(item)}
            className={`inline-flex items-center gap-2 border px-4 py-2 text-xs font-bold uppercase tracking-wide transition-colors ${
              liked
                ? "border-red-500 bg-red-50 text-red-600"
                : "border-[#d8d0c4] text-[#4f4941] hover:bg-white"
            }`}
          >
            <Heart size={15} className={liked ? "fill-red-500" : ""} />
            {liked ? "Liked" : "Save"}
          </button>
        </div>
      </div>
    </article>
  );
}

export default function CartPage() {
  const { cartItems, clearCart, subtotal } = useShop();
  const hasItems = cartItems.length > 0;
  const taxLabel = "Included";

  return (
    <div className="min-h-screen bg-[#fbf8f2] py-8 text-[#101010] md:py-12">
      <Container>
        <div className="mb-7 flex flex-wrap items-center justify-between gap-4">
          <div>
            <Link
              href="/products"
              className="mb-4 inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.16em] text-[#6f675d] transition-colors hover:text-[#263016]"
            >
              <ArrowLeft size={15} />
              Continue Shopping
            </Link>
            <h1 className="text-4xl font-black uppercase leading-none text-[#101010] md:text-5xl">
              Your Cart
            </h1>
          </div>

          {hasItems && (
            <button
              type="button"
              onClick={clearCart}
              className="inline-flex items-center gap-2 border border-[#d8d0c4] bg-white px-4 py-3 text-xs font-bold uppercase tracking-wide text-[#4f4941] transition-colors hover:bg-[#f2ebe1]"
            >
              <Trash2 size={15} />
              Clear Cart
            </button>
          )}
        </div>

        {hasItems ? (
          <div className="grid gap-10 lg:grid-cols-[1fr_400px] lg:items-start">
            <div className="bg-[#fbf8f2]">
              {cartItems.map((item) => (
                <CartProductCard key={item.id} item={item} />
              ))}
            </div>

            <aside className="bg-[#f0eee9] p-6 lg:sticky lg:top-28">
              <div className="space-y-5">
                {cartItems.map((item) => (
                  <div
                    key={item.id}
                    className="flex items-start justify-between gap-4 text-sm uppercase"
                  >
                    <span className="leading-6">
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

                <div className="border-t border-[#9c968e] pt-5">
                  <div className="flex items-center justify-between text-sm uppercase">
                    <span>Sales Tax</span>
                    <span>{taxLabel}</span>
                  </div>
                </div>

                <div className="border-t border-[#9c968e] pt-6">
                  <div className="flex items-center justify-between text-base font-black uppercase">
                    <span>Total</span>
                    <span>{formatCurrency(subtotal)}</span>
                  </div>
                </div>

                <button className="flex w-full items-center justify-center gap-3 bg-[#101010] px-5 py-4 text-sm font-bold uppercase tracking-wide text-white transition-colors hover:bg-[#263016]">
                  <ShoppingBag size={17} />
                  Proceed To Checkout
                </button>
              </div>
            </aside>
          </div>
        ) : (
          <div className="flex min-h-[420px] flex-col items-center justify-center border border-[#e3d9cb] bg-white px-6 text-center">
            <ShoppingBag size={42} className="mb-5 text-[#c8a45d]" />
            <h2 className="text-2xl font-black uppercase text-[#101010]">
              Your cart is empty
            </h2>
            <p className="mt-3 max-w-md text-sm leading-6 text-[#6f675d]">
              Select wellness equipment from the products page and it will
              appear here with quantity controls and order totals.
            </p>
            <Link
              href="/products"
              className="mt-7 inline-flex bg-[#263016] px-6 py-3 text-xs font-bold uppercase tracking-wide text-white transition-colors hover:bg-[#101010]"
            >
              Browse Products
            </Link>
          </div>
        )}
      </Container>
    </div>
  );
}
