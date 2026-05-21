import { Badge } from "../components/Badge";
import { Card, CardBody } from "../components/Card";
import { DataTable, type Column } from "../components/DataTable";
import { securityRepository } from "../data/securityRepository";
import type { ClusterStatus } from "../types/security";
import { PageHeader, PageStack, PageTitle } from "./shared";

export function ClusterStatusPage() {
  const rows = securityRepository.getClusters();
  const columns: Column<ClusterStatus>[] = [
    { key: "cluster", header: "Cluster Name", render: (row) => row.clusterName, minWidth: "13rem" },
    { key: "nodes", header: "Node Count", render: (row) => row.nodeCount },
    { key: "pods", header: "Running Pods", render: (row) => row.runningPods },
    { key: "sbom", header: "Runtime SBOM Status", render: (row) => <Badge value={row.runtimeSbomStatus} /> },
    { key: "drift", header: "Drift Count", render: (row) => row.driftCount },
    { key: "critical", header: "Critical CVE", render: (row) => row.criticalCve },
    { key: "policy", header: "Policy Status", render: (row) => <Badge value={row.policyStatus} /> },
  ];

  return (
    <PageStack>
      <PageHeader>
        <PageTitle>
          <h2>Cluster Status</h2>
          <p>클러스터별 Runtime SBOM 수집, Drift, CVE, 정책 상태를 집계합니다.</p>
        </PageTitle>
      </PageHeader>
      <Card>
        <CardBody>
          <DataTable columns={columns} rows={rows} getRowKey={(row) => row.clusterName} />
        </CardBody>
      </Card>
    </PageStack>
  );
}
