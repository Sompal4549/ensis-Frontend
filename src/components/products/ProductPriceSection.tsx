import { formatPrice, isOrderItemForProduct } from "@/utils";
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
  X,
} from "lucide-react";
import React, { ReactNode, useState, useEffect } from "react";
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
  const [isReviewOpen, setIsReviewOpen] = useState(false);
  const [reviewData, setReviewData] = useState<{
    averageRating: number;
    totalReviews: number;
    reviews: any[];
  }>({
    averageRating: 0,
    totalReviews: 0,
    reviews: []
  });
  const [hasPurchased, setHasPurchased] = useState(false);
  const [token, setToken] = useState<string | null>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;
    setToken(localStorage.getItem("ensis_access_token"));
  }, []);

  useEffect(() => {
    const getReviewSummary = async () => {
      try {
        const res = await fetch(`/api/v1/reviews/${product.id}`);
        const data = await res.json();
        if (data.success) {
          setReviewData({
            averageRating: data.averageRating,
            totalReviews: data.reviews.length,
            reviews: data.reviews
          });
        }
      } catch (err) {
        console.error("Failed to fetch review summary", err);
      }
    };
    getReviewSummary();
  }, [product.id]);

  useEffect(() => {
    const verifyPurchase = async () => {
      if (!token) return;
      try {
        const res = await fetch("/api/v1/orders/my-orders", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const data = await res.json();
        const orders = Array.isArray(data.data)
          ? data.data
          : Array.isArray(data.orders)
          ? data.orders
          : [];

        const bought = orders.some((order: any) =>
          order.items?.some((item: any) =>
            isOrderItemForProduct(item, {
              id: String(product.id),
              slug: product.slug,
              title: product.title || product.name,
              name: product.name,
            })
          )
        );
        setHasPurchased(bought);
      } catch (err) {
        console.error("Purchase verification failed", err);
      }
    };
    verifyPurchase();
  }, [product.id, token]);

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
            <h2 className="mt-2 text-xl font-semibold leading-tight text-[#001b10] md:text-2xl max-w-60 line-clamp-2">
              {product.title || product.name}
            </h2>

            <div className="mt-2 flex flex-wrap items-center gap-3 text-[10px]">
              <button 
                onClick={() => setIsReviewOpen(true)}
                className="flex items-center gap-2 hover:opacity-70 transition-opacity"
              >
                <span className="flex items-center gap-1">
                  {[...Array(5)].map((_, index) => (
                    <Star
                      key={index}
                      size={15}
                      className={index < Math.round(reviewData.averageRating) ? "fill-[#d5a642] text-[#d5a642]" : "text-gray-300"}
                    />
                  ))}
                </span>
                <span className="font-medium">{reviewData.averageRating || "0.0"}</span>
                <span className="font-medium underline decoration-dotted decoration-gray-400 underline-offset-2">({reviewData.totalReviews} reviews)</span>
              </button>
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

      {/* Reviews Popup Modal */}
      {isReviewOpen && (
        <div className="fixed inset-0 z-[999] flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
          <div className="bg-white rounded-2xl w-full max-w-md shadow-2xl overflow-hidden flex flex-col">
            <div className="px-5 py-4 border-b border-gray-100 flex justify-between items-center bg-[#fbfaf7]">
              <div>
                <h3 className="font-bold text-[#313b30]">Customer Reviews</h3>
                <div className="flex items-center gap-2 mt-0.5">
                  <div className="flex">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} size={10} className="fill-[#d5a642] text-[#d5a642]" />
                    ))}
                  </div>
                  <span className="text-[10px] font-bold text-gray-500">{reviewData.averageRating}/5.0 average rating</span>
                </div>
              </div>
              <button 
                onClick={() => setIsReviewOpen(false)}
                className="p-1.5 hover:bg-gray-200 rounded-full transition-colors text-gray-500"
              >
                <X size={18} />
              </button>
            </div>
            
            <div className="p-5 overflow-y-auto max-h-[60vh] space-y-6">
              {reviewData.reviews.map((rev) => (
                <div key={rev._id} className="border-b border-gray-50 pb-5 last:border-0 last:pb-0">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[11px] font-bold text-[#1a1a1a]">{rev.user}</span>
                    <span className="text-[9px] text-gray-400">{new Date(rev.createdAt).toLocaleDateString()}</span>
                  </div>
                  <div className="flex mb-2">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} size={10} className={i < rev.rating ? "fill-[#d5a642] text-[#d5a642]" : "text-gray-200"} />
                    ))}
                  </div>
                  <p className="text-[11px] text-gray-600 leading-relaxed italic">
                    &quot;{rev.comment}&quot;
                  </p>
                </div>
              ))}
            </div>
            
            {hasPurchased && (
              <div className="p-4 bg-gray-50 border-t border-gray-100">
                <button 
                  onClick={() => {
                    setIsReviewOpen(false);
                    const reviewSection = document.getElementById('review-section');
                    if (reviewSection) reviewSection.scrollIntoView({ behavior: 'smooth' });
                  }}
                  className="w-full py-2.5 text-[10px] font-bold uppercase tracking-widest text-[#8d6a3a] border border-[#8d6a3a] rounded-lg hover:bg-[#8d6a3a] hover:text-white transition-all"
                >
                  Write a Review
                </button>
              </div>
            )}
          </div>
        </div>
      )}
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