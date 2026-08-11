"use client";

import React, { useState, useEffect } from "react";
import { Star, CheckCircle, MessageSquare } from "lucide-react";
import { Container } from "../ui/Container";
import { isOrderItemForProduct } from "@/utils";
import { API_URL } from "@/lib/api/api";

interface Review {
  _id: string;
  user: string;
  rating: number;
  comment: string;
  createdAt: string;
}

export default function ReviewSection({ productId, productTitle, productSlug }: { productId: string; productTitle: string; productSlug: string }) {
  const [hasPurchased, setHasPurchased] = useState(false);
  const [rating, setRating] = useState(0);
  const [hover, setHover] = useState(0);
  const [comment, setComment] = useState("");
  const [reviews, setReviews] = useState<Review[]>([]);
  const [averageRating, setAverageRating] = useState(0);
  const [submitted, setSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [userReviewId, setUserReviewId] = useState<string | null>(null);
  const [token, setToken] = useState<string | null>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;
    setToken(localStorage.getItem("ensis_access_token"));
  }, []);

  useEffect(() => {
    const checkPurchaseStatus = async () => {
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

        const wasBought = orders.some((order: any) =>
          order.items?.some((item: any) =>
            isOrderItemForProduct(item, {
              id: String(productId),
              slug: productSlug,
              title: productTitle,
            })
          )
        );
        setHasPurchased(wasBought);
      } catch (e) {
        console.error("Error checking purchase status", e);
      }
    };

    checkPurchaseStatus();
  }, [productId, productTitle, productSlug, token]);

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const headers: Record<string, string> = {};
        if (token) {
          headers["Authorization"] = `Bearer ${token}`;
        }
        const res = await fetch(`${API_URL}/reviews/${productId}`, { headers });
        const data = await res.json();
        if (data.success) {
          setReviews(data.reviews);
          setAverageRating(data.averageRating);
          
          // If user has already reviewed, store the ID for updates
          const myReview = data.reviews.find((r: any) => r.isMine); 
          if (myReview) {
            setUserReviewId(myReview._id);
            setRating(myReview.rating);
            setComment(myReview.comment);
          }
        }
      } catch (error) {
        console.error("Error fetching reviews:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchReviews();
  }, [productId, token]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (rating === 0) return alert("Please select a rating");
    if (!token) return alert("Please login to submit a review");

    try {
      // Use PUT if review already exists, otherwise POST (assuming standard REST)
      const method = userReviewId ? 'PUT' : 'POST';
      const url = userReviewId 
        ? `${API_URL}/reviews/${userReviewId}` 
        : `${API_URL}/reviews/${productId}`;

      const res = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ rating, comment }),
      });

      if (res.ok) {
        setSubmitted(true);
        // Refresh list
        const headers: Record<string, string> = {};
        if (token) {
          headers["Authorization"] = `Bearer ${token}`;
        }
        const updated = await fetch(`${API_URL}/reviews/${productId}`, { headers }).then(r => r.json());
        setReviews(updated.reviews);
      } else {
        alert("Failed to submit review. Please try again.");
      }
    } catch (error) {
      console.error("Error submitting review:", error);
    }
  };

  return (
    <section id="review-section" className="py-12 bg-white border-t border-[#eee5d8]">
      <Container>
        <div className="grid lg:grid-cols-[1fr_400px] gap-12">
          {/* Reviews List */}
          <div>
            <h2 className="text-2xl font-semibold mb-8 flex items-center gap-4">
              Customer Reviews <span className="text-base font-normal text-gray-500">({reviews.length})</span>
            </h2>
            
            <div className="space-y-8">
              {reviews.map((rev) => (
                <div key={rev._id} className="border-b border-gray-100 pb-6">
                  <div className="flex items-center gap-4 mb-2">
                    <div className="flex">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          size={14}
                          className={`${i < rev.rating ? "fill-[#d5a642] text-[#d5a642]" : "text-gray-300"}`}
                        />
                      ))}
                    </div>
                    <span className="text-base font-bold">{rev.user}</span>
                    <span className="text-base text-gray-400">{new Date(rev.createdAt).toLocaleDateString()}</span>
                  </div>
                  <p className="text-base text-gray-700 leading-relaxed">{rev.comment}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Review Form - Conditional Rendering */}
          <div className="bg-[#fbfaf7] p-6 rounded-xl border border-[#eee5d8] h-fit">
            {hasPurchased ? (
              !submitted ? (
                <>
                  <h3 className="text-lg font-semibold mb-2">
                    {userReviewId ? "Edit Your Review" : "Write a Review"}
                  </h3>
                  <p className="text-base text-gray-600 mb-6">
                    {userReviewId 
                      ? "Update your existing rating and experience below." 
                      : "As a verified buyer, your feedback helps others choose wisely."}
                  </p>
                  
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                      <label className="text-base font-bold uppercase mb-2 block">Rating</label>
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

                    <button
                      type="submit"
                      className="w-full py-3 bg-[#313b30] text-white text-base font-bold uppercase tracking-widest rounded-lg hover:bg-black transition-colors"
                    >
                      {userReviewId ? "Update Review" : "Submit Review"}
                    </button>
                  </form>
                </>
              ) : (
                <div className="text-center py-4">
                  <div className="bg-emerald-100 text-emerald-700 p-3 rounded-full w-fit mx-auto mb-4">
                    <CheckCircle size={24} />
                  </div>
                  <h3 className="font-semibold text-emerald-800">
                    {userReviewId ? "Review Updated!" : "Review Submitted!"}
                  </h3>
                  <p className="text-base text-emerald-600 mt-1 mb-4">Thank you for sharing your experience.</p>
                  <button
                    onClick={() => setSubmitted(false)}
                    className="w-full py-2 border border-[#8d6a3a] text-[#8d6a3a] text-base font-bold uppercase tracking-widest rounded-lg hover:bg-[#8d6a3a] hover:text-white transition-colors"
                  >
                    Edit Review Again
                  </button>
                </div>
              )
            ) : (
              <div className="text-center py-4">
                <MessageSquare className="mx-auto text-gray-300 mb-3" size={32} />
                <h3 className="text-base font-semibold text-gray-800">Review restricted</h3>
                <p className="text-base text-gray-500 mt-2">
                  Only customers who have purchased this product can leave a review.
                </p>
              </div>
            )}
          </div>
        </div>
      </Container>
    </section>
  );
}