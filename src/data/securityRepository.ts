import {
  alerts,
  clusterStatuses,
  cveFindings,
  driftEvents,
  driftTrendData,
  overviewMetrics,
  policyRatioData,
  policyRules,
  runtimeSbomComponents,
  severityChartData,
} from "./mockData";
import { kubernetesAssetGraph } from "./kubernetesAssetNavigator";

// Keep reads behind this repository so real API calls can replace mock data later.
export const securityRepository = {
  getOverviewMetrics: () => overviewMetrics,
  getSeverityDistribution: () => severityChartData,
  getDriftTrend: () => driftTrendData,
  getPolicyRatio: () => policyRatioData,
  getClusters: () => clusterStatuses,
  getRuntimeSbom: () => runtimeSbomComponents,
  getDriftEvents: () => driftEvents,
  getCveFindings: () => cveFindings,
  getPolicies: () => policyRules,
  getAlerts: () => alerts,
  getKubernetesAssetGraph: () => kubernetesAssetGraph,
};
