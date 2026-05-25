const BASE_API_URL = (
  process.env.NEXT_PUBLIC_API_URL ||
  process.env.NEXT_PUBLIC_API_BASE_URL ||
  "http://localhost:4000/api/v1"
).replace(/\/$/, "");

// Ensure base URL ends with /api/v1 if not present
const API_URL = BASE_API_URL.endsWith("/api/v1") ? BASE_API_URL : `${BASE_API_URL}/api/v1`;

// ── Types ─────────────────────────────────────────────────────────────────────

export interface RazorpayOrderData {
  razorpayOrderId: string;
  amount: number; // in paise
  currency: string;
  keyId: string;
  orderId: string; // Internal MongoDB Order ID
}

export interface CreateOrderResponse {
  status: string;
  message?: string;
  data: RazorpayOrderData;
}

export interface VerifyPaymentPayload {
  razorpay_order_id: string;
  razorpay_payment_id: string;
  razorpay_signature: string;
}

export interface VerifyPaymentResponse {
  status: string;
  message?: string;
  data: {
    transaction: {
      status: string;
      [key: string]: any;
    };
    order: {
      paymentStatus: string;
      orderStatus: string;
      [key: string]: any;
    };
  };
}

export interface PaymentStatusResponse {
  status: string;
  message?: string;
  data: {
    orderId: string;
    paymentStatus: string;
    orderStatus: string;
    transactions?: any[];
    [key: string]: any;
  };
}

// ── API Helpers ───────────────────────────────────────────────────────────────

/**
 * Helper to unwrap responses and handle errors
 */
async function handleResponse<T>(response: Response): Promise<T> {
  const payload = await response.json().catch(() => ({}));
  if (!response.ok || payload.status === "error") {
    throw new Error(payload.message || `API request failed with status: ${response.status}`);
  }
  return payload as T;
}

/**
 * Creates a Razorpay order from the backend for an existing internal order
 * @param orderId Internal MongoDB Order ID
 * @param token JWT authorization token
 */
export async function createPaymentOrder(
  orderId: string,
  token: string
): Promise<CreateOrderResponse> {
  const response = await fetch(`${API_URL}/payments/create-order`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ orderId }),
  });
  return handleResponse<CreateOrderResponse>(response);
}

/**
 * Verifies the Razorpay signature and payment details on the backend
 * @param payload Razorpay order, payment, and signature data
 * @param token JWT authorization token
 */
export async function verifyPayment(
  payload: VerifyPaymentPayload,
  token: string
): Promise<VerifyPaymentResponse> {
  const response = await fetch(`${API_URL}/payments/verify`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(payload),
  });
  return handleResponse<VerifyPaymentResponse>(response);
}

/**
 * Gets payment/transaction status for an order
 * @param orderId Internal MongoDB Order ID
 * @param token JWT authorization token
 */
export async function getPaymentStatus(
  orderId: string,
  token: string
): Promise<PaymentStatusResponse> {
  const response = await fetch(`${API_URL}/payments/${orderId}`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return handleResponse<PaymentStatusResponse>(response);
}
