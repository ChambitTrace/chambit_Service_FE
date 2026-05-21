import type { EntityType, OverlayMode } from "../types/kubernetes";

export const entityTypeLabels: Record<EntityType, string> = {
  pod: "Pod",
  deployment: "Deployment",
  statefulset: "StatefulSet",
  daemonset: "DaemonSet",
  job: "Job",
  cronjob: "CronJob",
  node: "Node",
  container: "Container",
};

export const entityTypes = Object.keys(entityTypeLabels) as EntityType[];

export const overlayModes: OverlayMode[] = ["Health", "CPU", "Memory", "Drift", "CVE", "Policy", "SBOM Coverage"];

export const groupByOptions: Record<EntityType, string[]> = {
  pod: ["Namespace", "Deployment", "StatefulSet", "DaemonSet", "Job", "CronJob", "Pod", "Node"],
  deployment: ["Namespace", "Deployment"],
  statefulset: ["Namespace", "StatefulSet"],
  daemonset: ["Namespace", "DaemonSet"],
  job: ["Namespace", "Job"],
  cronjob: ["Namespace", "CronJob"],
  node: ["All Nodes", "Node"],
  container: ["Namespace", "Pod", "Deployment", "StatefulSet", "DaemonSet", "Job", "CronJob", "Node", "Container"],
};

export const sortByOptions: Record<EntityType, string[]> = {
  pod: [
    "Pod Status",
    "CPU Usage Limit %",
    "CPU Usage Request %",
    "CPU Used Cores",
    "Memory Usage Limit %",
    "Memory Usage Request %",
    "Memory Used Bytes",
    "Container Restarts Delta",
    "Container Restarts Total",
    "CPU Throttle %",
    "Network Rx Bytes/s",
    "Network Tx Bytes/s",
    "Notice Status",
    "File System Used %",
    "Warning Events",
    "Start Time",
    "Created Time",
    "Runtime Drift Count",
    "Critical CVE Count",
    "Policy Violations",
  ],
  deployment: [
    "CPU Usage Limit %",
    "CPU Usage Request %",
    "CPU Used Cores",
    "Memory Usage Limit %",
    "Memory Usage Request %",
    "Memory Used Bytes",
    "Container Restarts Delta",
    "Container Restarts Total",
    "CPU Throttle %",
    "Network Rx Bytes/s",
    "Network Tx Bytes/s",
    "Missing Pod Count",
    "Missing Pod %",
    "Warning Status",
    "Created Time",
    "Runtime Drift Count",
    "Critical CVE Count",
    "Policy Violations",
  ],
  statefulset: [],
  daemonset: [],
  job: [
    "CPU Usage Limit %",
    "CPU Usage Request %",
    "CPU Used Cores",
    "Memory Usage Limit %",
    "Memory Usage Request %",
    "Memory Used Bytes",
    "Container Restarts Delta",
    "Container Restarts Total",
    "CPU Throttle %",
    "Network Rx Bytes/s",
    "Network Tx Bytes/s",
    "Warning Status",
    "Created Time",
    "Runtime Drift Count",
    "Critical CVE Count",
    "Policy Violations",
  ],
  cronjob: [],
  node: [
    "Allocatable CPU Usage %",
    "Allocatable Memory Usage %",
    "FS Capacity Usage %",
    "Pending Pods",
    "Failed Pods",
    "Notice Status",
    "Runtime Drift Count",
    "Critical CVE Count",
    "Policy Violations",
  ],
  container: [
    "CPU Usage Limit %",
    "CPU Usage Request %",
    "CPU Used Cores",
    "Memory Usage Limit %",
    "Memory Usage Request %",
    "Memory Used Bytes",
    "Container Restarts Delta",
    "Container Restarts Total",
    "CPU Throttle %",
    "Warning Status",
    "Runtime Drift Count",
    "Critical CVE Count",
    "Policy Violations",
  ],
};

sortByOptions.statefulset = sortByOptions.deployment;
sortByOptions.daemonset = sortByOptions.deployment;
sortByOptions.cronjob = sortByOptions.job;

export const filterDefinitions = [
  { key: "namespace", label: "k8s.namespaceName" },
  { key: "deployment", label: "k8s.deploymentName" },
  { key: "statefulset", label: "k8s.statefulsetName" },
  { key: "daemonset", label: "k8s.daemonsetName" },
  { key: "job", label: "k8s.jobName" },
  { key: "cronjob", label: "k8s.cronjobName" },
  { key: "pod", label: "k8s.podName" },
  { key: "node", label: "k8s.nodeName" },
];
