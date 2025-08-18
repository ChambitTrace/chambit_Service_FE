import { useCallback, useState } from "react";
import axios from "axios";

// ===== Simple token store (localStorage-based) =====
// NOTE: This is convenient but susceptible to XSS. Use HttpOnly cookies in production if possible.
const ACCESS_TOKEN_KEY = "accessToken";
const REFRESH_TOKEN_KEY = "refreshToken";

export const tokenStore = {
  getAccessToken(): string | null {
    return localStorage.getItem(ACCESS_TOKEN_KEY);
  },
  getRefreshToken(): string | null {
    return localStorage.getItem(REFRESH_TOKEN_KEY);
  },
  setTokens(at: string, rt?: string) {
    localStorage.setItem(ACCESS_TOKEN_KEY, at);
    if (rt) localStorage.setItem(REFRESH_TOKEN_KEY, rt);
    // set axios default header for subsequent requests
    axios.defaults.headers.common["Authorization"] = `Bearer ${at}`;
  },
  clear() {
    localStorage.removeItem(ACCESS_TOKEN_KEY);
    localStorage.removeItem(REFRESH_TOKEN_KEY);
    delete axios.defaults.headers.common["Authorization"];
  },
};

// ===== Axios base config =====
// You can set VITE_API_URL or fallback to relative path
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://chambit.kro.kr:8000",
});

// Attach token to each request if present
api.interceptors.request.use((config) => {
  const at = tokenStore.getAccessToken();
  if (at) {
    config.headers = config.headers || {};
    config.headers["Authorization"] = `Bearer ${at}`;
  }
  return config;
});

interface ApiErrorShape {
  code?: number;
  message?: string;
  data?: unknown;
}

function extractErrorMessage(err: unknown): string {
  if (axios.isAxiosError(err)) {
    const data = err.response?.data as ApiErrorShape | undefined;
    if (data && typeof data.message === "string") {
      return data.message;
    }
    return err.message || "Request failed";
  }
  if (err instanceof Error) return err.message;
  return "Unknown error";
}

// ===== Types =====
interface ApiSuccess<T> {
  code: number; // 0
  message: string; // "SUCCESS"
  data: T;
}

interface AuthResponseData {
  accessToken: string;
  refreshToken?: string;
}

interface SignupPayload {
  email: string;
  password: string;
}

export function useSignup() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const signup = useCallback(async (payload: SignupPayload) => {
    setLoading(true);
    setError(null);
    try {
      // Adjust endpoint if your backend uses a different path
      const res = await api.post<ApiSuccess<AuthResponseData>>(
        "/auth/signup",
        payload
      );
      const { accessToken, refreshToken } = res.data.data;

      // Store tokens as requested (using the response directly)
      tokenStore.setTokens(accessToken, refreshToken);

      return res.data.data; // return tokens if caller needs them
    } catch (err: unknown) {
      const msg = extractErrorMessage(err) || "Signup failed";
      setError(msg);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  return { signup, loading, error };
}

// Optional helper: login using the same response schema
export function useLogin() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const login = useCallback(async (payload: SignupPayload) => {
    setLoading(true);
    setError(null);
    try {
      const res = await api.post<ApiSuccess<AuthResponseData>>(
        "/auth/login",
        payload
      );
      const { accessToken, refreshToken } = res.data.data;
      tokenStore.setTokens(accessToken, refreshToken);
      return res.data.data;
    } catch (err: unknown) {
      const msg = extractErrorMessage(err) || "Login failed";
      setError(msg);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  return { login, loading, error };
}

// Optional: refresh using stored refreshToken (if your backend expects it in body)
export async function refreshAccessToken() {
  const rt = tokenStore.getRefreshToken();
  if (!rt) throw new Error("No refresh token");
  const res = await api.post<ApiSuccess<AuthResponseData>>("/auth/refresh", {
    refreshToken: rt,
  });
  const { accessToken, refreshToken } = res.data.data;
  tokenStore.setTokens(accessToken, refreshToken);
  return res.data.data;
}

export function logout() {
  tokenStore.clear();
}
