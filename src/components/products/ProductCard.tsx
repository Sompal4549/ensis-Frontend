"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowRight, Heart } from "lucide-react";
import { useShop, type ShopProduct } from "@/context/ShopContext";
import { getImageUrl } from "@/lib/api/api";

export const formatPrice = (n: number | string | undefined) =>
  "₹" + Number(n || 0).toLocaleString("en-IN");

function categoryLabel(category: any): string {
  if (!category) return "";
  if (typeof category === "string") return category;
  return category?.name || category?.label || category?.slug || "";
}

function resolveBadge(product: any): string | null {
  const tags: string[] = Array.isArray(product?.tags)
    ? product.tags.map((t: any) => String(t || "").trim().toUpperCase())
    : [];
  if (tags.includes("NEW")) return "NEW";
  if (tags.includes("BESTSELLER") || tags.includes("BEST SELLER"))
    return "BESTSELLER";
  if (product?.isFeatured || tags.includes("PREMIUM")) return "PREMIUM";
  return null;
}

export default function ProductCard({
  product,
  badge,
}: {
  product: any;
  badge?: string;
}) {
  const { toggleLike, isLiked, addToCart } = useShop();
  const router = useRouter();
  const addingRef = useRef(false);

  const id = String(product?.id ?? product?._id ?? "");
  const slug = product?.slug || id;
  const title = product?.title || product?.name || "";
  const category = categoryLabel(product?.category);
  const imageSrc = product?.images?.[0] || product?.image || "";
  const displayBadge = badge || resolveBadge(product);

  const shopProduct: ShopProduct = {
    id,
    slug,
    name: title,
    category,
    price: Number(product?.price || 0),
    image:
      typeof imageSrc === "string"
        ? imageSrc.startsWith("data:")
          ? imageSrc
          : getImageUrl(imageSrc, 700)
        : "",
  };
  const wished = isLiked(shopProduct.id);

  return (
    <div className="group relative flex h-full w-full max-w-[312px] flex-col overflow-hidden rounded-[20px] border border-[#e6d6b9] bg-[#fdfaf3] shadow-[0_8px_24px_rgba(139,107,55,0.08)] transition-all duration-500 hover:-translate-y-[3px] hover:shadow-[0_18px_44px_rgba(139,107,55,0.16)] mx-auto">
      {/* Image */}
      <Link
        href={`/products/${slug}`}
        className="relative block aspect-[4/3] w-full overflow-hidden bg-[#f3ecdc]"
      >
        {imageSrc ? (
          <Image
            src={shopProduct.image}
            alt={title}
            fill
            sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw"
            crossOrigin="anonymous"
            loading="lazy"
            className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.05]"
          />
        ) : (
          <div className="h-full w-full bg-[#f3ecdc]" />
        )}
      </Link>

      {/* Badge */}
      {displayBadge && (
        <span className="absolute left-4 top-4 z-10 rounded-full bg-[#173A2B] px-3 py-1 text-[9px] font-semibold uppercase tracking-[0.18em] text-[#E4C37F] shadow-[0_2px_10px_rgba(23,58,43,0.25)]">
          {displayBadge}
        </span>
      )}

      {/* Wishlist */}
      <button
        type="button"
        aria-label={wished ? "Remove from wishlist" : "Add to wishlist"}
        onClick={() => toggleLike(shopProduct)}
        className="absolute right-3 top-3 z-10 flex h-8 w-8 items-center justify-center rounded-full border border-[#e6d6b9] bg-white/90 shadow-[0_2px_10px_rgba(139,107,55,0.12)] backdrop-blur-sm transition-transform duration-300 hover:scale-110"
      >
        <Heart
          size={16}
          className={
            wished
              ? "fill-[#b8863b] text-[#b8863b]"
              : "text-[#8a6a3a]"
          }
        />
      </button>

      {/* Content */}
      <div className="flex flex-1 flex-col px-4 pb-4 pt-3">
        <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-[#c8a45d]">
          {category || "ENSIS WELLNESS"}
        </p>

        <Link href={`/products/${slug}`} className="mt-1 block">
          <h3 className="line-clamp-1 text-[15px] font-semibold leading-snug text-[#173A2B] transition-colors duration-300 group-hover:text-[#b8863b]">
            {title}
          </h3>
        </Link>

        <p className="mt-1.5 text-[17px] font-bold text-[#b8863b]">
          {formatPrice(product?.price)}
        </p>

        <button
          type="button"
          onClick={() => {
            if (addingRef.current) return;
            addingRef.current = true;
            addToCart(shopProduct);
            router.push("/checkout");
            setTimeout(() => { addingRef.current = false; }, 1000);
          }}
          className="mt-auto inline-flex w-fit items-center gap-1.5 border-b border-[#173A2B]/25 pt-2.5 pb-0.5 text-[11px] font-semibold uppercase tracking-[0.16em] text-[#173A2B] transition-colors duration-300 hover:border-[#b8863b] hover:text-[#b8863b]"
        >
          Buy Now
          <ArrowRight
            size={12}
            className="transition-transform duration-300 group-hover:translate-x-1"
          />
        </button>
      </div>
    </div>
  );
}

export function Checkbox({
  label,
  checked,
  onChange,
}: {
  label: string;
  checked?: boolean;
  onChange?: () => void;
}) {
  const [internalChecked, setInternalChecked] = useState(false);

  // Controlled mode: parent passes `checked` + `onChange` (used by the
  // Products filter sidebar). Uncontrolled fallback: no props passed,
  // keeps working exactly as before for any other usage.
  const isControlled = checked !== undefined;
  const isChecked = isControlled ? checked : internalChecked;

  const handleClick = () => {
    if (isControlled) {
      onChange?.();
    } else {
      setInternalChecked((c) => !c);
    }
  };

  return (
    <label
      onClick={handleClick}
      className="flex items-center gap-4.5 cursor-pointer group"
    >
      <div
        className={`w-4 h-4 rounded border flex items-center justify-center shrink-0 transition-colors pointer-events-none ${isChecked
            ? "bg-[#183b17] border-[#183b17]"
            : "bg-white"
          }`}
      >
        {isChecked && (
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

      <span className="text-base font-medium group-hover:text-[#1a1a1a] transition-colors">
        {label}
      </span>
    </label>
  );
}