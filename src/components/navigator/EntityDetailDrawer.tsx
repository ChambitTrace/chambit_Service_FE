import { X } from "lucide-react";
import styled from "styled-components";
import type { KubernetesEntity } from "../../types/kubernetes";
import { MiniMetric } from "./MiniMetric";
import { SecurityBadge } from "./SecurityBadge";

interface EntityDetailDrawerProps {
  entity?: KubernetesEntity;
  onClose: () => void;
}

export function EntityDetailDrawer({ entity, onClose }: EntityDetailDrawerProps) {
  if (!entity) return null;

  return (
    <Drawer>
      <DrawerHeader>
        <div>
          <span>{entity.type.toUpperCase()}</span>
          <h3>{entity.name}</h3>
        </div>
        <button type="button" onClick={onClose} aria-label="close detail drawer">
          <X size={18} />
        </button>
      </DrawerHeader>

      <Section>
        <SectionTitle>Entity Summary</SectionTitle>
        <SummaryGrid>
          <MiniMetric label="Pod name" value={entity.relationships.pod ?? entity.name} />
          <MiniMetric label="Namespace" value={entity.namespace ?? "All Nodes"} />
          <MiniMetric label="Node" value={entity.relationships.node ?? "-"} />
          <MiniMetric label="Owner workload" value={entity.relationships.ownerWorkload ?? "-"} />
          <MiniMetric label="Container count" value={entity.containerCount ?? entity.relationships.containers?.length ?? "-"} />
          <MiniMetric label="Running image" value={entity.image ?? "-"} />
        </SummaryGrid>
      </Section>

      <Section>
        <SectionTitle>Runtime Metrics</SectionTitle>
        <SummaryGrid>
          <MiniMetric label="CPU usage limit" value={`${entity.metrics.cpuUsageLimitPercent ?? entity.metrics.allocatableCpuUsagePercent ?? 0}%`} />
          <MiniMetric label="CPU used cores" value={entity.metrics.cpuUsedCores ?? "-"} />
          <MiniMetric label="Memory usage limit" value={`${entity.metrics.memoryUsageLimitPercent ?? entity.metrics.allocatableMemoryUsagePercent ?? 0}%`} />
          <MiniMetric label="Memory used bytes" value={formatBytes(entity.metrics.memoryUsedBytes ?? 0)} />
          <MiniMetric label="Restarts total" value={entity.metrics.containerRestartsTotal ?? "-"} />
          <MiniMetric label="CPU throttle" value={`${entity.metrics.cpuThrottlePercent ?? 0}%`} />
        </SummaryGrid>
      </Section>

      <Section>
        <SectionTitle>Runtime SBOM Summary</SectionTitle>
        <SummaryGrid>
          <MiniMetric label="SBOM format" value={entity.sbom.format} />
          <MiniMetric label="Components" value={entity.sbom.componentCount} />
          <MiniMetric label="Loaded binaries" value={entity.sbom.loadedBinaryCount} />
          <MiniMetric label="Loaded libraries" value={entity.sbom.loadedLibraryCount} />
          <MiniMetric label="Coverage" value={entity.sbom.coverageStatus} />
          <MiniMetric label="Generated" value={entity.sbom.lastGeneratedAt ?? "Missing"} />
        </SummaryGrid>
      </Section>

      <Section>
        <SectionTitle>Drift / CVE / Policy</SectionTitle>
        <BadgeGrid>
          <SecurityBadge label={`Added/Modified/Removed drift: ${entity.security.driftCount}`} tone={entity.security.driftCount > 0 ? "warning" : "good"} />
          <SecurityBadge label={`Critical ${entity.security.criticalCveCount}`} tone={entity.security.criticalCveCount > 0 ? "critical" : "good"} />
          <SecurityBadge label={`High ${entity.security.highCveCount}`} tone={entity.security.highCveCount > 0 ? "warning" : "good"} />
          <SecurityBadge label={`Medium ${entity.security.mediumCveCount}`} tone="neutral" />
          <SecurityBadge label={`Low ${entity.security.lowCveCount}`} tone="info" />
          <SecurityBadge label={`Policy action: ${entity.security.riskLevel === "critical" ? "Block" : entity.security.riskLevel === "high" ? "Alert" : "Allow"}`} tone={entity.security.riskLevel === "critical" ? "critical" : "info"} />
        </BadgeGrid>
      </Section>

      <Section>
        <SectionTitle>Related Resources</SectionTitle>
        <RelatedList>
          <li>Deployment: {entity.relationships.deployment ?? "-"}</li>
          <li>StatefulSet: {entity.relationships.statefulset ?? "-"}</li>
          <li>DaemonSet: {entity.relationships.daemonset ?? "-"}</li>
          <li>Job: {entity.relationships.job ?? "-"}</li>
          <li>CronJob: {entity.relationships.cronjob ?? "-"}</li>
        </RelatedList>
      </Section>
    </Drawer>
  );
}

const formatBytes = (value: number) => {
  if (!value) return "0 B";
  if (value > 1_000_000_000) return `${(value / 1_000_000_000).toFixed(1)} GB`;
  return `${(value / 1_000_000).toFixed(0)} MB`;
};

const Drawer = styled.aside`
  position: fixed;
  top: 0;
  right: 0;
  z-index: 50;
  width: min(31rem, 100vw);
  height: 100vh;
  overflow: auto;
  border-left: 1px solid ${({ theme }) => theme.colors.border};
  background: rgba(8, 17, 22, 0.98);
  box-shadow: -24px 0 80px rgba(0, 0, 0, 0.42);
`;

const DrawerHeader = styled.div`
  position: sticky;
  top: 0;
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 1rem;
  padding: 1rem;
  border-bottom: 1px solid ${({ theme }) => theme.colors.border};
  background: rgba(8, 17, 22, 0.98);

  span {
    color: ${({ theme }) => theme.colors.accent};
    font-size: 0.7rem;
    font-weight: 900;
  }

  h3 {
    margin: 0.25rem 0 0;
    font-size: 1.15rem;
    line-height: 1.2;
  }

  button {
    display: grid;
    place-items: center;
    width: 2rem;
    height: 2rem;
    border: 1px solid ${({ theme }) => theme.colors.border};
    border-radius: 6px;
    color: ${({ theme }) => theme.colors.text};
    background: rgba(18, 36, 44, 0.9);
  }
`;

const Section = styled.section`
  padding: 1rem;
  border-bottom: 1px solid rgba(32, 57, 67, 0.55);
`;

const SectionTitle = styled.h4`
  margin: 0 0 0.75rem;
  font-size: 0.9rem;
`;

const SummaryGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 0.55rem;
`;

const BadgeGrid = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.45rem;
`;

const RelatedList = styled.ul`
  display: grid;
  gap: 0.45rem;
  margin: 0;
  padding-left: 1rem;
  color: ${({ theme }) => theme.colors.muted};
  font-size: 0.84rem;
`;
