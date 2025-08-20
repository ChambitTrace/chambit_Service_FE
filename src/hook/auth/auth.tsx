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
  baseURL: import.meta.env.VITE_API_URL || "/api",
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

export function oauthLogin(provider: "google" | "github" = "google") {
  // 안전한 baseURL 구성 (후행 슬래시 제거)
  const base = import.meta.env.VITE_API_URL ?? "";
  const trimmed = String(base).replace(/\/+$/g, "");
  const url = `${trimmed}/auth/${provider}`;

  // 브라우저 환경에서만 리다이렉트
  if (typeof window !== "undefined" && window.location) {
    window.location.href = url;
  } else {
    console.error("oauthLogin called outside the browser:", url);
  }
}

export async function handleOauthCallback(
  provider: "google" | "github" = "google"
) {
  if (typeof window === "undefined") {
    throw new Error("handleOauthCallback must run in the browser");
  }
  const { search, hash, pathname } = window.location;

  // 1) URL 쿼리 또는 해시에 토큰이 직접 전달된 경우 처리
  const raw =
    search && search.length > 1
      ? search.slice(1)
      : hash && hash.startsWith("#")
      ? hash.slice(1)
      : "";
  const params = new URLSearchParams(raw);

  const directAccessToken = params.get("access_token");
  const directRefreshToken = params.get("refresh_token");
  const error = params.get("error");

  if (error) {
    // URL 정리 후 오류 반환
    if (window.history && window.history.replaceState) {
      window.history.replaceState(null, "", pathname);
    }
    throw new Error(`OAuth error: ${error}`);
  }

  if (directAccessToken) {
    tokenStore.setTokens(directAccessToken, directRefreshToken ?? undefined);
    if (window.history && window.history.replaceState) {
      window.history.replaceState(null, "", pathname);
    }
    return {
      accessToken: directAccessToken,
      refreshToken: directRefreshToken ?? undefined,
    };
  }

  // 2) code 방식인 경우: code를 body로 백엔드 콜백 엔드포인트에 전달하여 토큰 교환
  const code = params.get("code");
  if (!code) {
    throw new Error("No OAuth code or tokens found in URL");
  }

  const res = await api.post<ApiSuccess<AuthResponseData>>(
    `/auth/${provider}/callback`,
    { code }
  );
  const { accessToken, refreshToken } = res.data.data;
  tokenStore.setTokens(accessToken, refreshToken);

  if (window.history && window.history.replaceState) {
    window.history.replaceState(null, "", pathname);
  }

  return { accessToken, refreshToken };
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
