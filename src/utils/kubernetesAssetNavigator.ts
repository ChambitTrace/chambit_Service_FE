import type {
  KubernetesAsset,
  KubernetesAssetGraph,
  KubernetesAssetKind,
  KubernetesAssetRisk,
  KubernetesAssetSummary,
} from "../types/security";

export const assetKindOrder: KubernetesAssetKind[] = ["cluster", "namespace", "pod", "container", "component"];

const riskWeights: Record<KubernetesAssetRisk, number> = {
  critical: 4,
  high: 3,
  medium: 2,
  low: 1,
  healthy: 0,
};

export function buildKubernetesAssetSummary(graph: KubernetesAssetGraph): KubernetesAssetSummary {
  const assets = flattenKubernetesAssets(graph);
  const byKind = assetKindOrder.reduce(
    (summary, kind) => ({ ...summary, [kind]: assets.filter((asset) => asset.kind === kind).length }),
    {} as Record<KubernetesAssetKind, number>,
  );
  const highestRisk = assets.reduce<KubernetesAssetRisk>(
    (current, asset) => (riskWeights[asset.risk] > riskWeights[current] ? asset.risk : current),
    "healthy",
  );
  const exposedComponents = assets.filter((asset) => asset.kind === "component" && asset.risk !== "healthy").length;
  const policyBlocked = assets.filter((asset) => asset.policyBlocked).length;

  return {
    totalAssets: assets.length,
    byKind,
    highestRisk,
    exposedComponents,
    policyBlocked,
  };
}

export function flattenKubernetesAssets(graph: KubernetesAssetGraph): KubernetesAsset[] {
  return graph.clusters.flatMap((cluster) => [cluster, ...flattenChildren(cluster)]);
}

export function getVisibleKubernetesAssets(
  graph: KubernetesAssetGraph,
  selectedAssetId: string | null,
  query: string,
): KubernetesAsset[] {
  const normalized = query.trim().toLowerCase();
  const allAssets = flattenKubernetesAssets(graph);
  if (normalized) {
    return allAssets.filter((asset) => searchableAssetText(asset).includes(normalized));
  }

  if (!selectedAssetId) {
    return graph.clusters;
  }

  const selectedAsset = allAssets.find((asset) => asset.id === selectedAssetId);
  if (!selectedAsset) {
    return graph.clusters;
  }

  return selectedAsset.children.length > 0 ? selectedAsset.children : getSiblings(graph, selectedAsset);
}

export function getKubernetesAssetBreadcrumbs(graph: KubernetesAssetGraph, assetId: string | null): KubernetesAsset[] {
  if (!assetId) return [];
  const allAssets = flattenKubernetesAssets(graph);
  const assetById = new Map(allAssets.map((asset) => [asset.id, asset]));
  const trail: KubernetesAsset[] = [];
  let current = assetById.get(assetId);

  while (current) {
    trail.unshift(current);
    current = current.parentId ? assetById.get(current.parentId) : undefined;
  }

  return trail;
}

export function getInitialKubernetesAssetId(graph: KubernetesAssetGraph): string | null {
  return graph.clusters[0]?.id ?? null;
}

function flattenChildren(asset: KubernetesAsset): KubernetesAsset[] {
  return asset.children.flatMap((child) => [child, ...flattenChildren(child)]);
}

function getSiblings(graph: KubernetesAssetGraph, asset: KubernetesAsset): KubernetesAsset[] {
  if (!asset.parentId) return graph.clusters;
  const parent = flattenKubernetesAssets(graph).find((candidate) => candidate.id === asset.parentId);
  return parent?.children ?? graph.clusters;
}

function searchableAssetText(asset: KubernetesAsset): string {
  return [asset.name, asset.kind, asset.namespace, asset.image, asset.version, asset.cveId, asset.owner]
    .filter(Boolean)
    .join(" ")
    .toLowerCase();
}
