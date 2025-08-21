import {
  api,
  isObject,
  extractErrorMessage,
  type ApiSuccess,
} from "./getResource";
import { useState, useCallback, useEffect } from "react";

export interface ClusterDTO {
  id: string;
  name: string;
  status: "healthy" | "error" | string;
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

function isApiSuccessArrayClusters(x: unknown): x is ApiSuccess<RawCluster[]> {
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
