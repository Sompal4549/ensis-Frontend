import { formatPrice } from "@/utils";
import {
  CheckCircle,
  CheckCircle2,
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
import premium_teak from "@/assets/products/premium_teak_wood.webp";
import brass_fitting from "@/assets/products/brass_design.webp"
import erogonomic_design from "@/assets/products/erogonimc_design.webp"
import water_resitant from "@/assets/products/water_resitant.webp"
import long_lasting from "@/assets/products/long_lasting.webp"
import Image from "next/image";

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
          className="mt-3 flex  items-center justify-center rounded-md bg-transparent text-xs font-semibold  transition-colors gap-2"
        >
        <Heart size={13} className={wished ? "fill-red-500" : "text-red-500"} />
            {wished ? "In wishlist" : "Add to wishlist"}
        </button>
      </div>
            <h2 className="mt-2 text-xl font-semibold leading-tight text-[#001b10] md:text-2xl max-w-50">
              {product.title}
            </h2>

            <div className="mt-2 flex flex-wrap items-center gap-3 text-[10px]">
              <span className="flex items-center gap-1">
                {Array.from({ length: 5 }).map((_, index) => (
                  <Star
                    key={index}
                    size={15}
                    className="fill-[#d5a642] text-[#d5a642]"
                  />
                ))}
              </span>
              <span className="font-medium">4.8</span>
              <span className="font-medium">(126 reviews)</span>
              <span className="py-1 text-[11px] font-semibold pl-2 border-l border-gray-200">
             SKU: ENS-PT-001
              </span>
            </div>

          

            {/* <p className="mt-2 max-w-2xl text-xs">
              {product.description}
            </p> */}

            <div className="mt-2 grid grid-cols-2 gap-2 sm:grid-cols-5">
              <FeaturePill icon={<Image alt="Premium Teak Wood" src={premium_teak} width={20}height={20} />} label="Premium Finish" />
              <FeaturePill icon={<Image alt="Brass Fittings" src={brass_fitting} width={20}height={20} />} label="Brass Fittings" />
              <FeaturePill icon={<Image alt="Ergonomic Design" src={erogonomic_design} width={20}height={20} />} label="Ergonomic Design" />
              <FeaturePill icon={<Image alt="Water Resitant" src={water_resitant} width={20}height={20} />} label="Water Resitant" />
               <FeaturePill icon={<Image alt="Long Lasting Durability" src={long_lasting} width={20}height={20} />} label="Long Lasting Durability" />
            </div>
           <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6 border-t border-black/10 pt-4">
  {/* Left */}
  <div className="">
    <p className="text-xs uppercase tracking-[0.12em] text-[#C08A2E] font-semibold">
      Starting From
    </p>

    <h2 className="mt-1 text-2xl font-bold text-[#17231A] leading-none">
      {formatPrice(product.price)}
    </h2>

    <p className="mt-2 text-xs font-medium">
      (Inclusive of all taxes)
    </p>
  </div>

  {/* Right */}
  <div className="flex flex-col gap-3">
    <div className="flex items-center gap-2 text-[10px] ">
      <CheckCircle2
        size={12}
        strokeWidth={1.8}
        className="text-[#C08A2E]"
      />
      <span>Custom Sizes Available</span>
    </div>

    <div className="flex items-center gap-2 text-[10px] ">
      <CheckCircle2
        size={12}
        strokeWidth={1.8}
        className="text-[#3c5a42]"
      />
      <span>EMI Options Available</span>
    </div>
  </div>
</div>

            <ProductDetailActions product={shopProduct} />
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