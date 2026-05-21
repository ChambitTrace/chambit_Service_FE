import { useMemo, useState } from "react";
import styled, { css } from "styled-components";
import { Badge } from "../components/Badge";
import { Card, CardBody, CardHeader, CardSubtitle, CardTitle } from "../components/Card";
import { HoneycombNavigator } from "../components/kubernetes-asset-navigator/HoneycombNavigator";
import { SearchField } from "../components/SearchField";
import { securityRepository } from "../data/securityRepository";
import type { KubernetesAsset, KubernetesAssetKind, KubernetesAssetRisk } from "../types/security";
import {
  buildKubernetesAssetSummary,
  getInitialKubernetesAssetId,
  getKubernetesAssetBreadcrumbs,
  getVisibleKubernetesAssets,
} from "../utils/kubernetesAssetNavigator";
import { Grid, MonoText, PageHeader, PageStack, PageTitle } from "./shared";

const kindLabels: Record<KubernetesAssetKind, string> = {
  cluster: "Clusters",
  namespace: "Namespaces",
  pod: "Pods",
  container: "Containers",
  component: "Components",
};

const riskLabel: Record<KubernetesAssetRisk, string> = {
  critical: "Critical",
  high: "High",
  medium: "Medium",
  low: "Low",
  healthy: "Healthy",
};

export function KubernetesAssetNavigatorPage() {
  const graph = securityRepository.getKubernetesAssetGraph();
  const initialAssetId = getInitialKubernetesAssetId(graph);
  const [query, setQuery] = useState("");
  const [selectedAssetId, setSelectedAssetId] = useState<string | null>(initialAssetId);
  const summary = useMemo(() => buildKubernetesAssetSummary(graph), [graph]);
  const visibleAssets = useMemo(
    () => getVisibleKubernetesAssets(graph, selectedAssetId, query),
    [graph, query, selectedAssetId],
  );
  const breadcrumbs = useMemo(() => getKubernetesAssetBreadcrumbs(graph, selectedAssetId), [graph, selectedAssetId]);
  const selectedAsset = breadcrumbs.at(-1) ?? visibleAssets[0] ?? null;

  return (
    <PageStack>
      <PageHeader>
        <PageTitle>
          <h2>Kubernetes Asset Navigator</h2>
          <p>클러스터부터 런타임 컴포넌트까지 Honeycomb 맵으로 SBOM 위험 전파 경로를 탐색합니다.</p>
        </PageTitle>
        <SearchField value={query} placeholder="클러스터, Pod, 컴포넌트, CVE 검색" onChange={setQuery} />
      </PageHeader>

      <SummaryGrid>
        <SummaryCard $tone={summary.highestRisk}>
          <span>Highest Risk</span>
          <strong>{riskLabel[summary.highestRisk]}</strong>
          <small>{summary.policyBlocked} policy-blocked assets</small>
        </SummaryCard>
        <SummaryCard $tone="healthy">
          <span>Total Assets</span>
          <strong>{summary.totalAssets}</strong>
          <small>{graph.generatedAt}</small>
        </SummaryCard>
        <SummaryCard $tone="high">
          <span>Exposed Components</span>
          <strong>{summary.exposedComponents}</strong>
          <small>runtime components with risk signals</small>
        </SummaryCard>
      </SummaryGrid>

      <Grid $columns="minmax(0, 1.25fr) minmax(20rem, 0.75fr)">
        <Card>
          <CardHeader>
            <div>
              <CardTitle>Honeycomb Asset Map</CardTitle>
              <CardSubtitle>자산을 선택하면 하위 자산으로 드릴다운하고, 검색 시 전체 그래프에서 매칭합니다.</CardSubtitle>
            </div>
            <ResetButton type="button" onClick={() => setSelectedAssetId(initialAssetId)}>
              Reset
            </ResetButton>
          </CardHeader>
          <CardBody>
            <Breadcrumbs aria-label="Asset breadcrumbs">
              <CrumbButton type="button" onClick={() => setSelectedAssetId(null)}>
                All clusters
              </CrumbButton>
              {breadcrumbs.map((asset) => (
                <CrumbButton key={asset.id} type="button" onClick={() => setSelectedAssetId(asset.id)}>
                  / {asset.label}
                </CrumbButton>
              ))}
            </Breadcrumbs>
            <HoneycombNavigator assets={visibleAssets} selectedAssetId={selectedAssetId} onSelectAsset={setSelectedAssetId} />
          </CardBody>
        </Card>

        <DetailsCard>
          <CardHeader>
            <div>
              <CardTitle>Asset Intelligence</CardTitle>
              <CardSubtitle>선택된 Kubernetes 자산의 런타임 SBOM 컨텍스트입니다.</CardSubtitle>
            </div>
          </CardHeader>
          <CardBody>{selectedAsset ? <AssetDetails asset={selectedAsset} /> : <EmptyDetails>No asset selected</EmptyDetails>}</CardBody>
        </DetailsCard>
      </Grid>

      <Card>
        <CardHeader>
          <div>
            <CardTitle>Inventory Depth</CardTitle>
            <CardSubtitle>Runtime SBOM Guard가 수집한 계층별 Kubernetes 자산 수입니다.</CardSubtitle>
          </div>
        </CardHeader>
        <CardBody>
          <DepthGrid>
            {Object.entries(summary.byKind).map(([kind, count]) => (
              <DepthItem key={kind}>
                <span>{kindLabels[kind as KubernetesAssetKind]}</span>
                <strong>{count}</strong>
              </DepthItem>
            ))}
          </DepthGrid>
        </CardBody>
      </Card>
    </PageStack>
  );
}

function AssetDetails({ asset }: { asset: KubernetesAsset }) {
  const rows = [
    ["Kind", asset.kind],
    ["Name", asset.name],
    ["Status", asset.status],
    ["Owner", asset.owner],
    ["Namespace", asset.namespace],
    ["Image", asset.image],
    ["Version", asset.version],
    ["CVE", asset.cveId],
    ["Metadata", asset.metadata],
  ].filter(([, value]) => Boolean(value));

  return (
    <DetailsStack>
      <DetailsTop>
        <div>
          <Kicker>{asset.kind}</Kicker>
          <h3>{asset.label}</h3>
        </div>
        <Badge value={riskLabel[asset.risk]} />
      </DetailsTop>
      <StatusBox $risk={asset.risk}>{asset.status}</StatusBox>
      <DetailRows>
        {rows.map(([label, value]) => (
          <DetailRow key={label}>
            <span>{label}</span>
            <MonoText>{value}</MonoText>
          </DetailRow>
        ))}
      </DetailRows>
      {asset.children.length > 0 ? (
        <ChildHint>{asset.children.length} child assets available. Select this hex to continue drill-down.</ChildHint>
      ) : (
        <ChildHint>Leaf runtime component reached.</ChildHint>
      )}
    </DetailsStack>
  );
}

const SummaryGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 1rem;

  @media (max-width: 860px) {
    grid-template-columns: 1fr;
  }
`;

const SummaryCard = styled(Card)<{ $tone: KubernetesAssetRisk }>`
  display: grid;
  gap: 0.4rem;
  padding: 1.1rem;

  span,
  small {
    color: ${({ theme }) => theme.colors.muted};
    font-size: 0.78rem;
    font-weight: 800;
  }

  strong {
    font-size: 1.7rem;
    line-height: 1;
  }

  ${({ $tone, theme }) =>
    $tone === "critical" &&
    css`
      border-color: rgba(251, 113, 133, 0.52);
      strong {
        color: ${theme.colors.critical};
      }
    `}
`;

const ResetButton = styled.button`
  min-height: 2.1rem;
  padding: 0 0.75rem;
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: 8px;
  color: ${({ theme }) => theme.colors.text};
  background: rgba(7, 16, 20, 0.72);
  font-weight: 800;
`;

const Breadcrumbs = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.35rem;
  margin-bottom: 1rem;
`;

const CrumbButton = styled.button`
  border: 0;
  color: ${({ theme }) => theme.colors.accent};
  background: transparent;
  font-size: 0.8rem;
  font-weight: 800;
`;

const DetailsCard = styled(Card)`
  min-height: 100%;
`;

const DetailsStack = styled.div`
  display: grid;
  gap: 1rem;
`;

const DetailsTop = styled.div`
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 1rem;

  h3 {
    margin: 0.25rem 0 0;
    font-size: 1.25rem;
  }
`;

const Kicker = styled.span`
  color: ${({ theme }) => theme.colors.accent};
  font-size: 0.72rem;
  font-weight: 900;
  text-transform: uppercase;
`;

const StatusBox = styled.div<{ $risk: KubernetesAssetRisk }>`
  padding: 0.9rem;
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: 8px;
  background: rgba(7, 16, 20, 0.52);
  color: ${({ theme }) => theme.colors.text};
  font-weight: 800;
`;

const DetailRows = styled.div`
  display: grid;
  gap: 0.5rem;
`;

const DetailRow = styled.div`
  display: grid;
  grid-template-columns: 6rem minmax(0, 1fr);
  gap: 0.75rem;
  padding-bottom: 0.5rem;
  border-bottom: 1px solid rgba(32, 57, 67, 0.58);

  span:first-child {
    color: ${({ theme }) => theme.colors.muted};
    font-size: 0.76rem;
    font-weight: 900;
    text-transform: uppercase;
  }
`;

const ChildHint = styled.p`
  margin: 0;
  color: ${({ theme }) => theme.colors.muted};
  font-size: 0.84rem;
`;

const EmptyDetails = styled.div`
  color: ${({ theme }) => theme.colors.muted};
`;

const DepthGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(5, minmax(0, 1fr));
  gap: 0.8rem;

  @media (max-width: 900px) {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
`;

const DepthItem = styled.div`
  display: grid;
  gap: 0.35rem;
  padding: 0.9rem;
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: 8px;
  background: rgba(7, 16, 20, 0.44);

  span {
    color: ${({ theme }) => theme.colors.muted};
    font-size: 0.75rem;
    font-weight: 900;
  }

  strong {
    font-size: 1.5rem;
  }
`;
