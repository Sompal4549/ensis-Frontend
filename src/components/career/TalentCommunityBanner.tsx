"use client";

import { useState } from "react";
import Image from "next/image";
import axios from "axios";
import { CheckCircle2, Loader2 } from "lucide-react";
import talentBg from "@/assets/career/contact_banner.webp"
import HtmlRenderer from "../layout/HtmlRender";
import { API_URL } from "@/lib/api/api";

const features = [
  "Be part of a purpose-driven team",
  "Work on meaningful projects",
  "Grow your career with us",
];
export interface CareerTalentCommunity{
  bgImage:{image:string; alt:string;}
  heading:string;
  description:string;
  features:string[];
  newsLetterCard:{
    title:string;
    description:string;
    buttonText:string;
  }
  button:string
}
const TalentCommunityBanner = ({sectionContent}:{sectionContent:CareerTalentCommunity}) => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<{ type: "success" | "error"; message: string } | null>(null);

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    setLoading(true);
    setStatus(null);

    try {
      const response = await axios.post(`${API_URL}/newsletter/subscribe`, {
        email,
        type: "career",
      });
      if (response.status === 200 || response.data.success) {
        setStatus({ type: "success", message: "Thank you for joining our talent community!" });
        setEmail("");
      } else {
        setStatus({ type: "error", message: response.data.message || "Something went wrong." });
      }
    } catch (err: any) {
      setStatus({
        type: "error",
        message: err.response?.data?.message || "Failed to subscribe. Please try again.",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="relative">
      {/* Background Image */}
      <Image
        src={sectionContent.bgImage.image||talentBg} // Your background image
        alt="Ready to Create Impact"
        fill
        priority
        className="object-cover"
      />


      {/* Content */}
      <div className="relative z-10 grid min-h-[280px] lg:grid-cols-[1.2fr_300px] items-center gap-10 px-6 py-8 sm:px-8 lg:px-12">
        {/* Left Content */}
        <div className="max-w-md lg:ml-auto">
          <h2 className=" text-xl text-[#d4a35c] sm:text-2xl font-semibold">
            {sectionContent.heading||'Ready to Create Impact?'}
          </h2>

          <HtmlRenderer className="mt-4 text-base text-white/80 max-w-105" content={sectionContent.description||`If you're passionate about wellness, design and innovation,
            we'd love to hear from you.`}>
            
          </HtmlRenderer>

          <ul className="mt-6 space-y-4">
            {(sectionContent.features || features).map((item, index) => (
              <li
                key={index}
                className="flex items-center gap-4 text-base text-white/90"
              >
                <CheckCircle2
                  size={18}
                  className="shrink-0 text-[#c89a4b]"
                />
                {item}
              </li>
            ))}
          </ul>
        </div>

        {/* Newsletter Card */}
        <div className="relative overflow-hidden rounded-2xl border border-[#b98b43]/40 bg-[#032116]/75 p-6 backdrop-blur-sm">
          {/* Decorative Flower */}
          <div className="pointer-events-none absolute -bottom-10 -right-10 h-36 w-36 rounded-full border border-[#b98b43]/20" />
          <div className="pointer-events-none absolute -bottom-5 -right-5 h-24 w-24 rounded-full border border-[#b98b43]/20" />

          <h3 className="text-base font-semibold uppercase tracking-wide text-[#d4a35c]">
            {sectionContent.newsLetterCard.title||`Join Our Talent Community`}
          </h3>

          <HtmlRenderer className="mt-3 text-base leading-6 text-white/70" content={sectionContent.description||"Receive updates on new openings and career opportunities."}>
            
          </HtmlRenderer>

          <form className="mt-6 space-y-4" onSubmit={handleSubscribe}>
            <input
              suppressHydrationWarning
              type="email"
              aria-label="Email address to join the talent community"
              placeholder="Enter your email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="h-9 w-full rounded-md border border-[#d7d7d7]/20 bg-white px-3 text-base text-black outline-none placeholder:text-gray-400"
            />

            <button
              suppressHydrationWarning
              type="submit"
              disabled={loading}
              className="flex h-9 w-full items-center justify-center gap-4 rounded-md bg-[#c89a4b] text-base font-semibold uppercase tracking-wide text-white transition hover:bg-[#b48235] disabled:opacity-60"
            >
              {loading && <Loader2 size={16} className="animate-spin" />}
              {loading ? "Subscribing..." : (sectionContent.button||"Subscribe")}
            </button>

            {status && (
              <p className={`text-base ${status.type === "success" ? "text-green-400" : "text-red-400"}`}>
                {status.message}
              </p>
            )}
          </form>
        </div>
      </div>
    </section>
  );
};

export default TalentCommunityBanner;
