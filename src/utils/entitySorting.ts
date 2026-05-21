import type { KubernetesEntity } from "../types/kubernetes";

export const sortEntities = (entities: KubernetesEntity[], sortBy: string) => {
  return [...entities].sort((a, b) => valueFor(b, sortBy) - valueFor(a, sortBy) || a.name.localeCompare(b.name));
};

const valueFor = (entity: KubernetesEntity, sortBy: string): number => {
  switch (sortBy) {
    case "CPU Usage Limit %":
      return entity.metrics.cpuUsageLimitPercent ?? 0;
    case "CPU Usage Request %":
      return entity.metrics.cpuUsageRequestPercent ?? 0;
    case "CPU Used Cores":
      return entity.metrics.cpuUsedCores ?? 0;
    case "Memory Usage Limit %":
      return entity.metrics.memoryUsageLimitPercent ?? 0;
    case "Memory Usage Request %":
      return entity.metrics.memoryUsageRequestPercent ?? 0;
    case "Memory Used Bytes":
      return entity.metrics.memoryUsedBytes ?? 0;
    case "Container Restarts Delta":
      return entity.metrics.containerRestartsDelta ?? 0;
    case "Container Restarts Total":
      return entity.metrics.containerRestartsTotal ?? 0;
    case "CPU Throttle %":
      return entity.metrics.cpuThrottlePercent ?? 0;
    case "Network Rx Bytes/s":
      return entity.metrics.networkRxBytesPerSecond ?? 0;
    case "Network Tx Bytes/s":
      return entity.metrics.networkTxBytesPerSecond ?? 0;
    case "Missing Pod Count":
      return entity.metrics.missingPodCount ?? 0;
    case "Missing Pod %":
      return entity.metrics.missingPodPercent ?? 0;
    case "File System Used %":
      return entity.metrics.fileSystemUsedPercent ?? 0;
    case "Warning Events":
      return entity.metrics.warningEvents ?? 0;
    case "Allocatable CPU Usage %":
      return entity.metrics.allocatableCpuUsagePercent ?? 0;
    case "Allocatable Memory Usage %":
      return entity.metrics.allocatableMemoryUsagePercent ?? 0;
    case "FS Capacity Usage %":
      return entity.metrics.fsCapacityUsagePercent ?? 0;
    case "Pending Pods":
      return entity.metrics.pendingPods ?? 0;
    case "Failed Pods":
      return entity.metrics.failedPods ?? 0;
    case "Runtime Drift Count":
      return entity.security.driftCount;
    case "Critical CVE Count":
      return entity.security.criticalCveCount;
    case "Policy Violations":
      return entity.security.policyViolationCount;
    case "Created Time":
      return Date.parse(entity.timestamps.createdTime);
    case "Start Time":
      return Date.parse(entity.timestamps.startTime ?? entity.timestamps.createdTime);
    case "Pod Status":
    case "Warning Status":
    case "Notice Status":
      return entity.status === "critical" ? 3 : entity.status === "warning" ? 2 : entity.status === "unknown" ? 1 : 0;
    default:
      return entity.security.riskScore;
  }
};
