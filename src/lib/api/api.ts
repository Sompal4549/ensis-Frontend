import { Product, SocialClick, SocialLink } from "@/constants";
import { authStore } from "@/lib/auth";
import axios, { AxiosResponse } from "axios";
import { StaticImageData } from "next/image";
import { cache } from "react";

const BASE_API_URL = (
    process.env.NEXT_PUBLIC_API_URL ||
    process.env.NEXT_PUBLIC_API_BASE_URL ||
    "http://localhost:5000/api/v1"
).replace(/\/$/, "");

export const API_URL = BASE_API_URL.endsWith("/api/v1") ? BASE_API_URL : `${BASE_API_URL}/api/v1`;
export const BACKEND_URL = API_URL.replace(/\/api\/v1$/, "");

const apiClient = axios.create({
    baseURL: API_URL,
    timeout: 10000,
    validateStatus: () => true,
    headers: {
        "Cache-Control": "no-cache, no-store, must-revalidate",
        "Pragma": "no-cache",
        "Expires": "0",
    },
});

// ─── Silent dual-token refresh (access 15m / refresh 7d) ─────────────────────
const REFRESH_TOKEN_KEY = "ensis_refresh_token";
const ACCESS_TOKEN_KEY = "ensis_access_token";

// Single-flight: concurrent 401s share one refresh round-trip
let refreshInFlight: Promise<string | null> | null = null;

const refreshAccessToken = (): Promise<string | null> => {
  if (typeof window === "undefined") return Promise.resolve(null);

  if (!refreshInFlight) {
    refreshInFlight = (async () => {
      try {
        const refreshToken = localStorage.getItem(REFRESH_TOKEN_KEY);
        if (!refreshToken) return null;

        // Plain axios so the refresh call never re-enters apiClient interceptors
        const response = await axios.post(
          `${API_URL}/auth/refresh`,
          { refreshToken },
          { withCredentials: true, headers: { "Content-Type": "application/json" } }
        );

        const payload = response.data;
        if (!payload || payload?.success === false || payload?.status === "error") return null;

        const nextAccess = payload?.data?.accessToken ?? payload?.accessToken;
        if (!nextAccess) return null;

        const nextRefresh =
          payload?.data?.refreshToken ?? payload?.refreshToken ?? refreshToken;

        localStorage.setItem(ACCESS_TOKEN_KEY, nextAccess);
        localStorage.setItem(REFRESH_TOKEN_KEY, nextRefresh);
        window.dispatchEvent(new Event("ensis-auth-change"));
        return nextAccess;
      } catch {
        return null;
      } finally {
        refreshInFlight = null;
      }
    })();
  }

  return refreshInFlight;
};

const forceLogout = () => {
  localStorage.removeItem(ACCESS_TOKEN_KEY);
  localStorage.removeItem(REFRESH_TOKEN_KEY);
  localStorage.removeItem("ensis_user");
  window.dispatchEvent(new Event("ensis-auth-change"));
  window.location.href = "/login";
};

apiClient.interceptors.request.use(async (config) => {
  // Component content requests ko cache hone do
  if (!config.url?.startsWith("/component-content")) {
    config.params = {
      ...config.params,
      _t: Date.now(),
    };
  }

  if (typeof window !== "undefined") {
    const token = localStorage.getItem(ACCESS_TOKEN_KEY);
    if (token) {
      if (authStore.isTokenExpired(token)) {
        // Access token expired → rotate silently instead of losing the session
        const refreshed = await refreshAccessToken();
        if (refreshed) {
          config.headers.Authorization = `Bearer ${refreshed}`;
        } else {
          forceLogout();
          return config;
        }
      } else {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
  }

  return config;
});

apiClient.interceptors.response.use(
  async (response) => {
    if (response.status !== 401 || typeof window === "undefined") {
      return response;
    }

    const url = String(response.config?.url || "");
    const isAuthRequest =
      url.includes("/auth/login") ||
      url.includes("/auth/register") ||
      url.includes("/auth/refresh") ||
      url.includes("/auth/whatsapp-otp");

    if (isAuthRequest) return response;

    const config = response.config as typeof response.config & { _retry?: boolean };
    if (config._retry) {
      forceLogout();
      return response;
    }
    config._retry = true;

    const refreshed = await refreshAccessToken();
    if (!refreshed) {
      forceLogout();
      return response;
    }

    const headers = config.headers as unknown as
      | { set?: (k: string, v: string) => void; Authorization?: string }
      | undefined;
    if (headers && typeof headers.set === "function") {
      headers.set("Authorization", `Bearer ${refreshed}`);
    } else if (headers) {
      headers.Authorization = `Bearer ${refreshed}`;
    }

    return apiClient.request(config);
  },
  (error) => {
    return Promise.reject(error);
  }
);

const normalizePageResponse = (payload: any) => {
    if (!payload) return null;
    if (Array.isArray(payload)) return payload;
    if (Array.isArray(payload?.data)) return payload.data;
    if (Array.isArray(payload?.data?.data)) return payload.data.data;

    // Handle Organic Envelope format: { success: true, statusCode: 200, data: { ... } }
    if (payload && payload.success !== undefined && payload.data !== undefined) {
        return payload.data;
    }

    const direct = payload?.data?.data ?? payload?.data ?? payload;
    if (Array.isArray(direct?.sections)) return direct;
    if (Array.isArray(direct?.data?.sections)) return direct.data;
    if (Array.isArray(direct?.page?.sections)) return direct.page;
    if (Array.isArray(payload?.data?.data?.sections)) return payload.data.data;
    if (Array.isArray(payload?.data?.page?.sections)) return payload.data.page;

    return direct;
};

export const getPageComponent = cache(async (slug: string) => {
    try {
        const response = await fetch(`${API_URL}/component-content/page/${slug}`, {
            next: { revalidate: 60 },
            signal: AbortSignal.timeout(5000),
        });

        if (!response.ok) {
            console.warn(`[getPageComponent] Status ${response.status} for page "${slug}". Using fallback.`);
            return null;
        }

        const payload = await response.json();
        if (payload?.status === "error" || payload?.success === false) {
            console.warn(`[getPageComponent] API error for page "${slug}":`, payload.message);
            return null;
        }

        return normalizePageResponse(payload);
    } catch (error: any) {
        console.warn(`[getPageComponent] Unable to fetch page content for "${slug}": ${error?.message || "connection error"}`);
        return null;
    }
});


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
    const isOk = response.status >= 200 && response.status < 300;

    // Handle new Organic Envelope format: { success: true, statusCode: 200, data: { ... } }
    if (payload && payload.success !== undefined) {
        if (!payload.success) {
            throw new Error(payload.message || "API request failed");
        }
        return payload.data as T;
    }

    if (!isOk || payload.status === "error" || payload.success === false) {
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

export const getImageUrl = (image?: any, width?: number) => {
    if (!image || typeof image !== "string") return image || "";
    if (image.startsWith("http")) {
        if (image.includes("res.cloudinary.com") && image.includes("/image/upload/")) {
            const transforms = `w_${width || 1600},f_auto,q_auto`;
            if (!image.includes("f_auto")) {
                return image.replace("/image/upload/", `/image/upload/${transforms}/`);
            }
        }
        return image;
    }

    const cleanPath = image.startsWith("/") ? image : `/${image}`;
    if (cleanPath.startsWith("/uploads")) {
        return `${BACKEND_URL}${cleanPath}`;
    }
    return image;
};

export const productApi = {
    list: async (limit = 100, page = 1, sortBy = "orderBy", order = "asc") => {
        const response = await apiClient.get(`/products`, { params: { limit, page, sortBy, order } });
        return unwrap<{
          data: any; products: Product[]; total: number; page: number; limit: number 
}>(response);
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


export const getComponentContent = cache(
  async <T>(key: string, fallback: T): Promise<T> => {
    try {
      const response = await apiClient.get(`/component-content/${key}`);
      const payload = response.data;
      if (
        response.status < 200 ||
        response.status >= 300 ||
        payload?.status === "error" ||
        payload?.success === false
      ) {
        return fallback;
      }

      return {
        ...fallback,
        ...(payload?.data?.data ?? payload?.data ?? {}),
      };
    } catch {
      return fallback;
    }
  }
);
export const getProducts = async () => {
    try {
        const response = await apiClient.get(`/products?limit=100`);
        return (response.data.data.products || []) as Product[];
    } catch (error) {
        console.error("Error fetching products:", error);
        return [] as Product[];
    }
};


export const socialApi = {
  // Fetch social links
  getLinks: async (): Promise<SocialLink[]> => {
    try {
      const response = await apiClient.get("/social-clicks/links");
      const payload = response.data;
      const isOk = response.status >= 200 && response.status < 300;
      
      // Handle Organic Envelope format: { success: true, statusCode: 200, data: { ... } }
      if (payload && payload.success !== undefined && payload.data !== undefined) {
        return payload.data;
      }

      if (!isOk || payload.status === "error" || payload.success === false) {
        return [];
      }

      return payload.data || [];
    } catch (err) {
      console.error("Failed to fetch social links", err);
      return [];
    }
  },

  // Track click
  trackClick: async (platform: string) => {
    try {
      let clientIp = "";
      try {
        const ipRes = await fetch("https://api.ipify.org?format=json");
        const ipData = await ipRes.json();
        clientIp = ipData.ip || "";
      } catch {}

      await apiClient.post(
        "/social-clicks",
        { platform: platform.toLowerCase() },
        { headers: clientIp ? { "x-client-ip": clientIp } : {} }
      );
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

export type Career = {
  _id: string;
  title: string;
  department: string;
  location: string;
  type: string;
  experience: string;
  status: "active" | "closed";
};

export const careerApi = {
  list: async (): Promise<Career[]> => {
    const response = await apiClient.get(`/careers`);
    return unwrap<Career[]>(response);
  },
};

export const blogApi = {
  list: async (): Promise<any[]> => {
    try {
      const response = await apiClient.get(`/blogs`);
      const payload = response.data;
      const isOk = response.status >= 200 && response.status < 300;
      
      // Handle Organic Envelope format: { success: true, statusCode: 200, data: { ... } }
      if (payload && payload.success !== undefined && payload.data !== undefined) {
        return payload.data;
      }

      if (!isOk || payload.status === "error" || payload.success === false) {
        return [];
      }

      return payload.data || [];
    } catch (err) {
      console.error("Failed to fetch blogs", err);
      return [];
    }
  },

  detail: async (slug: string): Promise<any> => {
    try {
      const response = await apiClient.get(`/blogs/${slug}`);
      const payload = response.data;
      const isOk = response.status >= 200 && response.status < 300;
      
      // Handle Organic Envelope format: { success: true, statusCode: 200, data: { ... } }
      if (payload && payload.success !== undefined && payload.data !== undefined) {
        return payload.data;
      }

      if (!isOk || payload.status === "error" || payload.success === false) {
        return null;
      }

      return payload.data || null;
    } catch (err) {
      console.error("Failed to fetch blog detail", err);
      return null;
    }
  },
};

export type InvoiceItem = {
  product?: string;
  name: string;
  description?: string;
  quantity: number;
  unitPrice: number;
  gstRate: number;
  amount: number;
};

export type InvoiceAddress = {
  name: string;
  email?: string;
  phone?: string;
  addressLine?: string;
  city?: string;
  state?: string;
  postalCode?: string;
  country?: string;
  gstNumber?: string;
};

export type Invoice = {
  _id: string;
  invoiceNumber: string;
  type: "proforma" | "tax" | "credit_note" | "debit_note" | "delivery_challan";
  lead: string;
  order?: string;
  items: InvoiceItem[];
  billingAddress: InvoiceAddress;
  shippingAddress?: InvoiceAddress;
  subtotal: number;
  discount: number;
  tax: number;
  shipping: number;
  totalAmount: number;
  status: "draft" | "sent" | "paid" | "partial" | "overdue" | "cancelled";
  paymentReceived: number;
  paymentDate?: string;
  dueDate?: string;
  notes?: string;
  termsAndConditions?: string;
  createdAt: string;
  updatedAt: string;
};

export const invoiceApi = {
  createFromOrder: async (orderId: string): Promise<Invoice> => {
    const response = await apiClient.post(`/invoices/from-order/${orderId}`);
    return unwrap<Invoice>(response);
  },

  getById: async (id: string): Promise<Invoice> => {
    const response = await apiClient.get(`/invoices/${id}`);
    return unwrap<Invoice>(response);
  },

  getHtml: async (id: string): Promise<string> => {
    const response = await apiClient.get(`/invoices/${id}/html`, {
      responseType: "text",
    });
    if (response.status >= 200 && response.status < 300) {
      return response.data;
    }
    throw new Error(response.data?.message || "Failed to fetch invoice HTML");
  },

  sendEmail: async (id: string) => {
    const response = await apiClient.post(`/invoices/${id}/send-email`);
    return unwrap<{ success: boolean; message: string }>(response);
  },

  sendWhatsApp: async (id: string) => {
    const response = await apiClient.post(`/invoices/${id}/send-whatsapp`);
    return unwrap<{ success: boolean; message: string }>(response);
  },
};