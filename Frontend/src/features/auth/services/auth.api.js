import axios from "axios";

/**
 * Authentication API Service
 * Author: Shubham Pandey
 */

const BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:3000";

export const authApi = axios.create({
    baseURL: BASE_URL,
    withCredentials: true,
});

// Attach Authorization Bearer token from localStorage if available
authApi.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem("interview_ai_token");
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

export async function register({ username, email, password }) {
    try {
        const response = await authApi.post("/api/auth/register", {
            username,
            email,
            password,
        });

        if (response.data?.data?.token) {
            localStorage.setItem("interview_ai_token", response.data.data.token);
        }
        return response.data?.data || response.data;
    } catch (err) {
        const message = err.response?.data?.message || err.message || "Failed to register account";
        throw new Error(message);
    }
}

export async function login({ email, password }) {
    try {
        const response = await authApi.post("/api/auth/login", {
            email,
            password,
        });

        if (response.data?.data?.token) {
            localStorage.setItem("interview_ai_token", response.data.data.token);
        }
        return response.data?.data || response.data;
    } catch (err) {
        const message = err.response?.data?.message || err.message || "Invalid email or password";
        throw new Error(message);
    }
}

export async function logout() {
    try {
        await authApi.post("/api/auth/logout");
    } catch (err) {
        console.warn("Logout request warning:", err.message);
    } finally {
        localStorage.removeItem("interview_ai_token");
    }
}

export async function getMe() {
    try {
        const response = await authApi.get("/api/auth/get-me");
        return response.data?.data || response.data;
    } catch (err) {
        localStorage.removeItem("interview_ai_token");
        throw new Error(err.response?.data?.message || "Failed to fetch user session");
    }
}

export async function updateProfile({ username, email }) {
    try {
        const response = await authApi.put("/api/auth/profile", { username, email });
        return response.data?.data || response.data;
    } catch (err) {
        throw new Error(err.response?.data?.message || "Failed to update profile");
    }
}
