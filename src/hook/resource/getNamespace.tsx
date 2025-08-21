import {
  api,
  isObject,
  extractErrorMessage,
  type ApiSuccess,
} from "./getResource";
import { useState, useCallback, useEffect } from "react";

interface RawNamespace {
  nsId?: string;
  _id?: string;
  nsCid?: string;
  nsName?: string;
  nsStatus?: string;
  nsCreatedAt?: string | number;
}

export interface NamespaceDTO {
  id: string;
  name: string;
  status: "active" | "terminating" | string;
  age: string; // createdAt or duration string
}

function isApiSuccessArrayNamespaces(
  x: unknown
): x is ApiSuccess<RawNamespace[]> {
  if (!isObject(x)) return false;
  const maybe = x as { data?: unknown };
  return Array.isArray(maybe.data);
}

function normalizeNamespace(n: RawNamespace): NamespaceDTO {
  const id = String(n.nsId ?? n._id ?? "");
  const name = n.nsName ?? "unknown";
  const status = (n.nsStatus as NamespaceDTO["status"]) ?? "active";
  const age = n.nsCreatedAt != null ? String(n.nsCreatedAt) : "";
  return { id, name, status, age };
}

export async function fetchNamespacesByCluster(
  cid: string
): Promise<NamespaceDTO[]> {
  const res = await api.get<RawNamespace[] | ApiSuccess<RawNamespace[]>>(
    "/resource/namespaces",
    {
      headers: { Accept: "application/json" },
      params: { cid },
    }
  );
  const payload: unknown = res.data;
  if (Array.isArray(payload)) return payload.map(normalizeNamespace);
  if (isApiSuccessArrayNamespaces(payload))
    return payload.data.map(normalizeNamespace);
  return [];
}

export function useNamespaces(cid: string | undefined) {
  const [data, setData] = useState<NamespaceDTO[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    if (!cid) return;
    setLoading(true);
    setError(null);
    try {
      const list = await fetchNamespacesByCluster(cid);
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
