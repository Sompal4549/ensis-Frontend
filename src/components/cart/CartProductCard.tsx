import { formatCurrency } from "@/utils";
import { Heart, Minus, Plus } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useShop, type CartItem } from "@/context/ShopContext";
import { X } from "lucide-react";
import { getImageUrl } from "@/lib/api/api";

export default function CartProductCard({ item }: { item: CartItem }) {
  const {
    decreaseQuantity,
    increaseQuantity,
    removeFromCart,
    toggleLike,
    isLiked,
  } = useShop();
  const liked = isLiked(item.id);

  return (
<article className="grid grid-cols-[110px_1fr] gap-4 border-b border-[#d8d0c4] py-2 last:border-b-0 md:grid-cols-[130px_1fr]">
  {/* Product Image */}
  <Link
    href={`/products/${item.slug}`}
    className="relative h-[50px] overflow-hidden rounded-sm bg-[#eee7de] md:h-[70px]"
  >
    <Image
      src={getImageUrl(item.image, 200)}
      alt={item.name}
      fill
      loading="lazy"
      sizes="(max-width: 768px) 50px, 50px"
      className="object-fill"
    />
  </Link>

  {/* Content */}
  <div className="relative flex min-h-[50px] flex-col justify-between md:min-h-[70px]">
    {/* Remove */}
    <button
      type="button"
      aria-label={`Remove ${item.name}`}
      onClick={() => removeFromCart(item.id)}
      className="absolute right-0 top-0 inline-flex size-7 items-center justify-center text-[#6f675d] transition-colors hover:text-[#1a1a1a]"
    >
      <X size={16} />
    </button>

    <div className="pr-8">
      <Link href={`/products/${item.slug}`}>
        <h3 className="max-w-[420px] text-xs font-black uppercase leading-[1.35] text-[#101010] md:text-xs">
          {item.name}
        </h3>
      </Link>

      <p className="mt-2 text-xs text-[#4f4941]">
        {formatCurrency(item.price)}
      </p>
    </div>

    {/* Bottom Row */}
    <div className="mt-1 flex items-center justify-between gap-4">
      {/* Quantity */}
      <div className="flex items-center gap-4">
        <button
          type="button"
          aria-label={`Decrease ${item.name} quantity`}
          onClick={() => decreaseQuantity(item.id)}
          className="inline-flex size-6 items-center justify-center border border-[#d8d0c4] text-[#101010] transition-colors hover:bg-[#f8f5f0]"
        >
          <Minus size={13} />
        </button>

        <span className="inline-flex h-6 min-w-[28px] items-center justify-center bg-[#101010] px-2 text-xs font-semibold text-white">
          {item.quantity}
        </span>

        <button
          type="button"
          aria-label={`Increase ${item.name} quantity`}
          onClick={() => increaseQuantity(item.id)}
          className="inline-flex size-6 items-center justify-center border border-[#d8d0c4] text-[#101010] transition-colors hover:bg-[#f8f5f0]"
        >
          <Plus size={13} />
        </button>
      </div>

      {/* Save */}
      <button
        type="button"
        onClick={() => toggleLike(item)}
        className={`inline-flex h-6 items-center gap-1.5 border px-2 text-[10px] font-bold uppercase tracking-[0.12em] transition-colors rounded-md ${
          liked
            ? "border-red-500 bg-red-50 text-red-600"
            : "border-[#d8d0c4] text-[#4f4941] hover:bg-white"
        }`}
      >
        <Heart size={12} className={liked ? "fill-red-500" : ""} />
        {liked ? "Liked" : "Save"}
      </button>
    </div>
  </div>
</article>
  );
}