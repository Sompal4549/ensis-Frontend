"use client";

import React, { useState } from "react";
import axios from "axios";
import { Mail, Lock, KeyRound, CheckCircle2, ArrowLeft } from "lucide-react";
import { API_URL } from "@/lib/api/api";

interface ForgotPasswordFlowProps {
  onBackToLogin: () => void;
}

const ForgotPasswordFlow: React.FC<ForgotPasswordFlowProps> = ({ onBackToLogin }) => {
  const [step, setStep] = useState<"email" | "otp" | "reset" | "success">("email");
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [resetToken, setResetToken] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleRequestOTP = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return setError("Email is required");
    
    setLoading(true);
    setError("");
    try {
      // Step 1: Backend se code request karo
      const response = await axios.post(`${API_URL}/auth/forgot-password`, { email });
      if (response.status === 200 || response.data.success) {
        setStep("otp");
      } else {
        setError(response.data.message || "Failed to send OTP.");
      }
    } catch (err: any) {
      setError(err.response?.data?.message || "User not found or network error.");
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyStep = async (e: React.FormEvent) => {
    e.preventDefault();
    if (otp.length !== 6) return setError("Please enter 6-digit code.");

    setLoading(true);
    setError("");
    try {
      // Step 2: OTP verify karke resetToken lena
      const response = await axios.post(`${API_URL}/auth/verify-reset-otp`, { email, otp });
      console.log("Verify Response:", response.data); // Check structure here

      // Token extraction (handles response.data.resetToken or response.data.data.resetToken)
      const token = response.data.resetToken || response.data.data?.resetToken || response.data.token;

      if (token) {
        setResetToken(token); 
        setStep("reset");
      } else {
        setError("Reset token not found in response.");
      }
    } catch (err: any) {
      setError(err.response?.data?.message || "Verification failed.");
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) return setError("Passwords do not match");
    if (newPassword.length < 6) return setError("Password too short (min 6 chars)");

    setLoading(true);
    setError("");
    try {
      console.log(resetToken)
      const response = await axios.post(`${API_URL}/auth/reset-password`, {
        resetToken, // Ab hum resetToken bhej rahe hain
        newPassword,
      });
      if (response.data.success || response.status === 200) {
        setStep("success");
      }
    } catch (err: any) {
      setError(err.response?.data?.message || "Invalid OTP or failed to update.");
    } finally {
      setLoading(false);
    }
  };

  if (step === "success") {
    return (
      <div className="text-center p-8 bg-white rounded-3xl border border-[#ebe7df]">
        <div className="flex justify-center mb-4">
          <CheckCircle2 className="text-green-500 w-16 h-16" />
        </div>
        <h2 className="text-2xl font-serif font-bold text-[#20351f] mb-3">Successful!</h2>
        <p className="text-gray-600 mb-8">Password reset successfully. Now login with your new credentials.</p>
        <button
          onClick={onBackToLogin}
          className="w-full py-3 bg-[#183b17] text-white rounded-xl font-bold hover:shadow-lg transition-all"
        >
          Go to Login
        </button>
      </div>
    );
  }

  return (
    <div className="w-full max-w-md mx-auto p-6 md:p-8 bg-white rounded-3xl border border-[#ebe7df] shadow-sm">
      <button 
        onClick={onBackToLogin}
        className="flex items-center text-sm font-semibold text-[#183b17] mb-6 hover:underline"
      >
        <ArrowLeft size={16} className="mr-2" /> Back to Login
      </button>

      <h2 className="text-2xl md:text-3xl font-serif font-bold text-[#20351f] mb-2">
        {step === "email" && "Find Account"}
        {step === "otp" && "Check Email"}
        {step === "reset" && "New Password"}
      </h2>
      <p className="text-sm text-gray-500 mb-8 font-medium">
        {step === "email" && "Enter your email to receive a 6-digit verification code."}
        {step === "otp" && `We've sent a code to ${email}. Enter it below.`}
        {step === "reset" && "Secure your account by choosing a strong password."}
      </p>

      <form onSubmit={step === "email" ? handleRequestOTP : step === "otp" ? handleVerifyStep : handleResetPassword} className="space-y-5">
        {step === "email" && (
          <div className="relative">
            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-[#c8a45d]" size={18} />
            <input
              type="email"
              placeholder="Email Address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full h-12 pl-12 pr-4 rounded-xl border border-[#183b17] focus:ring-1 focus:ring-[#c8a45d] outline-none"
              required
            />
          </div>
        )}

        {step === "otp" && (
          <div className="relative">
            <KeyRound className="absolute left-4 top-1/2 -translate-y-1/2 text-[#c8a45d]" size={18} />
            <input
              type="text"
              placeholder="Enter 6-digit OTP"
              maxLength={6}
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              className="w-full h-12 pl-12 pr-4 rounded-xl border border-[#183b17] focus:ring-1 focus:ring-[#c8a45d] outline-none tracking-widest font-bold"
              required
            />
          </div>
        )}

        {step === "reset" && (
          <>
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-[#c8a45d]" size={18} />
              <input
                type="password"
                placeholder="New Password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="w-full h-12 pl-12 pr-4 rounded-xl border border-[#183b17] focus:ring-1 focus:ring-[#c8a45d] outline-none"
                required
              />
            </div>
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-[#c8a45d]" size={18} />
              <input
                type="password"
                placeholder="Confirm New Password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full h-12 pl-12 pr-4 rounded-xl border border-[#183b17] focus:ring-1 focus:ring-[#c8a45d] outline-none"
                required
              />
            </div>
          </>
        )}

        {error && <p className="text-sm text-red-500 font-semibold">{error}</p>}

        <button
          type="submit"
          disabled={loading}
          className="w-full py-3.5 bg-[#183b17] text-white rounded-xl font-bold shadow-md hover:bg-opacity-90 active:scale-95 transition-all disabled:opacity-50"
        >
          {loading ? "Please wait..." : step === "email" ? "Get Reset Code" : step === "otp" ? "Verify Code" : "Update Password"}
        </button>
      </form>
    </div>
  );
};

export default ForgotPasswordFlow;