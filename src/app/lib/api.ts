const BASE_API_URL = (
  process.env.NEXT_PUBLIC_API_URL ||
  process.env.NEXT_PUBLIC_API_BASE_URL ||
  "http://localhost:5000/api/v1"
).replace(/\/$/, "");

export const API_URL = BASE_API_URL.endsWith("/api/v1") ? BASE_API_URL : `${BASE_API_URL}/api/v1`;
export const BACKEND_URL = API_URL.replace(/\/api\/v1$/, "");

export type Product = {
    _id: string;
    title: string;
    slug: string;
    description: string;
    price: number;
    discountPrice?: number;
    images?: string[];
    stock?: number;
    averageRating?: number;
    category?: { _id: string; name: string; slug: string } | string;
};

export type ComponentContent<T> = {
    _id: string;
    key: string;
    label: string;
    page: string;
    description?: string;
    data: T;
    isActive: boolean;
};

const unwrap = async <T>(response: Response): Promise<T> => {
    const payload = await response.json();
    if (!response.ok || payload.status === "error") {
        throw new Error(payload.message || "API request failed");
    }
    return payload.data as T;
};

const normalizeOtpResponse = async (response: Response) => {
    const payload = await response.json();
    return {
        ...payload,
        success: response.ok && (payload.success === true || payload.status === "success"),
        message: payload.message || (response.ok ? "OTP request successful" : "API request failed")
    };
};

export const getImageUrl = (image?: string) => {
    if (!image) return "";
    if (image.startsWith("http")) return image;
    if (!image.startsWith("/uploads")) return image;
    return `${BACKEND_URL}${image.startsWith("/") ? image : `/${image}`}`;
};

export const productApi = {
    list: async (limit = 8) => {
        const response = await fetch(`${API_URL}/products?limit=${limit}`, { next: { revalidate: 60 } });
        return unwrap<{ products: Product[]; total: number; page: number; limit: number }>(response);
    },
    detail: async (idOrSlug: string) => {
        const response = await fetch(`${API_URL}/products/${idOrSlug}`, { next: { revalidate: 60 } });
        return unwrap<Product>(response);
    }
};

export const verifyApi = {
    sendEmailOtp: async (email: string, profile: string = 'SPEAKER') => {
        const response = await fetch(`${API_URL}/auth/send-email-otp`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, purpose: profile })
        });
        return normalizeOtpResponse(response);
    },
    verifyEmailOtp: async (email: string, otp: string) => {
        const response = await fetch(`${API_URL}/auth/verify-email-otp`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, otp })
        });
        return normalizeOtpResponse(response);
    },
    sendPhoneOtp: async (phone: string, profile: string = 'CONTACT', name: string = '') => {
        const response = await fetch(`${API_URL}/auth/send-phone-otp`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                phone,
                purpose: profile,
                message: name ? `Dear ${name}, your IHWE OTP is {{code}}.` : undefined
            })
        });
        return normalizeOtpResponse(response);
    },
    verifyPhoneOtp: async (phone: string, otp: string) => {
        const response = await fetch(`${API_URL}/auth/verify-phone-otp`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ phone, otp })
        });
        return normalizeOtpResponse(response);
    }
};

export const getComponentContent = async <T>(key: string, fallback: T): Promise<T> => {
    try {
        const response = await fetch(`${API_URL}/component-content/${key}`, { cache: "no-store" });
        const payload = await response.json();
        if (!response.ok || payload.status === "error") return fallback;
        return { ...fallback, ...(payload.data?.data || {}) };
    } catch {
        return fallback;
    }
};
