import axios, { AxiosHeaders, type AxiosRequestHeaders } from "axios";

// ===== Types =====
export interface ApiSuccess<T> {
  code: number;
  message: string;
  data: T;
}

interface ApiErrorShape {
  code?: number;
  message?: string;
  data?: unknown;
}

export function isObject(x: unknown): x is Record<string, unknown> {
  return typeof x === "object" && x !== null;
}
// ===== Axios base =====
const ACCESS_TOKEN_KEY = "accessToken";
const REFRESH_TOKEN_KEY = "refreshToken";

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "/api",
});

api.interceptors.request.use((config) => {
  const at =
    typeof window !== "undefined"
      ? localStorage.getItem(ACCESS_TOKEN_KEY)
      : null;
  const rt =
    typeof window !== "undefined"
      ? localStorage.getItem(REFRESH_TOKEN_KEY)
      : null;

  if (at || rt) {
    if (!config.headers) {
      config.headers = new AxiosHeaders();
    }
    if (config.headers instanceof AxiosHeaders) {
      if (at) config.headers.set("Authorization", at);
      if (rt) config.headers.set("refreshToken", rt);
    } else {
      if (at)
        (config.headers as AxiosRequestHeaders)[
          "Authorization"
        ] = `Bearer ${at}`;
      if (rt) (config.headers as AxiosRequestHeaders)["refreshToken"] = rt;
    }
  }

  // console.log("[API Request]", {
  //   method: config.method,
  //   url: config.url,
  //   headers: config.headers,
  //   data: config.data,
  // });

  return config;
});

export function extractErrorMessage(err: unknown): string {
  if (axios.isAxiosError(err)) {
    const data = err.response?.data as ApiErrorShape | undefined;
    if (data && typeof data.message === "string") return data.message;
    return err.message || "Request failed";
  }
  if (err instanceof Error) return err.message;
  return "Unknown error";
}

// Re-export resource hooks for convenience
export { useClusters } from "./getClusterlist";
export { useNodes } from "./getNode";
export { useNamespaces } from "./getNamespace";
export { usePods } from "./getPod";
