import { Product, SocialClick, SocialLink } from "@/constants";
import axios, { AxiosResponse } from "axios";
import { StaticImageData } from "next/image";

const BASE_API_URL = (
    process.env.NEXT_PUBLIC_API_URL ||
    process.env.NEXT_PUBLIC_API_BASE_URL ||
    "http://localhost:5000/api/v1"
).replace(/\/$/, "");

export const API_URL = BASE_API_URL.endsWith("/api/v1") ? BASE_API_URL : `${BASE_API_URL}/api/v1`;
export const BACKEND_URL = API_URL.replace(/\/api\/v1$/, "");

const apiClient = axios.create({
    baseURL: API_URL,
    validateStatus: () => true,
    headers: {
        "Cache-Control": "no-cache, no-store, must-revalidate",
        "Pragma": "no-cache",
        "Expires": "0",
    },
});

apiClient.interceptors.request.use((config) => {
    config.params = { ...config.params, _t: Date.now() };
    return config;
});

const normalizePageResponse = (payload: any) => {
    if (!payload) return null;
    if (Array.isArray(payload)) return payload;
    if (Array.isArray(payload?.data)) return payload.data;
    if (Array.isArray(payload?.data?.data)) return payload.data.data;

    const direct = payload?.data?.data ?? payload?.data ?? payload;
    if (Array.isArray(direct?.sections)) return direct;
    if (Array.isArray(direct?.data?.sections)) return direct.data;
    if (Array.isArray(direct?.page?.sections)) return direct.page;
    if (Array.isArray(payload?.data?.data?.sections)) return payload.data.data;
    if (Array.isArray(payload?.data?.page?.sections)) return payload.data.page;

    return direct;
};

export async function getPageComponent(slug: string) {
    const response = await apiClient.get(`/component-content/page/${slug}`);

    if (response.status < 200 || response.status >= 300) {
        throw new Error(`Failed to fetch page content for: ${slug}`);
    }

    const payload = response.data;
    if (payload?.status === "error") {
        throw new Error(payload.message || `Failed to fetch page content for: ${slug}`);
    }

    return normalizePageResponse(payload);
}


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
        message: payload.message || (isOk ? "OTP request successful" : "API request failed"),
    };
};

export const getImageUrl = (image?: any) => {
    if (!image || typeof image !== "string") return image || "";
    if (image.startsWith("http")) return image;

    const cleanPath = image.startsWith("/") ? image : `/${image}`;
    if (cleanPath.startsWith("/uploads")) {
        return `${BACKEND_URL}${cleanPath}`;
    }
    return image;
};

export const productApi = {
    list: async (limit = 100) => {
        const response = await apiClient.get(`/products`, { params: { limit } });
        return unwrap<{ products: Product[]; total: number; page: number; limit: number }>(response);
    },
    detail: async (idOrSlug: string) => {
        const response = await apiClient.get(`/products/${idOrSlug}`);
        return unwrap<Product>(response);
    },
};

export const categoryApi = {
    list: async () => {
        const response = await apiClient.get(`/categories`);
        return unwrap<any[]>(response);
    },
};

export const verifyApi = {
    sendEmailOtp: async (email: string, profile: string = "SPEAKER") => {
        const response = await apiClient.post(`/auth/send-email-otp`, { email, purpose: profile });
        return normalizeOtpResponse(response);
    },
    verifyEmailOtp: async (email: string, otp: string) => {
        const response = await apiClient.post(`/auth/verify-email-otp`, { email, otp });
        return normalizeOtpResponse(response);
    },
    sendPhoneOtp: async (phone: string, profile: string = "CONTACT", name: string = "") => {
        const response = await apiClient.post(`/auth/send-phone-otp`, {
            phone,
            purpose: profile,
            message: name ? `Dear ${name}, your IHWE OTP is {{code}}.` : undefined,
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
    return response.data.data.products as Product[];
};


export const socialApi = {
  // Fetch social links
  getLinks: async (): Promise<SocialLink[]> => {
    try {
      const response = await apiClient.get("/social-clicks/links");

      if (
        response.status >= 200 &&
        response.status < 300 &&
        response.data.status === "success"
      ) {
        return response.data.data;
      }

      return [];
    } catch (err) {
      console.error("Failed to fetch social links", err);
      return [];
    }
  },

  // Track click
  trackClick: async (platform: string) => {
    try {
      await apiClient.post("/social-clicks", {
        platform: platform.toLowerCase(),
      });
    } catch (err) {
      console.error("Failed to track social click", err);
    }
  },

  // Analytics list
  getClicks: async (
    page = 1,
    limit = 50,
    platform?: string
  ) => {
    const params: any = { page, limit };
    if (platform) params.platform = platform;

    const response = await apiClient.get("/social-clicks", {
      params,
    });

    return unwrap<{
      clicks: SocialClick[];
      total: number;
      page: number;
      limit: number;
    }>(response);
  },

  // Stats
  getStats: async () => {
    const response = await apiClient.get(
      "/social-clicks/stats"
    );

    return unwrap<
      {
        _id: string;
        count: number;
      }[]
    >(response);
  },
};

export const applicationApi = {
  create: async (formData: FormData) => {
    const response = await apiClient.post(
      "/applications",
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );

    return unwrap<any>(response);
  },
};

export const blogApi = {
  list: async (): Promise<any[]> => {
    try {
      const response = await apiClient.get(`/blogs`);
      if (
        response.status >= 200 &&
        response.status < 300 &&
        response.data.status === "success"
      ) {
        return response.data.data;
      }
      return [];
    } catch (err) {
      console.error("Failed to fetch blogs", err);
      return [];
    }
  },

  detail: async (slug: string): Promise<any> => {
    try {
      const response = await apiClient.get(`/blogs/${slug}`);
      if (
        response.status >= 200 &&
        response.status < 300 &&
        response.data.status === "success"
      ) {
        return response.data.data;
      }
      return null;
    } catch (err) {
      console.error("Failed to fetch blog detail", err);
      return null;
    }
  },
};