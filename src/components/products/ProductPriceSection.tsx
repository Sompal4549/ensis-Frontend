import { formatPrice, isOrderItemForProduct } from "@/utils";
import {
  CheckCircle2,
  Heart,
  Star,
  X,
} from "lucide-react";
import React, { ReactNode, useState, useEffect } from "react";
import ProductDetailActions from "./ProductDetailActions";
import { useShop } from "@/context/ShopContext";
import premium_teak from "@/assets/products/premium_teak_wood.webp";
import brass_fitting from "@/assets/products/brass_design.webp";
import erogonomic_design from "@/assets/products/erogonimc_design.webp";
import water_resitant from "@/assets/products/water_resitant.webp";
import long_lasting from "@/assets/products/long_lasting.webp";
import Image from "next/image";
import { API_URL } from "@/lib/api/api";
import { Product } from "@/constants";
import { nanoid } from "nanoid";

interface ProductPriceSectionProps {
  product: Product; // Use the Product interface from constants
  originalPrice: number;
  shopProduct: any;
  finish?: string;
  size?: string;
}

const ProductPriceSection = ({
  product,
  originalPrice,
  shopProduct,
  finish,
  size,
}: ProductPriceSectionProps) => {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
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
  const [isWritingReview, setIsWritingReview] = useState(false);
  const [rating, setRating] = useState(0);
  const [hover, setHover] = useState(0);
  const [comment, setComment] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [userReviewId, setUserReviewId] = useState<string | null>(null);
  const [token, setToken] = useState<string | null>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;
    setToken(localStorage.getItem("ensis_access_token"));
  }, []);

  useEffect(() => {
    const getReviewSummary = async () => {
      try {
        const headers: Record<string, string> = {};
        if (token) {
          headers["Authorization"] = `Bearer ${token}`;
        }
        const res = await fetch(`${API_URL}/reviews/${product._id}`, { headers });
        const data = await res.json();
        if (data.success) {
          setReviewData({
            averageRating: data.averageRating,
            totalReviews: data.reviews.length,
            reviews: data.reviews
          });

          const myReview = data.reviews.find((r: any) => r.isMine);
          if (myReview) {
            setUserReviewId(myReview._id);
            if (!isWritingReview) {
              setRating(myReview.rating);
              setComment(myReview.comment);
            }
          }
        }
      } catch (err) {
        console.error("Failed to fetch review summary", err);
      }
    };
    if (product._id) getReviewSummary();
  }, [product._id, token, isWritingReview]);

  useEffect(() => {
    const verifyPurchase = async () => {
      if (!token) return;
      try {
        const res = await fetch(`${API_URL}/orders/my-orders`, {
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
              id: String(product._id),
              slug: product.slug,
              title: product.title || product.title,
              name: product.title,
            })
          )
        );
        setHasPurchased(bought);
      } catch (err) {
        console.error("Purchase verification failed", err);
      }
    };
    verifyPurchase();
  }, [product._id, token]);

  const handleReviewSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (rating === 0) return alert("Please select a rating");
    if (!token) return alert("Please login to submit a review");

    setIsSubmitting(true);
    try {
      const method = userReviewId ? 'PUT' : 'POST';
      const url = userReviewId
        ? `${API_URL}/reviews/${userReviewId}`
        : `${API_URL}/reviews/${product._id}`;

      const res = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ rating, comment }),
      });

      if (res.ok) {
        alert(userReviewId ? "Review updated successfully!" : "Review submitted successfully!");
        setIsWritingReview(false);
        // Force refresh reviews
        const refreshRes = await fetch(`${API_URL}/reviews/${product._id}`);
        const refreshData = await refreshRes.json();
        if (refreshData.success) {
          setReviewData({ averageRating: refreshData.averageRating, totalReviews: refreshData.reviews.length, reviews: refreshData.reviews });
        }
      } else {
        alert("Failed to submit review. Please try again.");
      }
    } catch (error) {
      console.error("Error submitting review:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const { addToCart, toggleLike, isLiked } = useShop();
  const wished = isLiked(shopProduct?.id);
  return (
    <div className="min-w-0">
      <div className="flex justify-between items-center w-full">

        <span className="text-base font-semibold uppercase text-[#F59E0B] ">
          {typeof product.category === 'object' ? product.category.name : product.category}
        </span>
        <button
          suppressHydrationWarning
          type="button"
          onClick={() => toggleLike(shopProduct)}
          className="mt-3 flex items-center justify-center rounded-md bg-transparent text-base font-semibold transition-colors gap-1.5"
        >
          <Heart size={13} className={mounted && wished ? "fill-red-500 text-red-500" : "text-red-500"} />
          {mounted && wished ? "In wishlist" : "Add to wishlist"}
        </button>
      </div>
      <h1 className="mt-2 text-xl font-medium leading-tight text-[#001b10] md:hidden">
        {product.title}
      </h1>
      <p className="hidden md:block mt-2 text-xl font-semibold leading-tight text-[#001b10] md:text-2xl max-w-60 line-clamp-2">
        {product.title}
      </p>

      <div className="mt-2 flex flex-wrap items-center gap-4 text-base">
        <button
          onClick={() => setIsReviewOpen(true)}
          className="flex items-center gap-4 hover:opacity-70 transition-opacity"
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
        <span className="py-1 text-base font-semibold pl-2 border-l border-gray-200">
          {product.code || 'ENS-PT-001'}
        </span>
      </div>



      {/* <p className="mt-2 max-w-2xl text-base">
              {product.description}
            </p> */}

      <div className="mt-2 grid grid-cols-2 gap-4 sm:grid-cols-5">
        {product?.overview?.productPricingFeatures?.map((item, index) => (
          <FeaturePill
            key={nanoid()}
            icon={<Image alt={item?.title} src={item?.image} width={20}height={20} />}
            label={item?.title}
          />
        ))}
      </div>
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6 border-t border-black/10 pt-4">
        {/* Left */}
        <div className="">
          <p className="text-base uppercase tracking-[0.12em] text-[#C08A2E] font-semibold">
            Starting From
          </p>

          <div className="mt-1 flex items-end gap-2">
            <h2 className="tabular-nums text-2xl font-bold text-[#17231A] leading-none">
              {formatPrice(product.price)}
            </h2>
            {product.price > 0 && (
              <span className="pb-0.5 text-base font-medium text-[#6f756c]">
                (Incl. of {product.gstRate ?? 5}% GST)
              </span>
            )}
          </div>
        </div>

        {/* Right */}
        <div className="flex flex-col gap-4">
          {product.overview?.customSize && (

            <div className="flex items-center gap-4 text-base ">
              <CheckCircle2
                size={12}
                strokeWidth={1.8}
                className="text-[#C08A2E]"
              />
              <span>Custom Sizes Available</span>
            </div>
          )}

          {product?.overview?.emiOptions && <div className="flex items-center gap-4 text-base ">
            <CheckCircle2
              size={12}
              strokeWidth={1.8}
              className="text-[#3c5a42]"
            />
            <span>EMI Options Available</span>
          </div>}
        </div>
      </div>

      <ProductDetailActions product={shopProduct} finish={finish} size={size} />

      {/* Reviews Popup Modal */}
      {isReviewOpen && (
        <div className="fixed inset-0 z-999 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
          <div className="bg-white rounded-2xl w-full max-w-md shadow-2xl overflow-hidden flex flex-col">
            <div className="px-5 py-4 border-b border-gray-100 flex justify-between items-center bg-[#fbfaf7]">
              <div>
                <h3 className="font-bold text-[#313b30]">Customer Reviews</h3>
                <div className="flex items-center gap-4 mt-0.5">
                  <div className="flex">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} size={10} className="fill-[#d5a642] text-[#d5a642]" />
                    ))}
                  </div>
                  <span className="text-base font-bold text-gray-500">{reviewData.averageRating}/5.0 average rating</span>
                </div>
              </div>
              <button
                onClick={() => setIsReviewOpen(false)}
                className="p-1.5 hover:bg-gray-200 rounded-full transition-colors text-gray-500"
              >
                <X size={18} />
              </button>
            </div>

            <div className="p-5 overflow-y-auto max-h-[60vh]">
              {isWritingReview ? (
                <form onSubmit={handleReviewSubmit} className="space-y-4">
                  <h4 className="text-base font-bold text-[#313b30]">{userReviewId ? "Edit Your Review" : "Write a Review"}</h4>
                  <div className="flex gap-1">
                    {[...Array(5)].map((_, i) => {
                      const starValue = i + 1;
                      return (
                        <button
                          type="button"
                          key={starValue}
                          onClick={() => setRating(starValue)}
                          onMouseEnter={() => setHover(starValue)}
                          onMouseLeave={() => setHover(0)}
                          className="focus:outline-none"
                        >
                          <Star
                            size={24}
                            className={`transition-colors ${starValue <= (hover || rating) ? "fill-[#d5a642] text-[#d5a642]" : "text-gray-300"}`}
                          />
                        </button>
                      );
                    })}
                  </div>
                  <div>
                    <label className="text-base font-bold uppercase mb-2 block">Your Experience</label>
                    <textarea
                      rows={4}
                      value={comment}
                      onChange={(e) => setComment(e.target.value)}
                      placeholder="What did you like or dislike about the product?"
                      className="w-full p-3 text-base rounded-lg border border-[#eee5d8] outline-none focus:border-[#d5a642] bg-white"
                      required
                    />
                  </div>
                  <div className="flex gap-4">
                    <button
                      type="button"
                      onClick={() => setIsWritingReview(false)}
                      className="flex-1 py-2.5 text-base font-bold uppercase tracking-widest text-gray-500 border border-gray-300 rounded-lg hover:bg-gray-50 transition-all"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="flex-1 py-2.5 text-base font-bold uppercase tracking-widest text-white bg-[#313b30] rounded-lg hover:bg-black transition-all disabled:opacity-50"
                    >
                      {isSubmitting ? "Submitting..." : (userReviewId ? "Update Review" : "Submit Review")}
                    </button>
                  </div>
                </form>
              ) : (
                <div className="space-y-6">
                  {reviewData.reviews.length > 0 ? (
                    reviewData.reviews.map((rev) => (
                      <div key={rev._id} className="border-b border-gray-50 pb-5 last:border-0 last:pb-0">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-base font-bold text-[#1a1a1a]">{rev.user}</span>
                          <span className="text-base text-gray-400">{new Date(rev.createdAt).toLocaleDateString()}</span>
                        </div>
                        <div className="flex mb-2">
                          {[...Array(5)].map((_, i) => (
                            <Star key={i} size={10} className={i < rev.rating ? "fill-[#d5a642] text-[#d5a642]" : "text-gray-200"} />
                          ))}
                        </div>
                        <p className="text-base text-gray-600 leading-relaxed italic">
                          &quot;{rev.comment}&quot;
                        </p>
                      </div>
                    ))
                  ) : (
                    <p className="text-center text-base text-gray-500">No reviews yet. Be the first to review!</p>
                  )}
                </div>
              )}
            </div>

            {hasPurchased && !isWritingReview && (
              <div className="p-4 bg-gray-50 border-t border-gray-100">
                <button
                  onClick={() => setIsWritingReview(true)}
                  className="w-full py-2.5 text-base font-bold uppercase tracking-widest text-[#8d6a3a] border border-[#8d6a3a] rounded-lg hover:bg-[#8d6a3a] hover:text-white transition-all"
                >
                  {userReviewId ? "Edit Your Review" : "Write a Review"}
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
    <div className="flex min-h-15 flex-col items-center justify-center gap-4 rounded-md px-2 py-2 text-center text-base font-semibold text-[#313b30]">
      <span className="text-[#8d6a3a]">{icon}</span>
      {label}
    </div>
  );
}

export default ProductPriceSection