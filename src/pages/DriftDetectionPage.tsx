import { Badge } from "../components/Badge";
import { Card, CardBody } from "../components/Card";
import { DataTable, type Column } from "../components/DataTable";
import { securityRepository } from "../data/securityRepository";
import type { DriftEvent } from "../types/security";
import { MonoText, PageHeader, PageStack, PageTitle } from "./shared";

export function DriftDetectionPage() {
  const rows = securityRepository.getDriftEvents();
  const columns: Column<DriftEvent>[] = [
    { key: "pod", header: "Pod", render: (row) => row.pod, minWidth: "11rem" },
    { key: "container", header: "Container", render: (row) => row.container },
    { key: "type", header: "Drift Type", render: (row) => <Badge value={row.driftType} /> },
    { key: "component", header: "Component", render: (row) => row.component },
    { key: "build", header: "Build Version", render: (row) => row.buildVersion },
    { key: "runtime", header: "Runtime Version", render: (row) => row.runtimeVersion },
    { key: "path", header: "Path", render: (row) => <MonoText>{row.path}</MonoText>, minWidth: "15rem" },
    { key: "detected", header: "Detected At", render: (row) => row.detectedAt, minWidth: "10rem" },
    { key: "risk", header: "Risk Level", render: (row) => <Badge value={row.riskLevel} /> },
  ];

  return (
    <PageStack>
      <PageHeader>
        <PageTitle>
          <h2>Drift Detection</h2>
          <p>빌드 타임 SBOM과 런타임 SBOM의 차이를 위험도와 함께 보여줍니다.</p>
        </PageTitle>
      </PageHeader>
      <Card>
        <CardBody>
          <DataTable columns={columns} rows={rows} getRowKey={(row) => `${row.pod}-${row.component}-${row.detectedAt}`} />
        </CardBody>
      </Card>
    </PageStack>
  );
}
