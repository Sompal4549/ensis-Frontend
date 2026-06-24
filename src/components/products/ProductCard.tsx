import { useState } from "react";
import { fmt } from "./Products";
import Image, { type StaticImageData } from "next/image";
import Link from "next/link";
import { useShop, type ShopProduct } from "@/context/ShopContext";
import type { Product } from "@/constants"

export default function ProductCard({ product }: { product: Product }) {
  const { isInCart, isLiked } = useShop();
  const shopProduct: ShopProduct = {
    id: product.id.toString(),
    slug: product.slug,
    name: product.name || product.title, // Use product.title as fallback for name
    category: product.category,
    price: product.price,
    image: typeof product.image === "string" ? product.image : product.image.src,
  };
  const wished = isLiked(shopProduct.id);
  const added = isInCart(shopProduct.id);

  return (
    <div className="group relative bg-white rounded-[18px] overflow-hidden border border-[#ede8e0] hover:shadow-[0_4px_18px_rgba(0,0,0,0.07)] transition-all duration-300">
      <Link href={`/products/${product.slug}`} className="block">
        <div className="relative h-32 sm:h-36 overflow-hidden bg-[#f8f3ec]">
          <Image
            src={product.image}
            alt={product.name}
            fill
            sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw"
            crossOrigin="anonymous"
            className="object-cover group-hover:scale-105 transition-transform duration-500"
          />
        </div>
      </Link>

      {/* <button
        type="button"
        aria-label={wished ? "Remove from wishlist" : "Add to wishlist"}
        onClick={() => toggleLike(shopProduct)}
        className="absolute top-2.5 right-2.5 w-7 h-7 rounded-full bg-white/85 backdrop-blur-sm flex items-center justify-center shadow-sm hover:scale-110 transition-transform"
      >
        <Heart
          size={13}
          className={
            wished ? "fill-red-500 text-red-500" : "text-[#9a8870]"
          }
        />
      </button> */}

      <div className="p-2.5 sm:p-3 h-[90px] flex flex-col justify-between">
        {/* <p
          className="text-[8px] sm:text-[9px] font-[600] tracking-[0.14em] mb-1 uppercase"
          style={{ color: "#c8a45d" }}
        >
          {product.category}
        </p> */}

        <Link href={`/products/${product.id}`} className="block">
          <h3 className="ws-body text-[12px] sm:text-[13px] font-[500] text-[#1a1a1a] leading-[1.35] mb-1 line-clamp-2">
            {product.name}
          </h3>
        </Link>

        <div className="mt-auto">
          <span className="text-sm font-[600] text-[#1a1a1a]">
            {fmt(product.price)}
          </span>

          {/* <button
            type="button"
            aria-label={added ? "Add one more to cart" : "Add to cart"}
            onClick={() => addToCart(shopProduct)}
            className={`w-7 h-7 rounded-full border border-[#c8a45d] flex items-center justify-center transition-colors group/cart ${
              added ? "bg-[#c8a45d]" : "hover:bg-[#c8a45d]"
            }`}
          >
            <ShoppingCart
              size={13}
              className={`transition-colors ${
                added
                  ? "text-white"
                  : "text-[#c8a45d] group-hover/cart:text-white"
              }`}
            />
          </button> */}
        </div>
      </div>
    </div>
  );
}

export function Checkbox({ label }: { label: string }) {
  const [checked, setChecked] = useState(false);

  return (
    <label className="flex items-center gap-2.5 cursor-pointer group">
      <div
        onClick={() => setChecked((c) => !c)}
        className={`w-4 h-4 rounded border flex items-center justify-center shrink-0 transition-colors ${checked
            ? "bg-[#183b17] border-[#183b17]"
            : "bg-white"
          }`}
      >
        {checked && (
          <svg width="9" height="7" viewBox="0 0 9 7" fill="none">
            <path
              d="M1 3.5L3.5 6L8 1"
              stroke="white"
              strokeWidth="1.6"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        )}
      </div>

      <span className="text-[12px] font-medium group-hover:text-[#1a1a1a] transition-colors">
        {label}
      </span>
    </label>
  );
}
