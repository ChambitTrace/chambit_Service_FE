import { Activity, AlertTriangle, Boxes, Network } from "lucide-react";
import styled, { css } from "styled-components";
import { securityRepository } from "../data/securityRepository";
import { DriftLineChart, PolicyPieChart, SeverityBarChart } from "../components/charts/SecurityCharts";
import { Card } from "../components/Card";
import { Grid, PageStack } from "./shared";

const metricIcons = [Network, Boxes, Activity, AlertTriangle];

export function DashboardOverview() {
  const metrics = securityRepository.getOverviewMetrics();

  return (
    <PageStack>
      <MetricGrid>
        {metrics.map((metric, index) => {
          const Icon = metricIcons[index] ?? Activity;
          return (
            <MetricCard key={metric.label} $tone={metric.tone}>
              <MetricTop>
                <span>{metric.label}</span>
                <Icon size={20} />
              </MetricTop>
              <MetricValue>{metric.value.toLocaleString()}</MetricValue>
              <MetricTrend>{metric.trend}</MetricTrend>
            </MetricCard>
          );
        })}
      </MetricGrid>
      <Grid>
        <SeverityBarChart data={securityRepository.getSeverityDistribution()} />
        <DriftLineChart data={securityRepository.getDriftTrend()} />
      </Grid>
      <Grid $columns="minmax(0, 0.72fr) minmax(0, 1.28fr)">
        <PolicyPieChart data={securityRepository.getPolicyRatio()} />
        <ThreatPanel>
          <h2>Runtime Threat Focus</h2>
          <ThreatRows>
            <ThreatRow>
              <strong>prod-sbom-cluster</strong>
              <span>Critical CVE와 Runtime Drift가 동시에 증가 중입니다.</span>
            </ThreatRow>
            <ThreatRow>
              <strong>vulnerable-node-app</strong>
              <span>빌드 SBOM에 없던 log4j 런타임 컴포넌트가 감지됐습니다.</span>
            </ThreatRow>
            <ThreatRow>
              <strong>payments-api</strong>
              <span>curl CVE와 binary drift가 결제 네임스페이스에서 연결됩니다.</span>
            </ThreatRow>
          </ThreatRows>
        </ThreatPanel>
      </Grid>
    </PageStack>
  );
}

const MetricGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 1rem;

  @media (max-width: 1120px) {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }

  @media (max-width: 560px) {
    grid-template-columns: 1fr;
  }
`;

const MetricCard = styled(Card)<{ $tone: string }>`
  padding: 1.15rem;

  ${({ $tone }) =>
    $tone === "danger" &&
    css`
      border-color: rgba(239, 68, 68, 0.48);
      box-shadow: 0 18px 60px rgba(239, 68, 68, 0.1);
    `}

  ${({ $tone }) =>
    $tone === "warning" &&
    css`
      border-color: rgba(245, 158, 11, 0.42);
      box-shadow: 0 18px 60px rgba(245, 158, 11, 0.08);
    `}
`;

const MetricTop = styled.div`
  display: flex;
  justify-content: space-between;
  gap: 1rem;
  color: ${({ theme }) => theme.colors.muted};
  font-size: 0.82rem;
  font-weight: 800;
`;

const MetricValue = styled.div`
  margin-top: 1rem;
  font-size: 2.15rem;
  font-weight: 900;
  line-height: 1;
`;

const MetricTrend = styled.div`
  margin-top: 0.65rem;
  color: ${({ theme }) => theme.colors.muted};
  font-size: 0.82rem;
`;

const ThreatPanel = styled(Card)`
  padding: 1.25rem;

  h2 {
    margin: 0 0 1rem;
    font-size: 1rem;
  }
`;

const ThreatRows = styled.div`
  display: grid;
  gap: 0.7rem;
`;

const ThreatRow = styled.div`
  display: grid;
  gap: 0.25rem;
  padding: 0.9rem;
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: 8px;
  background: rgba(7, 16, 20, 0.42);

  strong {
    color: ${({ theme }) => theme.colors.text};
  }

  span {
    color: ${({ theme }) => theme.colors.muted};
    font-size: 0.86rem;
  }
`;
