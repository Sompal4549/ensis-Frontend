"use client";

import { Heart, Minus, Plus, ShoppingCart, Zap } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useShop, type ShopProduct } from "@/context/ShopContext";
import { FaPhone, FaWhatsapp } from "react-icons/fa";

export default function ProductDetailActions({
  product,
  compact = false,
}: {
  product: ShopProduct;
  compact?: boolean;
}) {
   const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  const { addToCart, isInCart, isLiked, toggleLike } = useShop();
  const [quantity, setQuantity] = useState(1);
  const added = mounted && isInCart(product.id);
  const liked = mounted && isLiked(product.id);

  const addQuantityToCart = () => {
    Array.from({ length: quantity }).forEach(() => addToCart(product));
  };

  return (
    <div
      className={`flex ${
        compact
          ? "items-center gap-3"
          : "mt-5 flex-col gap-3"
      }`}
    >
      <div className="flex gap-2">

      <div className="inline-flex h-8 w-[120px] items-center justify-between overflow-hidden rounded-md border border-[#e5ded5] bg-white">
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
        className={`flex py-2 flex-1 items-center justify-center gap-2 rounded-md px-5 text-xs font-bold uppercase tracking-wide text-white transition-colors ${
          added ? "bg-[#8d6a3a]" : "bg-[#263016] hover:bg-[#101010]"
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
            className="flex py-2 items-center justify-center gap-2 rounded-md border border-[#263016] bg-white px-5 text-xs font-bold uppercase tracking-wide text-[#263016] transition-colors hover:bg-[#f6f0e8]"
            >
            <Zap size={15} />
            Buy Now
          </Link>

        </div>
        <div className="flex gap-2">
          <Link
            type="button"
            className={`flex flex-1 py-2 items-center justify-center gap-2 rounded-md border px-2 text-[10px] font-semibold uppercase tracking-wide transition-colors ${
              liked
              ? "border-red-500 bg-red-50 text-red-600"
              : "border-[#d8cbb9] bg-white text-[#263016] hover:bg-[#fbf8f2]"
            }`}
            href="wa.me/+919654900525"
            >
            <FaWhatsapp size={15} className={liked ? "fill-red-500" : ""} />
            Whatsapp Expert
          </Link>
        <Link
            type="button"
            className={`flex flex-1 py-2 items-center justify-center gap-2 rounded-md border px-2 text-[10px] font-semibold uppercase tracking-wide transition-colors ${
              liked
              ? "border-red-500 bg-red-50 text-red-600"
              : "border-[#d8cbb9] bg-white text-[#263016] hover:bg-[#fbf8f2]"
            }`}
            href="tel:+919654900525"
            >
            <FaPhone size={15} className={liked ? "fill-red-500" : ""} />
            Request Custom Design
          </Link>
          </div>
            </>
      )}
    </div>
  );
}
