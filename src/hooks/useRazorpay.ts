import { useState, useCallback } from "react";
import { createPaymentOrder, verifyPayment, RazorpayOrderData } from "@/utils/payment";

const ENSIS_LOGO_URL =
  "https://res.cloudinary.com/ddjhixcwh/image/upload/v1785758490/ensis/hlirvxf09yovla9qu21n.webp";

function loadRazorpayScript(): Promise<boolean> {
  return new Promise((resolve) => {
    if (typeof window === "undefined") return resolve(false);
    if ((window as any).Razorpay) return resolve(true);

    const existingScript = document.getElementById("razorpay-sdk") as HTMLScriptElement;
    if (existingScript) {
      // If the script exists but Razorpay is not yet loaded, wait for the load/error events
      existingScript.addEventListener("load", () => {
        resolve(!!(window as any).Razorpay);
      });
      existingScript.addEventListener("error", () => resolve(false));
      
      // Safety timeout: if it takes more than 5 seconds, check one last time and resolve
      setTimeout(() => {
        resolve(!!(window as any).Razorpay);
      }, 5000);
      return;
    }

    const script = document.createElement("script");
    script.id = "razorpay-sdk";
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.async = true;
    script.onload = () => resolve(!!(window as any).Razorpay);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
}

export interface UseRazorpayOptions {
  onSuccess?: (paymentId: string, orderId: string, result: any) => void;
  onFailure?: (error: string) => void;
}

export function useRazorpay({ onSuccess, onFailure }: UseRazorpayOptions = {}) {
  const [loading, setLoading] = useState(false);
  const [verifying, setVerifying] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const initiatePayment = useCallback(
    async (orderId: string, token: string) => {
      setLoading(true);
      setError(null);

      try {
        // 1. Load Razorpay SDK
        const scriptLoaded = await loadRazorpayScript();
        if (!scriptLoaded) {
          throw new Error("Failed to load Razorpay Checkout SDK. Please check your internet connection.");
        }

        // 2. Create Razorpay order on backend
        const orderResponse = await createPaymentOrder(orderId, token);
        const orderData: RazorpayOrderData = orderResponse.data;

        // 3. Extract user metadata for prefilling Razorpay Checkout form
        let prefill = {
          name: "",
          email: "",
          contact: "",
        };

        try {
          const userJson = localStorage.getItem("ensis_user");
          if (userJson) {
            const user = JSON.parse(userJson);
            prefill = {
              name: user.name || [user.firstName, user.lastName].filter(Boolean).join(" ") || "",
              email: user.email || "",
              contact: user.phone || "",
            };
          }
        } catch (e) {
          console.warn("Failed to retrieve user information from localStorage for prefilling:", e);
        }

        // 4. Set up Razorpay Checkout options
        const options = {
          key: orderData.keyId,
          amount: orderData.amount, // amount in paise
          currency: orderData.currency,
          name: "Ensis",
          description: "Payment for Order #" + orderId.slice(-6).toUpperCase(),
          image: ENSIS_LOGO_URL,
          order_id: orderData.razorpayOrderId,
          prefill,
          theme: {
            color: "#4f46e5", // Elegant Indigo to match premium aesthetics
          },
          handler: async (response: any) => {
            setLoading(false);
            setVerifying(true);
            try {
              // 5. Trigger verify payment endpoint on backend
              const verifyRes = await verifyPayment(
                {
                  razorpay_order_id: response.razorpay_order_id,
                  razorpay_payment_id: response.razorpay_payment_id,
                  razorpay_signature: response.razorpay_signature,
                },
                token
              );

              setVerifying(false);
              onSuccess?.(response.razorpay_payment_id, orderId, verifyRes);
            } catch (err: any) {
              setVerifying(false);
              const errMsg = err.message || "Payment verification failed.";
              setError(errMsg);
              onFailure?.(errMsg);
            }
          },
          modal: {
            ondismiss: () => {
              setLoading(false);
              setVerifying(false);
              onFailure?.("Payment window closed by user.");
            },
          },
        };

        // 5. Open Razorpay Checkout modal
        const rzp = new (window as any).Razorpay(options);
        
        rzp.on("payment.failed", (response: any) => {
          setLoading(false);
          const failedMsg = response.error?.description || "Payment failed.";
          setError(failedMsg);
          onFailure?.(failedMsg);
        });

        rzp.open();
      } catch (err: any) {
        setLoading(false);
        setVerifying(false);
        const errMsg = err.message || "Failed to initiate payment flow.";
        setError(errMsg);
        onFailure?.(errMsg);
      }
    },
    [onSuccess, onFailure]
  );

  return { initiatePayment, loading, verifying, error };
}
