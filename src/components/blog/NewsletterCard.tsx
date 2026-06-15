// components/blog/sidebar/NewsletterCard.tsx
"use client";
import { useState } from "react";
import axios from "axios";
import { API_URL } from "@/app/lib/api";
import BookButton from "../ui/BookButton";
import { Container } from "../ui/Container";

export default function NewsletterCard({sectionContent} : {sectionContent: any}) {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<{ type: "success" | "error"; message: string } | null>(null);

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    setLoading(true);
    setStatus(null);

    try {
      const response = await axios.post(`${API_URL}/newsletter/subscribe`, { email });
      if (response.status === 200 || response.data.success) {
        setStatus({ type: "success", message: "Thank you for subscribing!" });
        setEmail("");
      } else {
        setStatus({ type: "error", message: response.data.message || "Something went wrong." });
      }
    } catch (err: any) {
      setStatus({ type: "error", message: err.response?.data?.message || "Failed to subscribe. Please try again." });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container>
    <div className="rounded-xl border border-[#dcc9b5] bg-[#efe4d7] p-4">
      {/* Horizontal on desktop, vertical on mobile */}
      <form onSubmit={handleSubscribe} className="flex flex-col gap-4 lg:flex-row lg:items-center lg:gap-8">
        
        {/* Text */}
        <div className="lg:shrink-0  flex-1">
          <h3 className="font-serif text-2xl text-[#2b241f] font-semibold lg:text-left text-center">
            {sectionContent?.heading || "Stay Inspired"}
          </h3>
          <p className="text-[15px] text-[#6e5b4d] lg:text-left text-center">
            {sectionContent?.description || "Subscribe for wellness insights, updates, and exclusive offers."}
          </p>
        </div>

        {/* Input + Button */}
        <div className="flex flex-1 flex-col gap-2 justify-end">
          <div className="flex flex-col gap-2 sm:flex-row justify-end items-center">
          <input
            type="email"
            placeholder="Enter your email"
            suppressHydrationWarning
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="rounded-lg border border-[#d9c5b1] bg-white text-sm outline-none w-full sm:w-[50%] px-3 py-2"
          />
          <div className="shrink-0 sm:w-auto w-full">
            <button type="submit" disabled={loading} className="w-full text-white py-2 px-3 rounded-lg bg-[#0f2518] hover:bg-[#1a3d28] shadow-[0_2px_12px_rgba(15,37,24,0.35)]">
              {/* <BookButton tvext={loading ? "..." : "Subscribe"} /> */}
              Subscribe
            </button>
            {/* <BookButton type="submit" disabled={loading} text={loading ? "..." : "Subscribe"} className="w-full" /> */}
          </div>
          </div>
          {status && (
            <p className={`text-xs mt-1 ${status.type === "success" ? "text-green-700" : "text-red-600"} text-center lg:text-right`}>
              {status.message}
            </p>
          )}
        </div>

      </form>
    </div>
    </Container>
  );
}