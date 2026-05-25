import React from "react";
import { CreditCard, Loader2, ShieldCheck, AlertCircle } from "lucide-react";
import { useRazorpay } from "@/hooks/useRazorpay";

interface RazorpayCheckoutProps {
  orderId: string;
  token: string;
  onSuccess?: (paymentId: string, orderId: string, result: any) => void;
  onFailure?: (error: string) => void;
  amount: number; // For displaying amount in friendly currency, e.g. 1500.00
  disabled?: boolean;
}

export function RazorpayCheckout({
  orderId,
  token,
  onSuccess,
  onFailure,
  amount,
  disabled = false,
}: RazorpayCheckoutProps) {
  const { initiatePayment, loading, verifying, error } = useRazorpay({
    onSuccess,
    onFailure,
  });

  const handlePay = async () => {
    if (!orderId || !token) return;
    await initiatePayment(orderId, token);
  };

  const isPending = loading || verifying;

  return (
    <div className="w-full space-y-3">
      <button
        type="button"
        onClick={handlePay}
        disabled={disabled || isPending}
        className={`relative w-full overflow-hidden rounded-xl border border-white/10 px-6 py-4 font-bold tracking-wide text-white shadow-2xl transition-all duration-300 active:scale-[0.98] ${
          disabled || isPending
            ? "cursor-not-allowed bg-slate-800/50 text-slate-400"
            : "bg-gradient-to-r from-indigo-600 via-purple-600 to-indigo-700 hover:from-indigo-500 hover:via-purple-500 hover:to-indigo-600 hover:shadow-indigo-500/25 hover:shadow-[0_12px_30px_-6px]"
        }`}
      >
        {/* Glowing backdrop micro-animation */}
        {!disabled && !isPending && (
          <span className="absolute inset-0 block bg-gradient-to-r from-transparent via-white/10 to-transparent translate-x-[-100%] hover:animate-[shimmer_1.5s_infinite]" />
        )}

        <div className="flex items-center justify-center gap-3">
          {loading ? (
            <>
              <Loader2 className="h-5 w-5 animate-spin" />
              <span className="animate-pulse">Loading Razorpay...</span>
            </>
          ) : verifying ? (
            <>
              <Loader2 className="h-5 w-5 animate-spin" />
              <span className="animate-pulse">Verifying Payment...</span>
            </>
          ) : (
            <>
              <CreditCard className="h-5 w-5 transition-transform duration-300 group-hover:scale-110" />
              <span>Pay Securely ₹{amount.toFixed(2)}</span>
            </>
          )}
        </div>
      </button>

      {/* Trust & Verification Badges */}
      <div className="flex items-center justify-center gap-2 text-[11px]">
        <ShieldCheck className="h-4 w-4 text-[#516a35]" />
        <span className="font-semibold text-slate-500">Secured by Razorpay • 256-bit SSL Encryption</span>
      </div>

      {/* Visual State Indicators */}
      {verifying && (
        <div className="animate-fade-in rounded-lg bg-indigo-500/10 border border-indigo-500/20 p-3 text-center text-xs font-semibold text-indigo-700 flex items-center justify-center gap-2">
          <Loader2 className="h-4 w-4 animate-spin text-indigo-600" />
          <span>Validating transactions securely with Ensis servers. Please do not close or refresh this window.</span>
        </div>
      )}

      {error && (
        <div className="animate-shake rounded-lg bg-rose-50 border border-rose-200 p-3 text-xs font-medium text-rose-600 flex items-start gap-2">
          <AlertCircle className="h-4 w-4 mt-0.5 shrink-0 text-rose-500" />
          <span className="leading-5">{error}</span>
        </div>
      )}
    </div>
  );
}
