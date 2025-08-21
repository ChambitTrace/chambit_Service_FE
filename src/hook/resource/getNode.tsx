import {
  api,
  isObject,
  extractErrorMessage,
  type ApiSuccess,
} from "./getResource";
import { useState, useCallback, useEffect } from "react";

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
export interface NodeDTO {
  id: string;
  name: string;
  status: "healthy" | "error" | string;
  version: string;
  ca: string;
}

function isApiSuccessArrayNodes(x: unknown): x is ApiSuccess<RawNode[]> {
  if (!isObject(x)) return false;
  const maybe = x as { data?: unknown };
  return Array.isArray(maybe.data);
}

function normalizeNode(n: RawNode): NodeDTO {
  const id = String(n.nId ?? n._id ?? "");
  const name = n.nName ?? "unknown";
  const status = n.nStatus ?? "healthy";
  const version = n.nVersion ?? "";
  const ca = n.nCreatedAt ?? "";
  return { id, name, status, version, ca };
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
