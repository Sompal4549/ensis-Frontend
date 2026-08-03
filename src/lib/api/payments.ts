const BASE_URL = process.env.NEXT_PUBLIC_API_URL; // e.g. https://api.yourapp.com

// ── Types ─────────────────────────────────────────────────────────────────────

export interface CreateOrderPayload {
  amount: number;        // in paise (₹1 = 100)
  currency?: string;     // default "INR"
  receipt?: string;
  notes?: Record<string, string>;
}

export interface CreateOrderResponse {
  orderId: string;
  amount: number;
  currency: string;
  keyId: string;         // Razorpay public key — returned by your backend
}

export interface VerifyPayload {
  razorpay_order_id: string;
  razorpay_payment_id: string;
  razorpay_signature: string;
}

export interface PaymentStatus {
  orderId: string;
  status: "created" | "attempted" | "paid" | "failed";
  amount: number;
  currency: string;
  paymentId?: string;
}

// ── Helpers ───────────────────────────────────────────────────────────────────

async function apiFetch<T>(path: string, options?: RequestInit): Promise<T> {
  const res = await fetch(`${BASE_URL}${path}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      // attach JWT / session token if you have auth
      Authorization: `Bearer ${getToken()}`,
      ...options?.headers,
    },
  });

  if (!res.ok) {
    const error = await res.json().catch(() => ({}));
    throw new Error(error?.message ?? `Request failed: ${res.status}`);
  }

  return res.json();
}

function getToken() {
  // swap with your auth store / cookie / localStorage
  return localStorage.getItem("ensis_access_token") ?? "";
}

// ── Payment API calls ─────────────────────────────────────────────────────────

export const paymentsApi = {
  createOrder: (payload: CreateOrderPayload) =>
    apiFetch<CreateOrderResponse>("/api/v1/payments/create-order", {
      method: "POST",
      body: JSON.stringify(payload),
    }),

  verifyPayment: (payload: VerifyPayload) =>
    apiFetch<{ success: boolean; message: string }>("/api/v1/payments/verify", {
      method: "POST",
      body: JSON.stringify(payload),
    }),

  getPaymentStatus: (orderId: string) =>
    apiFetch<PaymentStatus>(`/api/v1/payments/${orderId}`),
};