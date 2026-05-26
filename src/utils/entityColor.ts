import type { KubernetesEntity, OverlayMode } from "../types/kubernetes";

export const colorForEntity = (entity: KubernetesEntity, overlayMode: OverlayMode) => {
  if (entity.status === "healthy") return "#06ad78";
  if (!hasAnomaly(entity)) return "#06ad78";

  if (overlayMode === "CPU") return heat(entity.metrics.cpuUsageLimitPercent ?? entity.metrics.allocatableCpuUsagePercent ?? 0);
  if (overlayMode === "Memory") return heat(entity.metrics.memoryUsageLimitPercent ?? entity.metrics.allocatableMemoryUsagePercent ?? 0);
  if (overlayMode === "Drift") return entity.security.driftCount > 0 ? "#8b5cf6" : "#2f4b55";
  if (overlayMode === "CVE") return countColor(entity.security.criticalCveCount + entity.security.highCveCount, 0, 2, 5);
  if (overlayMode === "Policy") return entity.security.policyViolationCount > 0 ? "#ef4444" : "#2f4b55";
  if (overlayMode === "SBOM Coverage") return entity.sbom.coverageStatus === "missing" ? "#f97316" : "#2f4b55";

  if (entity.security.criticalCveCount > 0 || entity.status === "critical") return "#ef4444";
  if (entity.security.policyViolationCount > 0 || entity.security.highCveCount > 0) return "#f97316";
  if (entity.security.hasRuntimeDrift || entity.security.driftCount > 0) return "#8b5cf6";
  if (entity.sbom.coverageStatus === "missing" || entity.status === "unknown") return "#94a3b8";
  return "#06ad78";
};

export const strokeForEntity = (entity: KubernetesEntity, selected: boolean) => {
  if (selected) return "#38bdf8";
  if (entity.security.hasRuntimeDrift) return "#c084fc";
  if (entity.sbom.coverageStatus === "missing") return "#94a3b8";
  return "rgba(226, 245, 245, 0.16)";
};

export const hasAnomaly = (entity: KubernetesEntity) =>
  entity.status === "critical" ||
  entity.status === "warning" ||
  entity.status === "unknown" ||
  entity.security.driftCount > 0 ||
  entity.security.criticalCveCount > 0 ||
  entity.security.highCveCount > 0 ||
  entity.security.policyViolationCount > 0 ||
  entity.security.hasUnknownBinary ||
  entity.security.hasUnsignedBinary ||
  entity.sbom.coverageStatus === "missing";

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
