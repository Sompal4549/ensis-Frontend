import { API_URL } from "@/lib/api/api";

// ── Types ─────────────────────────────────────────────────────────────────────

export interface RazorpayOrderData {
  razorpayOrderId: string;
  amount: number; // in paise
  currency: string;
  keyId: string;
  orderId: string; // Internal MongoDB Order ID
}

export interface CreateOrderResponse {
  success?: boolean;
  statusCode?: number;
  message?: string;
  status?: string;
  data: RazorpayOrderData;
}

export interface VerifyPaymentPayload {
  razorpay_order_id: string;
  razorpay_payment_id: string;
  razorpay_signature: string;
}

export interface VerifyPaymentResponse {
  success?: boolean;
  statusCode?: number;
  message?: string;
  status?: string;
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
  success?: boolean;
  statusCode?: number;
  message?: string;
  status?: string;
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
  const isOk = response.ok;
  const hasSuccess = payload.hasOwnProperty('success');
  
  // Handle Organic Envelope format: { success: true, statusCode: 200, data: { ... } }
  if (hasSuccess) {
    if (!payload.success || !isOk) {
      throw new Error(payload.message || `API request failed`);
    }
    return (payload.data !== undefined ? payload.data : payload) as T;
  }
  
  if (!isOk || payload.status === "error") {
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
): Promise<RazorpayOrderData> {
  const response = await fetch(`${API_URL}/payments/create-order`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ orderId }),
  });
  return handleResponse<RazorpayOrderData>(response);
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
