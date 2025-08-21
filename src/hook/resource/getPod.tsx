import {
  api,
  isObject,
  extractErrorMessage,
  type ApiSuccess,
} from "./getResource";
import { useState, useCallback, useEffect } from "react";

// ===== Pod (by Node) =====
export interface PodDTO {
  name: string;
  status: "running" | "pending" | "failed" | string;
  ready: boolean;
}

interface RawPod {
  pName?: string;
  name?: string;
  pStatus?: string;
  status?: string;
  pReady?: boolean | string | number;
  ready?: boolean | string | number;
}

function isApiSuccessArrayPods(x: unknown): x is ApiSuccess<RawPod[]> {
  if (!isObject(x)) return false;
  const maybe = x as { data?: unknown };
  return Array.isArray(maybe.data);
}

function toBoolean(v: unknown): boolean {
  if (typeof v === "boolean") return v;
  if (typeof v === "number") return v !== 0;
  if (typeof v === "string") return v.toLowerCase() === "true" || v === "1";
  return false;
}

function normalizePod(p: RawPod): PodDTO {
  const name = p.pName ?? p.name ?? "";
  const status = (p.pStatus ?? p.status ?? "running") as PodDTO["status"];
  const ready = toBoolean(p.pReady ?? p.ready ?? status === "running");
  return { name, status, ready };
}

export async function fetchPodsByNode(nid: string): Promise<PodDTO[]> {
  const res = await api.get<RawPod[] | ApiSuccess<RawPod[]>>("/resource/pods", {
    headers: { Accept: "application/json" },
    params: { nid },
  });
  const payload: unknown = res.data;
  if (Array.isArray(payload)) return payload.map(normalizePod);
  if (isApiSuccessArrayPods(payload)) return payload.data.map(normalizePod);
  return [];
}

export function usePods(nid: string | undefined) {
  const [data, setData] = useState<PodDTO[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    if (!nid) return;
    setLoading(true);
    setError(null);
    try {
      const list = await fetchPodsByNode(nid);
      setData(list);
    } catch (e) {
      setError(extractErrorMessage(e));
    } finally {
      setLoading(false);
    }
  }, [nid]);

  useEffect(() => {
    void load();
  }, [load]);

  return { data, loading, error, refetch: load };
}
