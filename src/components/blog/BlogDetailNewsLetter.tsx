"use client";

import { useState } from "react";
import Image from "next/image";
import axios from "axios";
import {
  FaLinkedinIn,
  FaInstagram,
  FaFacebookF,
  FaYoutube,
} from "react-icons/fa";
import { Container } from "../ui/Container";
import flower from "@/assets/about/lotus.png";
import { API_URL } from "@/lib/api/api";
import Link from "next/link";
export interface BlogNewsLaterPropps{
  lotusImage:{image:string; alt:string;};
  title:string;
  description:string;
  followText:string;
  followLinks:{image:string;path:string;}
}
const BlogDetailNewsletter = ({sectionContent}:{sectionContent:any}) => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<{
    type: "success" | "error";
    message: string;
  } | null>(null);

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email) return;

    setLoading(true);
    setStatus(null);

    try {
      const response = await axios.post(
        `${API_URL}/newsletter/subscribe`,
        {
          email,
        }
      );

      if (response.status === 200 || response.data.success) {
        setStatus({
          type: "success",
          message: "Thank you for subscribing!",
        });
        setEmail("");
      } else {
        setStatus({
          type: "error",
          message: response.data.message || "Something went wrong.",
        });
      }
    } catch (err: any) {
      setStatus({
        type: "error",
        message:
          err.response?.data?.message ||
          "Failed to subscribe. Please try again.",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="relative bg-[#011b12]!">

      <Container className="relative z-10 mx-auto flex flex-col gap-8 lg:flex-row lg:items-center lg:justify-between">
        {/* Left */}
        <div className="flex items-center gap-4">
          <Image
            src={sectionContent.lotusImage.image}
            alt={sectionContent.lotusImage.alt}
            width={50}
            height={50}
          />

          <div>
            <h3 className="font-serif text-md text-white">
              {sectionContent.title}
            </h3>

            <p className="mt-1 max-w-xs text-xs leading-4 text-white/80">
              {sectionContent.description}
            </p>
          </div>
        </div>

        {/* Form */}
        <div className="flex flex-col items-center">
          <form
            onSubmit={handleSubscribe}
            className="flex w-full max-w-xl overflow-hidden rounded-md bg-white lg:w-auto"
          >
            <input
              type="email"
              aria-label="Email address for newsletter subscription"
              placeholder="Enter your email address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="h-10 flex-1 px-5 text-xs text-gray-700 outline-none placeholder:text-gray-400 min-w-[280px]"
            />

            <button
              type="submit"
              disabled={loading}
              className="bg-[#B88A43] px-4 text-xs font-semibold uppercase tracking-wide text-white transition hover:bg-[#a97c39] disabled:opacity-70"
            >
              {loading ? "..." :sectionContent.followText||"Subscribe"}
            </button>
          </form>

          {status && (
            <p
              className={`mt-2 text-sm ${
                status.type === "success"
                  ? "text-green-300"
                  : "text-red-300"
              }`}
            >
              {status.message}
            </p>
          )}
        </div>

        {/* Social */}
        <div className="flex flex-col items-start gap-4 lg:items-end">
          <span className="text-base text-white">
            Follow Us
          </span>

          <div className="flex items-center gap-3">
            {sectionContent.socialLinks.map(
              (link:any, index:number|string) => (
                <Link 
                  key={index}
                  href={link.path}
                  className="flex h-10 w-10 items-center justify-center rounded-full border border-[#B88A43] text-[#B88A43] transition hover:bg-[#B88A43] hover:text-white"
                >
                  <span className="text-[#B88A43] ">

                  <Image src={link.image} alt="icon" width={16} height={16} />
                  </span>
                </Link>
              )
            )}
          </div>
        </div>
      </Container>
    </section>
  );
};

export default BlogDetailNewsletter;