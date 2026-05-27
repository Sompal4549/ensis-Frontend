import { formatPrice } from "@/utils";
import {
  Heart,
  Leaf,
  LockKeyhole,
  ShieldCheck,
  Sparkles,
  Star,
  Wrench,
} from "lucide-react";
import React, { ReactNode } from "react";
import ProductDetailActions from "./ProductDetailActions";
import { useShop } from "@/context/ShopContext";

interface ProductPriceSectionProps {
  product: any;
  originalPrice: number;
  shopProduct: any;
}

const ProductPriceSection = ({
  product,
  originalPrice,
  shopProduct,
}: ProductPriceSectionProps) => {
   const { addToCart, toggleLike, isLiked } = useShop();
     const wished = isLiked(shopProduct?.id);
  return (
     <div className="min-w-0">
      <div className="flex justify-between items-center w-full">

            <span className="text-xs font-semibold uppercase text-[#F59E0B] ">
              {product.category}
            </span>
               <button
          type="button"
         onClick={() => toggleLike(shopProduct)}
          className="mt-3 flex  items-center justify-center rounded-md bg-transparent text-xs font-bold  transition-colors gap-2"
        >
        <Heart size={13} className={wished ? "fill-red-500" : ""} />
            {wished ? "In wishlist" : "Add to wishlist"}
        </button>
      </div>
            <h2 className="mt-2 text-xl font-semibold leading-tight text-[#001b10] md:text-2xl max-w-50">
              {product.title}
            </h2>

            <div className="mt-2 flex flex-wrap items-center gap-3 text-xs text-[#687064]">
              <span className="flex items-center gap-1">
                {Array.from({ length: 5 }).map((_, index) => (
                  <Star
                    key={index}
                    size={15}
                    className="fill-[#d5a642] text-[#d5a642]"
                  />
                ))}
              </span>
              <span className="font-semibold">4.8</span>
              <span>(126 reviews)</span>
              <span className="px-3 py-1 text-[11px] font-semibold">
             SKU: ENS-PT-001
              </span>
            </div>

          

            {/* <p className="mt-2 max-w-2xl text-xs">
              {product.description}
            </p> */}

            <div className="mt-2 grid grid-cols-2 gap-2 sm:grid-cols-4">
              <FeaturePill icon={<Sparkles size={20} />} label="Premium Finish" />
              <FeaturePill icon={<Wrench size={20} />} label="Custom Built" />
              <FeaturePill icon={<Leaf size={20} />} label="Wellness Grade" />
              <FeaturePill icon={<ShieldCheck size={20} />} label="Durable Design" />
            </div>
             <p className="mb-2 text-base text-[#F59E0B] font-semibold">
                Starting Prize
              </p>
  <div className="mt-2 flex flex-wrap items-end gap-3">
              <span className="text-2xl font-semibold">
                {formatPrice(product.price)}
              </span>
              {product.price ? (
                <>
                  <span className="pb-1 text-sm line-through">
                    {formatPrice(originalPrice)}
                  </span>
                  <span className="pb-1 text-sm font-bold text-[#d33b2f]">
                    (15% OFF)
                  </span>
                </>
              ) : null}
            </div>
            <div className="mt-2">
              <p className="mb-2 text-xs font-semibold">
                (Inclusive of all taxes)
              </p>
              {/* <div className="flex flex-wrap gap-2">
                {["Teak wood", "Brass details", "Natural polish"].map((item) => (
                  <span
                    key={item}
                    className="rounded-md border border-[#e5ded5] bg-white px-4 py-2 text-xs font-semibold text-[#313b30]"
                  >
                    {item}
                  </span>
                ))}
              </div> */}
            </div>

            <ProductDetailActions product={shopProduct} />

            <p className="mt-2 flex items-center font-medium justify-center gap-2 text-[11px] sm:justify-start">
              <LockKeyhole size={13} />
              Secure checkout | 30-day support | Installation guidance
            </p>
          </div>
  )
}

function FeaturePill({ icon, label }: { icon: ReactNode; label: string }) {
  return (
    <div className="flex min-h-15 flex-col items-center justify-center gap-2 rounded-md px-2 py-2 text-center text-[11px] font-semibold text-[#313b30]">
      <span className="text-[#8d6a3a]">{icon}</span>
      {label}
    </div>
  );
}

export default ProductPriceSection