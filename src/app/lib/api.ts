import axios, { AxiosResponse } from "axios";

const BASE_API_URL = (
  process.env.NEXT_PUBLIC_API_URL ||
  process.env.NEXT_PUBLIC_API_BASE_URL ||
  "http://localhost:5000/api/v1"
).replace(/\/$/, "");

export const API_URL = BASE_API_URL.endsWith("/api/v1") ? BASE_API_URL : `${BASE_API_URL}/api/v1`;
export const BACKEND_URL = API_URL.replace(/\/api\/v1$/, "");

const apiClient = axios.create({
    baseURL: API_URL,
    validateStatus: () => true, // Handle status codes manually to match previous fetch logic
});

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

const unwrap = <T>(response: AxiosResponse): T => {
    const payload = response.data;
    if (response.status < 200 || response.status >= 300 || payload.status === "error") {
        throw new Error(payload.message || "API request failed");
    }
    return payload.data as T;
};

const normalizeOtpResponse = (response: AxiosResponse) => {
    const payload = response.data;
    const isOk = response.status >= 200 && response.status < 300;
    return {
        ...payload,
        success: isOk && (payload.success === true || payload.status === "success"),
        message: payload.message || (isOk ? "OTP request successful" : "API request failed")
    };
};

export const getImageUrl = (image?: any) => {
    if (!image || typeof image !== "string") return image || "";
    if (image.startsWith("http")) return image;

    // Ensure we have a leading slash but no double slashes
    const cleanPath = image.startsWith("/") ? image : `/${image}`;
    if (cleanPath.startsWith("/uploads")) {
        return `${BACKEND_URL}${cleanPath}`;
    }
    return image;
};

export const productApi = {
    list: async (limit = 8) => {
        const response = await apiClient.get(`/products`, { params: { limit } });
        return unwrap<{ products: Product[]; total: number; page: number; limit: number }>(response);
    },
    detail: async (idOrSlug: string) => {
        const response = await apiClient.get(`/products/${idOrSlug}`);
        return unwrap<Product>(response);
    }
};

export const verifyApi = {
    sendEmailOtp: async (email: string, profile: string = 'SPEAKER') => {
        const response = await apiClient.post(`/auth/send-email-otp`, {
            email,
            purpose: profile
        });
        return normalizeOtpResponse(response);
    },
    verifyEmailOtp: async (email: string, otp: string) => {
        const response = await apiClient.post(`/auth/verify-email-otp`, { email, otp });
        return normalizeOtpResponse(response);
    },
    sendPhoneOtp: async (phone: string, profile: string = 'CONTACT', name: string = '') => {
        const response = await apiClient.post(`/auth/send-phone-otp`, {
            phone,
            purpose: profile,
            message: name ? `Dear ${name}, your IHWE OTP is {{code}}.` : undefined
        });
        return normalizeOtpResponse(response);
    },
    verifyPhoneOtp: async (phone: string, otp: string) => {
        const response = await apiClient.post(`/auth/verify-phone-otp`, { phone, otp });
        return normalizeOtpResponse(response);
    },
};

export const getComponentContent = async <T>(key: string, fallback: T): Promise<T> => {
    try {
        const response = await apiClient.get(`/component-content/${key}`);
        if (response.status < 200 || response.status >= 300 || response.data.status === "error") return fallback;
        return { ...fallback, ...(response.data.data?.data || {}) };
    } catch {
        return fallback;
    }
};

export const getProducts = async () => {
    const response = await apiClient.get(`/products?limit=100`);
    console.log(response,"produts")
    return response.data.data.products;
};