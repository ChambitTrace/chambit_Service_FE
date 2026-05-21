import type { EntitySecurity, EntityStatus, EntityType, KubernetesEntity, RiskLevel, SbomCoverageStatus } from "../types/kubernetes";

const clusterName = "otel-community-demo";
const namespaces = ["newrelic", "kube-system", "default", "falcon-system", "payments", "checkout", "identity", "observability"];
const nodes = ["ip-10-42-1-11", "ip-10-42-1-34", "ip-10-42-2-19", "ip-10-42-2-88", "ip-10-42-3-7", "ip-10-42-3-41"];
const workloads = ["adservice", "cartservice", "checkoutservice", "currencyservice", "frontend", "paymentservice", "productcatalog", "recommendation", "shippingservice", "otel-collector"];
const daemonsets = ["newrelic-infra", "falcon-sensor", "kube-proxy", "coredns-agent"];
const statefulsets = ["redis-cart", "postgres-ledger", "prometheus", "tempo"];
const jobs = ["sbom-rescan", "cve-backfill", "drift-snapshot", "policy-sync"];
const cronjobs = ["nightly-sbom-diff", "license-audit", "runtime-attestation"];
const containers = ["app", "sidecar", "proxy", "collector", "init"];

const statusFor = (seed: number): EntityStatus => {
  if (seed % 19 === 0) return "critical";
  if (seed % 7 === 0 || seed % 11 === 0) return "warning";
  if (seed % 23 === 0) return "unknown";
  return "healthy";
};

const riskFor = (score: number): RiskLevel => {
  if (score >= 82) return "critical";
  if (score >= 62) return "high";
  if (score >= 34) return "medium";
  return "low";
};

const coverageFor = (seed: number): SbomCoverageStatus => {
  if (seed % 17 === 0) return "missing";
  if (seed % 5 === 0) return "partial";
  return "covered";
};

const securityFor = (seed: number, status: EntityStatus): EntitySecurity => {
  const driftCount = seed % 9 === 0 ? 5 : seed % 4;
  const criticalCveCount = status === "critical" ? (seed % 3) + 1 : seed % 13 === 0 ? 1 : 0;
  const highCveCount = seed % 6;
  const policyViolationCount = seed % 10 === 0 ? 4 : seed % 3 === 0 ? 1 : 0;
  const riskScore = Math.min(99, driftCount * 9 + criticalCveCount * 24 + highCveCount * 7 + policyViolationCount * 11 + (seed % 18));

  return {
    driftCount,
    criticalCveCount,
    highCveCount,
    mediumCveCount: seed % 8,
    lowCveCount: seed % 11,
    policyViolationCount,
    riskScore,
    riskLevel: riskFor(riskScore),
    hasUnknownBinary: seed % 16 === 0,
    hasUnsignedBinary: seed % 14 === 0,
    hasRuntimeDrift: driftCount > 0,
  };
};

const makeEntity = (type: EntityType, index: number, groupName: string, name: string): KubernetesEntity => {
  const namespace = type === "node" ? undefined : groupName;
  const node = nodes[index % nodes.length];
  const deployment = workloads[index % workloads.length];
  const statefulset = statefulsets[index % statefulsets.length];
  const daemonset = daemonsets[index % daemonsets.length];
  const job = jobs[index % jobs.length];
  const cronjob = cronjobs[index % cronjobs.length];
  const pod = `${deployment}-${(10000 + index).toString(16)}`;
  const status = statusFor(index);
  const security = securityFor(index, status);
  const coverageStatus = coverageFor(index);

  return {
    id: `${type}-${index}`,
    type,
    name,
    namespace,
    clusterName,
    status,
    image: `ghcr.io/chambit/${deployment}:${(index % 4) + 1}.${index % 9}.${index % 13}`,
    containerCount: type === "pod" ? (index % 4) + 1 : undefined,
    groupKeys: {
      namespace: namespace ?? "All Nodes",
      deployment,
      statefulset,
      daemonset,
      job,
      cronjob,
      pod,
      node,
      container: containers[index % containers.length],
    },
    relationships: {
      node,
      pod: type === "pod" ? name : pod,
      deployment,
      statefulset,
      daemonset,
      job,
      cronjob,
      ownerWorkload: type === "pod" || type === "container" ? deployment : name,
      containers: containers.slice(0, (index % containers.length) + 1),
      relatedPods: [`${deployment}-a${index % 9}`, `${deployment}-b${(index + 3) % 9}`],
    },
    metrics: {
      podStatus: status === "healthy" ? "Running" : status === "critical" ? "CrashLoopBackOff" : "Degraded",
      cpuUsageLimitPercent: (index * 13) % 101,
      cpuUsageRequestPercent: (index * 17) % 100,
      cpuUsedCores: Number((((index % 24) + 1) / 10).toFixed(2)),
      memoryUsageLimitPercent: (index * 19) % 100,
      memoryUsageRequestPercent: (index * 23) % 100,
      memoryUsedBytes: 128_000_000 + (index % 48) * 34_000_000,
      containerRestartsDelta: index % 5,
      containerRestartsTotal: index % 29,
      cpuThrottlePercent: (index * 7) % 38,
      networkRxBytesPerSecond: 1800 + index * 143,
      networkTxBytesPerSecond: 1600 + index * 127,
      noticeStatus: status === "healthy" ? "None" : "Notice",
      warningStatus: status === "warning" || status === "critical" ? "Warning" : "Good",
      fileSystemUsedPercent: (index * 29) % 100,
      warningEvents: status === "healthy" ? 0 : (index % 7) + 1,
      missingPodCount: index % 6,
      missingPodPercent: (index * 3) % 40,
      allocatableCpuUsagePercent: 30 + ((index * 9) % 70),
      allocatableMemoryUsagePercent: 26 + ((index * 11) % 74),
      fsCapacityUsagePercent: 20 + ((index * 13) % 75),
      pendingPods: index % 8,
      failedPods: index % 4,
    },
    security,
    sbom: {
      format: coverageStatus === "missing" ? "Unknown" : "CycloneDX",
      componentCount: coverageStatus === "missing" ? 0 : 42 + (index % 180),
      loadedBinaryCount: coverageStatus === "missing" ? 0 : 8 + (index % 40),
      loadedLibraryCount: coverageStatus === "missing" ? 0 : 19 + (index % 96),
      coverageStatus,
      lastGeneratedAt: coverageStatus === "missing" ? undefined : `2026-05-${String(10 + (index % 12)).padStart(2, "0")}T${String(index % 24).padStart(2, "0")}:15:00Z`,
    },
    timestamps: {
      startTime: `2026-05-${String(4 + (index % 16)).padStart(2, "0")}T${String(index % 24).padStart(2, "0")}:02:00Z`,
      createdTime: `2026-04-${String(1 + (index % 27)).padStart(2, "0")}T${String((index + 5) % 24).padStart(2, "0")}:00:00Z`,
    },
  };
};

const makeEntities = (): KubernetesEntity[] => {
  const entities: KubernetesEntity[] = [];
  let index = 1;

  for (const namespace of namespaces) {
    const count = namespace === "default" ? 96 : namespace === "kube-system" ? 58 : namespace === "newrelic" ? 44 : 36;
    for (let i = 0; i < count; i += 1) {
      const workload = workloads[(i + index) % workloads.length];
      entities.push(makeEntity("pod", index, namespace, `${workload}-${namespace.slice(0, 3)}-${index}`));
      index += 1;
    }
  }

  for (const namespace of namespaces) {
    workloads.forEach((workload) => {
      entities.push(makeEntity("deployment", index, namespace, workload));
      index += 1;
    });
    statefulsets.forEach((name) => {
      entities.push(makeEntity("statefulset", index, namespace, name));
      index += 1;
    });
    daemonsets.slice(0, 2).forEach((name) => {
      entities.push(makeEntity("daemonset", index, namespace, name));
      index += 1;
    });
    jobs.forEach((name) => {
      entities.push(makeEntity("job", index, namespace, `${name}-${namespace}`));
      index += 1;
    });
    cronjobs.forEach((name) => {
      entities.push(makeEntity("cronjob", index, namespace, `${name}-${namespace}`));
      index += 1;
    });
  }

  nodes.forEach((node) => {
    entities.push(makeEntity("node", index, "All Nodes", node));
    index += 1;
  });

  for (let i = 0; i < 170; i += 1) {
    const namespace = namespaces[i % namespaces.length];
    const workload = workloads[i % workloads.length];
    const container = containers[i % containers.length];
    entities.push(makeEntity("container", index, namespace, `${workload}-${container}-${i}`));
    index += 1;
  }

  return entities;
};

export const kubernetesEntitiesMock = makeEntities();
