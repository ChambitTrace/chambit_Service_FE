export type HealthStatus = "Healthy" | "Warning" | "Critical";
export type Severity = "Critical" | "High" | "Medium" | "Low";
export type DriftType = "Added" | "Modified" | "Removed";
export type RiskLevel = "Critical" | "High" | "Medium" | "Low";
export type AlertType = "Drift" | "CVE" | "Policy" | "Runtime";
export type AlertStatus = "Open" | "Investigating" | "Resolved";
export type PolicyAction = "Block" | "Warn" | "Audit";
export type KubernetesAssetKind = "cluster" | "namespace" | "pod" | "container" | "component";
export type KubernetesAssetRisk = "critical" | "high" | "medium" | "low" | "healthy";

export interface MetricCard {
  label: string;
  value: number;
  trend: string;
  tone: "neutral" | "success" | "warning" | "danger";
}

export interface ClusterStatus {
  clusterName: string;
  nodeCount: number;
  runningPods: number;
  runtimeSbomStatus: HealthStatus;
  driftCount: number;
  criticalCve: number;
  policyStatus: HealthStatus;
}

export interface RuntimeSbomComponent {
  namespace: string;
  pod: string;
  container: string;
  componentName: string;
  componentType: string;
  version: string;
  path: string;
  hash: string;
  license: string;
}

export interface DriftEvent {
  pod: string;
  container: string;
  driftType: DriftType;
  component: string;
  buildVersion: string;
  runtimeVersion: string;
  path: string;
  detectedAt: string;
  riskLevel: RiskLevel;
}

export interface CveFinding {
  cveId: string;
  component: string;
  version: string;
  severity: Severity;
  cvss: number;
  description: string;
  fixedVersion: string;
  status: "Open" | "Patched" | "Accepted Risk";
}

export interface PolicyRule {
  policyName: string;
  rule: string;
  action: PolicyAction;
  enabled: boolean;
  violationCount: number;
}

export interface AlertEvent {
  time: string;
  type: AlertType;
  target: string;
  message: string;
  severity: Severity;
  status: AlertStatus;
}

export interface KubernetesAsset {
  id: string;
  parentId?: string;
  kind: KubernetesAssetKind;
  name: string;
  label: string;
  risk: KubernetesAssetRisk;
  status: string;
  metadata: string;
  owner?: string;
  namespace?: string;
  image?: string;
  version?: string;
  cveId?: string;
  policyBlocked?: boolean;
  children: KubernetesAsset[];
}

export interface KubernetesAssetGraph {
  generatedAt: string;
  clusters: KubernetesAsset[];
}

export interface KubernetesAssetSummary {
  totalAssets: number;
  byKind: Record<KubernetesAssetKind, number>;
  highestRisk: KubernetesAssetRisk;
  exposedComponents: number;
  policyBlocked: number;
}

export interface SeverityPoint {
  severity: Severity;
  count: number;
}

export interface DriftTrendPoint {
  day: string;
  count: number;
}

export interface PolicyRatioPoint {
  name: string;
  value: number;
}
