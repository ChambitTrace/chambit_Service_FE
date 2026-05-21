import { useState } from "react";
import { Badge } from "../components/Badge";
import { Card, CardBody } from "../components/Card";
import { DataTable, type Column } from "../components/DataTable";
import { Switch } from "../components/Switch";
import { securityRepository } from "../data/securityRepository";
import type { PolicyRule } from "../types/security";
import { PageHeader, PageStack, PageTitle } from "./shared";

export function PolicyEnginePage() {
  const [policies, setPolicies] = useState<PolicyRule[]>(securityRepository.getPolicies());

  const togglePolicy = (policyName: string) => {
    setPolicies((current) =>
      current.map((policy) => (policy.policyName === policyName ? { ...policy, enabled: !policy.enabled } : policy)),
    );
  };

  const columns: Column<PolicyRule>[] = [
    { key: "name", header: "Policy Name", render: (row) => row.policyName, minWidth: "13rem" },
    { key: "rule", header: "Rule", render: (row) => row.rule, minWidth: "14rem" },
    { key: "action", header: "Action", render: (row) => <Badge value={row.action} /> },
    { key: "enabled", header: "Enabled", render: (row) => <Switch checked={row.enabled} onChange={() => togglePolicy(row.policyName)} /> },
    { key: "violations", header: "Violation Count", render: (row) => row.violationCount },
  ];

  return (
    <PageStack>
      <PageHeader>
        <PageTitle>
          <h2>Policy Engine</h2>
          <p>공급망 보안 정책과 런타임 위반 내역을 관리합니다.</p>
        </PageTitle>
      </PageHeader>
      <Card>
        <CardBody>
          <DataTable columns={columns} rows={policies} getRowKey={(row) => row.policyName} />
        </CardBody>
      </Card>
    </PageStack>
  );
}
