const BASE_API_URL = ((window.location.hostname === "localhost" ? "http://localhost:5000/api" : "/api")).replace(/\/$/, "");
export const API_URL = BASE_API_URL.endsWith("/api") ? BASE_API_URL : `${BASE_API_URL}/api`;
export const verifyApi = {
    sendEmailOtp: async (email: string, profile: string = 'SPEAKER') => {
        const response = await fetch(`${API_URL}/verify/send-email-otp`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, profile })
        });
        return await response.json();
    },
    verifyEmailOtp: async (email: string, otp: string) => {
        const response = await fetch(`${API_URL}/verify/verify-email-otp`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, otp })
        });
        return await response.json();
    },
    sendPhoneOtp: async (phone: string, profile: string = 'CONTACT', name: string = '') => {
        const response = await fetch(`${API_URL}/verify/send-phone-otp`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ phone, profile, name: name || null })
        });
        return await response.json();
    },
    verifyPhoneOtp: async (phone: string, otp: string) => {
        const response = await fetch(`${API_URL}/verify/verify-phone-otp`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ phone, otp })
        });
        return await response.json();
    }
};