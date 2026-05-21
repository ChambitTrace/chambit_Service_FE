import { useMemo, useState } from "react";
import { Badge } from "../components/Badge";
import { Card, CardBody } from "../components/Card";
import { DataTable, type Column } from "../components/DataTable";
import { SearchField } from "../components/SearchField";
import { securityRepository } from "../data/securityRepository";
import type { RuntimeSbomComponent } from "../types/security";
import { MonoText, PageHeader, PageStack, PageTitle } from "./shared";

export function RuntimeSbomPage() {
  const [query, setQuery] = useState("");
  const rows = securityRepository.getRuntimeSbom();
  const filteredRows = useMemo(() => {
    const normalized = query.trim().toLowerCase();
    if (!normalized) return rows;
    return rows.filter(
      (row) => row.componentName.toLowerCase().includes(normalized) || row.pod.toLowerCase().includes(normalized),
    );
  }, [query, rows]);

  const columns: Column<RuntimeSbomComponent>[] = [
    { key: "namespace", header: "Namespace", render: (row) => row.namespace },
    { key: "pod", header: "Pod", render: (row) => row.pod, minWidth: "11rem" },
    { key: "container", header: "Container", render: (row) => row.container },
    { key: "component", header: "Component Name", render: (row) => <Badge value={row.componentName} /> },
    { key: "type", header: "Component Type", render: (row) => row.componentType },
    { key: "version", header: "Version", render: (row) => row.version },
    { key: "path", header: "Path", render: (row) => <MonoText>{row.path}</MonoText>, minWidth: "15rem" },
    { key: "hash", header: "Hash", render: (row) => <MonoText>{row.hash}</MonoText> },
    { key: "license", header: "License", render: (row) => row.license },
  ];

  return (
    <PageStack>
      <PageHeader>
        <PageTitle>
          <h2>Runtime SBOM</h2>
          <p>Pod와 Container에서 실제 로드된 컴포넌트 목록입니다.</p>
        </PageTitle>
        <SearchField value={query} placeholder="컴포넌트 또는 Pod 검색" onChange={setQuery} />
      </PageHeader>
      <Card>
        <CardBody>
          <DataTable
            columns={columns}
            rows={filteredRows}
            getRowKey={(row) => `${row.namespace}-${row.pod}-${row.container}-${row.componentName}`}
          />
        </CardBody>
      </Card>
    </PageStack>
  );
}
