"use client";

import { Heart, ShoppingCart } from "lucide-react";
import { useShop, type ShopProduct } from "@/context/ShopContext";

export default function ProductDetailActions({
  product,
}: {
  product: ShopProduct;
}) {
  const { addToCart, isInCart, isLiked, toggleLike } = useShop();
  const added = isInCart(product.id);
  const liked = isLiked(product.id);

  return (
    <div className="mt-4 flex flex-wrap gap-3">
      <button
        type="button"
        onClick={() => addToCart(product)}
        className={`inline-flex items-center justify-center gap-2 rounded-md px-2 py-2 text-xs font-bold uppercase tracking-wide text-white transition-colors ${
          added ? "bg-[#8d6a3a]" : "bg-[#263016] hover:bg-[#101010]"
        }`}
      >
        <ShoppingCart size={15} />
        {added ? "Added to Cart" : "Add to Cart"}
      </button>

      <button
        type="button"
        onClick={() => toggleLike(product)}
        className={`inline-flex items-center justify-center gap-2 rounded-md border px-2 py-2 text-xs font-bold uppercase tracking-wide transition-colors ${
          liked
            ? "border-red-500 bg-red-50 text-red-600"
            : "border-[#d8cbb9] bg-white text-[#263016] hover:bg-[#fbf8f2]"
        }`}
      >
        <Heart size={15} className={liked ? "fill-red-500" : ""} />
        {liked ? "Wishlisted" : "Add to Wishlist"}
      </button>
    </div>
  );
}
