export type EntityType =
  | "pod"
  | "deployment"
  | "statefulset"
  | "daemonset"
  | "job"
  | "cronjob"
  | "node"
  | "container";

export type EntityStatus = "healthy" | "warning" | "critical" | "unknown";
export type RiskLevel = "low" | "medium" | "high" | "critical";
export type SbomCoverageStatus = "covered" | "partial" | "missing";
export type OverlayMode = "Health" | "CPU" | "Memory" | "Drift" | "CVE" | "Policy" | "SBOM Coverage";

export interface EntityMetrics {
  podStatus?: string;
  cpuUsageLimitPercent?: number;
  cpuUsageRequestPercent?: number;
  cpuUsedCores?: number;
  memoryUsageLimitPercent?: number;
  memoryUsageRequestPercent?: number;
  memoryUsedBytes?: number;
  containerRestartsDelta?: number;
  containerRestartsTotal?: number;
  cpuThrottlePercent?: number;
  networkRxBytesPerSecond?: number;
  networkTxBytesPerSecond?: number;
  noticeStatus?: string;
  warningStatus?: string;
  fileSystemUsedPercent?: number;
  warningEvents?: number;
  missingPodCount?: number;
  missingPodPercent?: number;
  allocatableCpuUsagePercent?: number;
  allocatableMemoryUsagePercent?: number;
  fsCapacityUsagePercent?: number;
  pendingPods?: number;
  failedPods?: number;
}

export interface EntitySecurity {
  driftCount: number;
  criticalCveCount: number;
  highCveCount: number;
  mediumCveCount: number;
  lowCveCount: number;
  policyViolationCount: number;
  riskScore: number;
  riskLevel: RiskLevel;
  hasUnknownBinary: boolean;
  hasUnsignedBinary: boolean;
  hasRuntimeDrift: boolean;
}

export interface EntitySbom {
  format: "CycloneDX" | "SPDX" | "Unknown";
  componentCount: number;
  loadedBinaryCount: number;
  loadedLibraryCount: number;
  coverageStatus: SbomCoverageStatus;
  lastGeneratedAt?: string;
}

export interface EntityRelationships {
  node?: string;
  pod?: string;
  deployment?: string;
  statefulset?: string;
  daemonset?: string;
  job?: string;
  cronjob?: string;
  ownerWorkload?: string;
  containers?: string[];
  relatedPods?: string[];
}

export interface KubernetesEntity {
  id: string;
  type: EntityType;
  name: string;
  namespace?: string;
  clusterName: string;
  status: EntityStatus;
  groupKeys: Record<string, string>;
  relationships: EntityRelationships;
  metrics: EntityMetrics;
  security: EntitySecurity;
  sbom: EntitySbom;
  timestamps: {
    startTime?: string;
    createdTime: string;
  };
  image?: string;
  containerCount?: number;
}

export interface EntityFilter {
  key: string;
  label: string;
  value: string;
}

export interface EntityGroupModel {
  name: string;
  entities: KubernetesEntity[];
}
