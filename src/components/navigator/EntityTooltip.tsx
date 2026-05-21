import styled from "styled-components";
import type { KubernetesEntity } from "../../types/kubernetes";

interface EntityTooltipProps {
  entity: KubernetesEntity;
  x: number;
  y: number;
}

export function EntityTooltip({ entity, x, y }: EntityTooltipProps) {
  return (
    <Tooltip style={{ left: x + 14, top: y + 14 }}>
      <strong>{entity.name}</strong>
      <dl>
        <dt>Namespace</dt><dd>{entity.namespace ?? "All Nodes"}</dd>
        <dt>Node</dt><dd>{entity.relationships.node ?? "-"}</dd>
        <dt>Status</dt><dd>{entity.status}</dd>
        <dt>CPU Usage</dt><dd>{entity.metrics.cpuUsageLimitPercent ?? entity.metrics.allocatableCpuUsagePercent ?? 0}%</dd>
        <dt>Memory Usage</dt><dd>{entity.metrics.memoryUsageLimitPercent ?? entity.metrics.allocatableMemoryUsagePercent ?? 0}%</dd>
        <dt>Drift Count</dt><dd>{entity.security.driftCount}</dd>
        <dt>Critical CVEs</dt><dd>{entity.security.criticalCveCount}</dd>
        <dt>Policy Violations</dt><dd>{entity.security.policyViolationCount}</dd>
        <dt>Runtime SBOM</dt><dd>{entity.sbom.coverageStatus}</dd>
      </dl>
    </Tooltip>
  );
}

const Tooltip = styled.div`
  position: fixed;
  z-index: 60;
  width: 18rem;
  pointer-events: none;
  padding: 0.85rem;
  border: 1px solid rgba(148, 174, 182, 0.34);
  border-radius: 8px;
  background: rgba(5, 12, 16, 0.96);
  box-shadow: 0 18px 60px rgba(0, 0, 0, 0.45);

  strong {
    display: block;
    margin-bottom: 0.65rem;
    color: ${({ theme }) => theme.colors.text};
    font-size: 0.92rem;
  }

  dl {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 0.35rem 0.8rem;
    margin: 0;
    font-size: 0.76rem;
  }

  dt {
    color: ${({ theme }) => theme.colors.muted};
  }

  dd {
    margin: 0;
    color: ${({ theme }) => theme.colors.text};
    text-align: right;
    font-weight: 800;
  }
`;
