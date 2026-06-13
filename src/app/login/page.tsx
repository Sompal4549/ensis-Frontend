"use client";

import { FormEvent, useState } from "react";
import dynamic from "next/dynamic";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { API_URL } from "@/lib/api/api";
import ForgotPasswordFlow from "@/components/ForgotPasswordFlow";
import bannerImage from "@/assets/home/home_banner2.webp"
import Image from "next/image";
import lotus from "@/assets/about_new/about_lotus.png";
import AuthLayout from "@/components/layout/AuthLayout";
const Container = dynamic(() => import("@/components/ui/Container").then((mod) => mod.Container));

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showForgotPassword, setShowForgotPassword] = useState(false);

  const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsLoading(true);
    setMessage("");

    try {
      const response = await fetch(`${API_URL}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ email, password }),
      });
      const payload = await response.json();
      if (!response.ok || payload.status === "error") {
        throw new Error(payload.message || "Login failed");
      }
      localStorage.setItem("ensis_access_token", payload.data.accessToken);
      localStorage.setItem("ensis_user", JSON.stringify(payload.data.user));
      window.dispatchEvent(new Event("ensis-auth-change"));
      router.push("/");
      return;
    } catch (error) {
      setMessage((error as Error).message);
    } finally {
      setIsLoading(false);
    }
  };
const buttonClass =
  "mt-4 h-10 w-full rounded-lg bg-gradient-to-r from-[#b88b3d] via-[#e2c684] to-[#c7a45d] text-xs font-semibold uppercase tracking-[1.5px] text-[#1f261b] transition-all hover:opacity-90";

const inputClass =
  "mt-1 h-10 w-full rounded-lg border border-[#d9c49d] bg-[#faf8f4] px-3 text-sm text-[#1f261b] placeholder:text-gray-400 outline-none focus:border-[#b88b3d]";
const labelClass =
  "block text-[10px] font-semibold uppercase tracking-[2px] text-[#8b6b35] mb-1";

  if (showForgotPassword) {
    return (
      <AuthLayout
        title="Reset Password"
        subtitle="We'll send a reset link to your email"
      >
        <ForgotPasswordFlow onBackToLogin={() => setShowForgotPassword(false)} />
      </AuthLayout>

    );
  };

  return (
    <AuthLayout
  title="Client Portal"
subtitle="Access your wellness projects and services"
      page="login"
    >

      <form onSubmit={onSubmit}>
        <div>
          <label className={labelClass}>
            Email Address
          </label>

          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            placeholder="Enter your email"
            className={inputClass}
          />
        </div>

        <div className="mt-5">
          <label className={labelClass}>
            Password
          </label>

          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            placeholder="Enter your password"
            className={inputClass}
          />
        </div>

        <div className="mt-4 flex justify-end">
          <button
            type="button"
            onClick={() => setShowForgotPassword(true)}
            className={labelClass}
          >
            Forgot Password?
          </button>
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className={buttonClass}
        >
          {isLoading ? "Signing In..." : "Sign In"}
        </button>

        {message && (
          <p className="mt-4 text-sm text-center text-red-300">
            {message}
          </p>
        )}

        <div className="mt-3 border-t border-white/10 text-center">
          <Link
            href="/register"
            className="block text-white hover:text-[#d9c49d]"
          >
            Create New Account
          </Link>

          <Link
            href={process.env.NEXT_PUBLIC_ADMIN_URL || "http://localhost:3001"}
            target="_blank"
            className="mt-3 block text-white"
          >
            Admin Portal →
          </Link>
        </div>
      </form>
    </AuthLayout>

  );
}
