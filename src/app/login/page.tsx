"use client";

import { useState, useEffect, useRef } from "react";
import dynamic from "next/dynamic";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { API_URL } from "@/lib/api/api";
import AuthLayout from "@/components/layout/AuthLayout";
import axios from "axios";

const Container = dynamic(() => import("@/components/ui/Container").then((mod) => mod.Container));

export default function LoginPage() {
  const router = useRouter();
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState("");
  const [step, setStep] = useState<"phone" | "otp">("phone");
  const [isAdmin, setIsAdmin] = useState(false);
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [timer, setTimer] = useState(0);
  const [showResendButton, setShowResendButton] = useState(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const handleSendOTP = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage("");

    try {
      const payload: any = { phone };
      if (isAdmin) payload.purpose = "admin-login";

      const response = await axios.post(`${API_URL}/auth/whatsapp-otp/send`, payload);
      
      if (response.status === 200 || response.data.success) {
        setStep("otp");
        startTimer();
      } else {
        setMessage(response.data.message || "Failed to send OTP.");
      }
    } catch (error: any) {
      setMessage(error.response?.data?.message || "Error sending OTP. Ensure phone includes country code (e.g. 91).");
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage("");

    try {
      const endpoint = isAdmin ? "/admin/login" : "/auth/login";
      const response = await axios.post(`${API_URL}${endpoint}`, { phone, otp });

      const payload = response.data;
      if (payload.status === "error") {
        throw new Error(payload.message || "Login failed");
      }
      
      localStorage.setItem("ensis_access_token", payload.data.accessToken);
      localStorage.setItem("ensis_user", JSON.stringify(payload.data.user));
      window.dispatchEvent(new Event("ensis-auth-change"));
      router.push("/");
    } catch (error: any) {
      setMessage(error.response?.data?.message || error.message || "Invalid OTP or login failed.");
    } finally {
      setIsLoading(false);
    }
  };

  const startTimer = () => {
    setTimer(60);
    setShowResendButton(false);
    if (timerRef.current) {
      clearInterval(timerRef.current);
    }
    timerRef.current = setInterval(() => {
      setTimer((prevTimer) => {
        if (prevTimer <= 1) {
          clearInterval(timerRef.current!);
          setShowResendButton(true);
          return 0;
        }
        return prevTimer - 1;
      });
    }, 1000);
  };

  useEffect(() => {
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, []);

const buttonClass =
  "mt-4 h-10 w-full rounded-lg bg-gradient-to-r from-[#b88b3d] via-[#e2c684] to-[#c7a45d] text-xs font-semibold uppercase tracking-[1.5px] text-[#1f261b] transition-all hover:opacity-90";

const inputClass =
  "mt-1 h-10 w-full rounded-lg border border-[#d9c49d] bg-[#faf8f4] px-3 text-sm text-[#1f261b] placeholder:text-gray-400 outline-none focus:border-[#b88b3d]";
const labelClass =
  "block text-[10px] font-semibold uppercase tracking-[2px] text-[#8b6b35] mb-1";

  return (
    <AuthLayout
  title="Client Portal"
subtitle="Access your wellness projects and services"
      page="login"
    >
      {step === "phone" ? (
        <form onSubmit={handleSendOTP}>
          <div className="mb-4">
            <label className="flex items-center gap-4 cursor-pointer text-[10px] font-semibold text-[#8b6b35] uppercase tracking-[1px]">
              <input suppressHydrationWarning 
                type="checkbox" 
                checked={isAdmin} 
                onChange={(e) => setIsAdmin(e.target.checked)} 
                className="accent-[#b88b3d]"
              />
              Login as Admin / Expert
            </label>
          </div>

          <div>
            <label className={labelClass}>Mobile Number</label>
            <input suppressHydrationWarning
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              required
              placeholder="91XXXXXXXXXX"
              className={inputClass}
            />
          </div>

          <button suppressHydrationWarning type="submit" disabled={isLoading} className={buttonClass}>
            {isLoading ? "Sending Code..." : "Get OTP"}
          </button>
        </form>
      ) : (
        <form onSubmit={handleLogin}>
          <div>
            <label className={labelClass}>6-Digit WhatsApp Code</label>
            <input suppressHydrationWarning
              type="text"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              required
              maxLength={6}
              placeholder="123456"
              className={`${inputClass} tracking-[4px] text-center font-bold`}
            />
            {timer > 0 && (
              <div className="mt-4 flex flex-col items-center justify-center gap-4">
                <div className="relative flex items-center justify-center h-12 w-12">
                  <svg className="h-full w-full -rotate-90 transform" viewBox="0 0 40 40">
                    <circle
                      cx="20"
                      cy="20"
                      r="18"
                      stroke="#e8e0d3"
                      strokeWidth="2.5"
                      fill="transparent"
                    />
                    <circle
                      cx="20"
                      cy="20"
                      r="18"
                      stroke="#b88b3d"
                      strokeWidth="2.5"
                      fill="transparent"
                      strokeDasharray={2 * Math.PI * 18}
                      strokeDashoffset={2 * Math.PI * 18 - (timer / 60) * (2 * Math.PI * 18)}
                      strokeLinecap="round"
                      className="transition-all duration-1000 ease-linear"
                    />
                  </svg>
                  <span className="absolute text-[11px] font-bold text-[#8b6b35]">{timer}</span>
                </div>
                <p className="text-[9px] font-bold uppercase tracking-[1px] text-[#8b6b35]/60 text-center">
                  Waiting for resend...
                </p>
              </div>
            )}
            {showResendButton && (
              <button suppressHydrationWarning
                type="button"
                onClick={handleSendOTP}
                disabled={isLoading}
                className="mt-4 block w-full text-center text-[10px] font-semibold uppercase tracking-[1px] text-[#8b6b35] hover:underline"
              >
                Resend OTP
              </button>
            )}

          </div>

          <button suppressHydrationWarning type="submit" disabled={isLoading} className={buttonClass}>
            {isLoading ? "Verifying..." : "Sign In"}
          </button>
        </form>
      )}
      {message && <p className="mt-4 text-sm text-center text-red-300">{message}</p>}
      <div className="mt-3 border-t border-white/10 text-center">
        <Link href="/register" className="block text-white hover:text-[#d9c49d]">
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
    </AuthLayout>
  );
}
