import { Badge } from "../components/Badge";
import { Card, CardBody } from "../components/Card";
import { DataTable, type Column } from "../components/DataTable";
import { securityRepository } from "../data/securityRepository";
import type { CveFinding } from "../types/security";
import { PageHeader, PageStack, PageTitle } from "./shared";

export function CveMappingPage() {
  const rows = securityRepository.getCveFindings();
  const columns: Column<CveFinding>[] = [
    { key: "cve", header: "CVE ID", render: (row) => row.cveId, minWidth: "10rem" },
    { key: "component", header: "Component", render: (row) => row.component },
    { key: "version", header: "Version", render: (row) => row.version },
    { key: "severity", header: "Severity", render: (row) => <Badge value={row.severity} /> },
    { key: "cvss", header: "CVSS", render: (row) => row.cvss.toFixed(1) },
    { key: "description", header: "Description", render: (row) => row.description, minWidth: "18rem" },
    { key: "fixed", header: "Fixed Version", render: (row) => row.fixedVersion },
    { key: "status", header: "Status", render: (row) => <Badge value={row.status} /> },
  ];

  return (
    <PageStack>
      <PageHeader>
        <PageTitle>
          <h2>CVE Mapping</h2>
          <p>런타임 컴포넌트와 취약점 결과를 CVSS 기준으로 매핑합니다.</p>
        </PageTitle>
      </PageHeader>
      <Card>
        <CardBody>
          <DataTable columns={columns} rows={rows} getRowKey={(row) => row.cveId} />
        </CardBody>
      </Card>
    </PageStack>
  );
}
