const TOKEN_KEY = "ensis_access_token";
const USER_KEY = "ensis_user";

export const AUTH_CHANGE_EVENT = "ensis-auth-change";

export const authStore = {
  getToken: (): string => {
    if (typeof window === "undefined") return "";
    return localStorage.getItem(TOKEN_KEY) || "";
  },

  getUser: <T = { name?: string; email?: string }>(): T | null => {
    if (typeof window === "undefined") return null;
    const raw = localStorage.getItem(USER_KEY);
    if (!raw) return null;
    try {
      return JSON.parse(raw) as T;
    } catch {
      return null;
    }
  },

  setSession: (token: string, user: unknown) => {
    localStorage.setItem(TOKEN_KEY, token);
    localStorage.setItem(USER_KEY, JSON.stringify(user));
  },

  clear: () => {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
  },

  isTokenExpired: (token?: string): boolean => {
    const value = token ?? authStore.getToken();
    if (!value) return true;
    try {
      const payload = value.split(".")[1];
      if (!payload) return true;
      const normalized = payload.replace(/-/g, "+").replace(/_/g, "/");
      const decoded = JSON.parse(window.atob(normalized));
      if (!decoded.exp) return false;
      return decoded.exp * 1000 <= Date.now();
    } catch {
      return true;
    }
  },

  isLoggedIn: (): boolean => {
    const token = authStore.getToken();
    return !!token && !authStore.isTokenExpired(token);
  },
};

export const notifyAuthChange = () => {
  if (typeof window === "undefined") return;
  window.dispatchEvent(new Event(AUTH_CHANGE_EVENT));
};