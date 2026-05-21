import { Badge } from "../components/Badge";
import { Card, CardBody } from "../components/Card";
import { DataTable, type Column } from "../components/DataTable";
import { securityRepository } from "../data/securityRepository";
import type { AlertEvent } from "../types/security";
import { PageHeader, PageStack, PageTitle } from "./shared";

export function AlertsPage() {
  const rows = securityRepository.getAlerts();
  const columns: Column<AlertEvent>[] = [
    { key: "time", header: "Time", render: (row) => row.time, minWidth: "10rem" },
    { key: "type", header: "Type", render: (row) => <Badge value={row.type} /> },
    { key: "target", header: "Target", render: (row) => row.target, minWidth: "13rem" },
    { key: "message", header: "Message", render: (row) => row.message, minWidth: "20rem" },
    { key: "severity", header: "Severity", render: (row) => <Badge value={row.severity} /> },
    { key: "status", header: "Status", render: (row) => <Badge value={row.status} /> },
  ];

  return (
    <PageStack>
      <PageHeader>
        <PageTitle>
          <h2>Alerts</h2>
          <p>Drift, CVE, Policy, Runtime 이벤트를 보안 관제 큐로 제공합니다.</p>
        </PageTitle>
      </PageHeader>
      <Card>
        <CardBody>
          <DataTable columns={columns} rows={rows} getRowKey={(row) => `${row.time}-${row.target}`} />
        </CardBody>
      </Card>
    </PageStack>
  );
}
