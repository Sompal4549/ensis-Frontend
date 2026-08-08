"use client";

import {  Minus, Plus, ShoppingCart} from "lucide-react";
import Link from "next/link";
import { useEffect, useState, type ReactNode } from "react";
import { useShop, type ShopProduct } from "@/context/ShopContext";
import { FaPhone, FaWhatsapp } from "react-icons/fa";

export default function ProductDetailActions({
  product,
  compact = false,
  twoRows = false,
  trailing,
  finish,
  size,
}: {
  product: ShopProduct;
  compact?: boolean;
  twoRows?: boolean;
  trailing?: ReactNode;
  finish?: string;
  size?: string;
}) {
   const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  const { addToCart, isInCart, toggleLike } = useShop();
  const [quantity, setQuantity] = useState(1);
  const added = mounted && isInCart(product.id, { finish, size });

  const addQuantityToCart = () => {
    Array.from({ length: quantity }).forEach(() => addToCart(product, { finish, size }));
  };

  return (
    <div
      className={
        twoRows
          ? "mt-5 grid gap-4"
          : `flex ${
              compact
                ? "items-center gap-4"
                : "mt-5 flex-col gap-4"
            }`
      }
    >
      {twoRows ? (
        <>
          {/* ROW 1 — qty + add to cart + buy now */}
          <div className="grid gap-4 sm:grid-cols-[120px_1fr_1fr]">
            <div className="inline-flex h-10 w-full items-center justify-between overflow-hidden rounded-md border border-[#e5ded5] bg-white">
              <button
                type="button"
                aria-label="Decrease quantity"
                onClick={() => setQuantity((value) => Math.max(1, value - 1))}
                className="flex h-full w-10 items-center justify-center text-[#313b30] transition-colors hover:bg-[#f6f0e8]"
              >
                <Minus size={15} />
              </button>
              <span className="min-w-8 text-center text-sm font-semibold text-[#1a1a1a]">
                {quantity}
              </span>
              <button
                type="button"
                aria-label="Increase quantity"
                onClick={() => setQuantity((value) => value + 1)}
                className="flex h-full w-10 items-center justify-center text-[#313b30] transition-colors hover:bg-[#f6f0e8]"
              >
                <Plus size={15} />
              </button>
            </div>

            <button
              type="button"
              onClick={addQuantityToCart}
              className={`flex py-2.5 items-center justify-center gap-4 rounded-md px-5 text-xs font-semibold uppercase tracking-wide text-white transition-colors ${
                added ? "bg-[#313d1c]" : "bg-[#263016] hover:bg-[#101010]"
              }`}
            >
              {added ? "Added to Cart" : "Add to Cart"}
              <ShoppingCart size={15} />
            </button>

            <Link
              href="/cart"
              onClick={addQuantityToCart}
              className="flex py-2.5 items-center justify-center gap-4 rounded-md border border-[#c48734] bg-[#c48734] px-5 text-xs font-semibold uppercase tracking-wide text-white transition-colors hover:bg-[#c48734]"
            >
              Buy Now
            </Link>
          </div>

          {/* ROW 2 — whatsapp + custom + trailing */}
          <div className="grid items-stretch gap-4 sm:grid-cols-3">
            <Link
              type="button"
              className="flex h-full py-2.5 items-center justify-center gap-4 rounded-md border border-[#d8cbb9] bg-white px-2 text-[9px] font-semibold uppercase tracking-wide text-[#263016] transition-colors hover:bg-[#fbf8f2]"
              href="wa.me/+919654900525"
            >
              <FaWhatsapp size={15} />
              Whatsapp Expert
            </Link>
            <Link
              type="button"
              className="flex h-full py-2.5 items-center justify-center gap-4 rounded-md border border-[#d8cbb9] bg-white px-2 text-[9px] font-semibold uppercase tracking-wide text-[#263016] transition-colors hover:bg-[#fbf8f2]"
              href="tel:+919654900525"
            >
              <FaPhone size={15} />
              Request Custom Design
            </Link>
            {trailing}
          </div>
        </>
      ) : (
        <>
          <div className="flex gap-4">

          <div className="inline-flex h-10 w-[120px] items-center justify-between overflow-hidden rounded-md border border-[#e5ded5] bg-white">
            <button
              type="button"
              aria-label="Decrease quantity"
              onClick={() => setQuantity((value) => Math.max(1, value - 1))}
              className="flex h-full w-10 items-center justify-center text-[#313b30] transition-colors hover:bg-[#f6f0e8]"
            >
              <Minus size={15} />
            </button>
            <span className="min-w-8 text-center text-sm font-semibold text-[#1a1a1a]">
              {quantity}
            </span>
            <button
              type="button"
              aria-label="Increase quantity"
              onClick={() => setQuantity((value) => value + 1)}
              className="flex h-full w-10 items-center justify-center text-[#313b30] transition-colors hover:bg-[#f6f0e8]"
            >
              <Plus size={15} />
            </button>
          </div>

          <button
            type="button"
            onClick={addQuantityToCart}
            className={`flex py-2.5 flex-1 items-center justify-center gap-4 rounded-md px-5 text-xs font-semibold uppercase tracking-wide text-white transition-colors ${
              added ? "bg-[#313d1c]" : "bg-[#263016] hover:bg-[#101010]"
            }`}
          >
            {added ? "Added to Cart" : "Add to Cart"}
            <ShoppingCart size={15} />
          </button>
          </div>

          {!compact && (
            <>
            <div className="">
              <Link
                href="/cart"
                onClick={addQuantityToCart}
                className="flex py-2.5 items-center justify-center gap-4 rounded-md border border-[#c48734]  bg-[#c48734] px-5 text-xs font-semibold uppercase tracking-wide text-white transition-colors hover:bg-[#c48734] "
                >
                  <span className="text-white">
                Buy Now
                </span>
              </Link>

            </div>
            <div className="flex gap-4">
              <Link
                type="button"
                className="flex flex-1 py-2.5 items-center justify-center gap-4 rounded-md border border-[#d8cbb9] bg-white px-2 text-[9px] font-semibold uppercase tracking-wide text-[#263016] transition-colors hover:bg-[#fbf8f2]"
                href="wa.me/+919654900525"
                >
                <FaWhatsapp size={15} />
                Whatsapp Expert
              </Link>
            <Link
                type="button"
                className={`flex flex-1 py-2.5 items-center justify-center gap-4 rounded-md border border-[#d8cbb9] bg-white px-2 text-[9px] font-semibold uppercase tracking-wide text-[#263016] hover:bg-[#fbf8f2] transition-colors `}
                href="tel:+919654900525"
                >
                <FaPhone size={15} />
                Request Custom Design
              </Link>
              </div>
                </>
          )}
        </>
      )}
    </div>
  );
}
