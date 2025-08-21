import { useCallback, useEffect, useState } from "react";
import axios, { AxiosHeaders, type AxiosRequestHeaders } from "axios";

// ===== Types =====
export interface ClusterDTO {
  id: string;
  name: string;
  status: "healthy" | "error" | string;
}

export interface NodeDTO {
  id: string;
  name: string;
  status: "healthy" | "error" | string;
  version: string;
  ca: string;
}

interface RawCluster {
  cId?: string;
  cUid?: string;
  _id?: string;
  cName?: string;
  cRegion?: string;
  cCreatedAt?: string;
  cStatus?: "healthy" | string;
}

interface RawNode {
  nId?: string;
  _id?: string;
  nCid?: string;
  nName?: string;
  nVersion?: string;
  nZone?: string;
  nCreatedAt?: string;
  nStatus?: string;
  nAge?: string;
}

interface ApiSuccess<T> {
  code: number;
  message: string;
  data: T;
}

interface ApiErrorShape {
  code?: number;
  message?: string;
  data?: unknown;
}

function isObject(x: unknown): x is Record<string, unknown> {
  return typeof x === "object" && x !== null;
}

function isApiSuccessArrayClusters(x: unknown): x is ApiSuccess<RawCluster[]> {
  if (!isObject(x)) return false;
  const maybe = x as { data?: unknown };
  return Array.isArray(maybe.data);
}

function isApiSuccessArrayNodes(x: unknown): x is ApiSuccess<RawNode[]> {
  if (!isObject(x)) return false;
  const maybe = x as { data?: unknown };
  return Array.isArray(maybe.data);
}

function normalizeCluster(c: RawCluster): ClusterDTO {
  const id = String(c.cId ?? c._id ?? "");
  const name = c.cName ?? "unknown";
  const status = "healthy";
  return { id, name, status };
}

function normalizeNode(n: RawNode): NodeDTO {
  const id = String(n.nId ?? n._id ?? "");
  const name = n.nName ?? "unknown";
  const status = n.nStatus ?? "healthy";
  const version = n.nVersion ?? "";
  const ca = n.nCreatedAt ?? "";
  return { id, name, status, version, ca };
}

// ===== Axios base =====
const ACCESS_TOKEN_KEY = "accessToken";
const REFRESH_TOKEN_KEY = "refreshToken";

const api = axios.create({
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

function extractErrorMessage(err: unknown): string {
  if (axios.isAxiosError(err)) {
    const data = err.response?.data as ApiErrorShape | undefined;
    if (data && typeof data.message === "string") return data.message;
    return err.message || "Request failed";
  }
  if (err instanceof Error) return err.message;
  return "Unknown error";
}

// ===== Raw API =====
export async function fetchClusters(): Promise<ClusterDTO[]> {
  const res = await api.get<RawCluster[] | ApiSuccess<RawCluster[]>>(
    "/resource/clusters",
    {
      headers: { Accept: "application/json" },
    }
  );
  const payload: unknown = res.data;

  if (Array.isArray(payload)) return payload.map(normalizeCluster);
  if (isApiSuccessArrayClusters(payload))
    return payload.data.map(normalizeCluster);
  return [];
}

export async function fetchNodesByCluster(cid: string): Promise<NodeDTO[]> {
  const res = await api.get<RawNode[] | ApiSuccess<RawNode[]>>(
    "/resource/nodes",
    {
      headers: { Accept: "application/json" },
      params: { cid },
    }
  );
  const payload: unknown = res.data;
  if (Array.isArray(payload)) return payload.map(normalizeNode);
  if (isApiSuccessArrayNodes(payload)) return payload.data.map(normalizeNode);
  return [];
}

// ===== Hook =====
export function useClusters() {
  const [data, setData] = useState<ClusterDTO[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const list = await fetchClusters();
      setData(list);
    } catch (e) {
      setError(extractErrorMessage(e));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  return { data, loading, error, refetch: load };
}

export function useNodes(cid: string | undefined) {
  const [data, setData] = useState<NodeDTO[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    if (!cid) return;
    setLoading(true);
    setError(null);
    try {
      const list = await fetchNodesByCluster(cid);
      setData(list);
    } catch (e) {
      setError(extractErrorMessage(e));
    } finally {
      setLoading(false);
    }
  }, [cid]);

  useEffect(() => {
    void load();
  }, [load]);

  return { data, loading, error, refetch: load };
}
