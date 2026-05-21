import type { KubernetesEntity, OverlayMode } from "../types/kubernetes";

export const colorForEntity = (entity: KubernetesEntity, overlayMode: OverlayMode) => {
  if (overlayMode === "CPU") return heat(entity.metrics.cpuUsageLimitPercent ?? entity.metrics.allocatableCpuUsagePercent ?? 0);
  if (overlayMode === "Memory") return heat(entity.metrics.memoryUsageLimitPercent ?? entity.metrics.allocatableMemoryUsagePercent ?? 0);
  if (overlayMode === "Drift") return countColor(entity.security.driftCount, 0, 2, 5);
  if (overlayMode === "CVE") return countColor(entity.security.criticalCveCount + entity.security.highCveCount, 0, 2, 5);
  if (overlayMode === "Policy") return entity.security.policyViolationCount > 0 ? "#ef4444" : "#22c55e";
  if (overlayMode === "SBOM Coverage") {
    if (entity.sbom.coverageStatus === "missing") return "#64748b";
    if (entity.sbom.coverageStatus === "partial") return "#f59e0b";
    return "#22c55e";
  }

  switch (entity.status) {
    case "healthy":
      return "#22c55e";
    case "warning":
      return "#f59e0b";
    case "critical":
      return "#ef4444";
    default:
      return "#64748b";
  }
};

export const strokeForEntity = (entity: KubernetesEntity, selected: boolean) => {
  if (selected) return "#38bdf8";
  if (entity.security.hasRuntimeDrift) return "#a855f7";
  if (entity.sbom.coverageStatus === "missing") return "#94a3b8";
  return "rgba(226, 245, 245, 0.24)";
};

const heat = (value: number) => {
  if (value >= 85) return "#ef4444";
  if (value >= 65) return "#f97316";
  if (value >= 45) return "#f59e0b";
  if (value >= 25) return "#84cc16";
  return "#22c55e";
};

const countColor = (value: number, good: number, warn: number, critical: number) => {
  if (value >= critical) return "#ef4444";
  if (value >= warn) return "#f59e0b";
  if (value > good) return "#8b5cf6";
  return "#22c55e";
};
