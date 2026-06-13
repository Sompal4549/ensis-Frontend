"use client";

import { FormEvent, useState } from "react";
import dynamic from "next/dynamic";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowRight, UserPlus } from "lucide-react";
import { API_URL } from "@/lib/api/api";
import bannerImage from "@/assets/home/home_banner2.webp"
import Image from "next/image";
import AuthLayout from "@/components/layout/AuthLayout";

const Container = dynamic(() => import("@/components/ui/Container").then((mod) => mod.Container));

export default function RegisterPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsLoading(true);
    setMessage("");

    try {
      const response = await fetch(`${API_URL}/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ name, email, phone, password }),
      });
      const payload = await response.json();
      if (!response.ok || payload.status === "error") {
        throw new Error(payload.message || "Registration failed");
      }
      
      setMessage("Registration successful! Redirecting to login...");
      setTimeout(() => {
        router.push("/login");
      }, 1500);
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
  return (
    <AuthLayout
  title="Create Your Account"
  page="register"
  subtitle="Join the ENSIS wellness ecosystem and access premium solutions."
>

          <form onSubmit={onSubmit}>
            <div className="mb-6 inline-flex size-12 items-center justify-center rounded-full bg-[#f3eee6] text-[#6f542f]">
              <UserPlus size={22} />
            </div>
            
            <label className={labelClass}>
              Full Name
              <input className={inputClass} type="text" value={name} onChange={(event) => setName(event.target.value)} required />
            </label>
            
            <label className={labelClass}>
              Email
              <input className={inputClass} type="email" value={email} onChange={(event) => setEmail(event.target.value)} required />
            </label>
            
            <label className={labelClass}>
              Phone Number (Optional)
              <input className={inputClass} type="tel" value={phone} onChange={(event) => setPhone(event.target.value)} />
            </label>
            
            <label className={labelClass}>
              Password
              <input className={inputClass} type="password" value={password} onChange={(event) => setPassword(event.target.value)} required minLength={6} />
            </label>
            
            <button className={buttonClass} type="submit" disabled={isLoading}>
              {isLoading ? "Registering..." : "Create Account"}
            </button>
            {message && <p className="mt-4 text-sm font-semibold text-[#334022]">{message}</p>}
          </form>
     </AuthLayout>
  );
}
