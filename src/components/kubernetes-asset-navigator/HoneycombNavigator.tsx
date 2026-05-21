import { Box, Cloud, Container, Hexagon, Layers, ShieldAlert } from "lucide-react";
import styled, { css } from "styled-components";
import type { KubernetesAsset, KubernetesAssetKind, KubernetesAssetRisk } from "../../types/security";

interface HoneycombNavigatorProps {
  assets: KubernetesAsset[];
  selectedAssetId: string | null;
  onSelectAsset: (assetId: string) => void;
}

const kindIcons = {
  cluster: Cloud,
  namespace: Layers,
  pod: Hexagon,
  container: Container,
  component: Box,
} satisfies Record<KubernetesAssetKind, typeof Cloud>;

const riskLabels: Record<KubernetesAssetRisk, string> = {
  critical: "Critical",
  high: "High",
  medium: "Medium",
  low: "Low",
  healthy: "Healthy",
};

export function HoneycombNavigator({ assets, selectedAssetId, onSelectAsset }: HoneycombNavigatorProps) {
  if (assets.length === 0) {
    return (
      <EmptyState>
        <ShieldAlert size={22} />
        <strong>No assets matched</strong>
        <span>검색어를 변경하거나 상위 자산으로 돌아가세요.</span>
      </EmptyState>
    );
  }

  return (
    <Honeycomb aria-label="Kubernetes asset honeycomb navigator">
      {assets.map((asset, index) => {
        const Icon = kindIcons[asset.kind];
        return (
          <CellButton
            key={asset.id}
            type="button"
            $risk={asset.risk}
            $selected={asset.id === selectedAssetId}
            $offset={index % 2 === 1}
            onClick={() => onSelectAsset(asset.id)}
          >
            <CellChrome>
              <CellTop>
                <Icon size={20} aria-hidden />
                <RiskText>{riskLabels[asset.risk]}</RiskText>
              </CellTop>
              <CellName>{asset.label}</CellName>
              <CellKind>{asset.kind}</CellKind>
              {asset.policyBlocked ? <PolicyTag>Policy block</PolicyTag> : null}
            </CellChrome>
          </CellButton>
        );
      })}
    </Honeycomb>
  );
}

const riskColor = (risk: KubernetesAssetRisk, theme: import("styled-components").DefaultTheme) => {
  switch (risk) {
    case "critical":
      return theme.colors.critical;
    case "high":
      return theme.colors.high;
    case "medium":
      return theme.colors.warning;
    case "low":
      return theme.colors.low;
    case "healthy":
      return theme.colors.success;
  }
};

const Honeycomb = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(10rem, 1fr));
  gap: 0.85rem;
  align-items: center;
`;

const CellButton = styled.button<{ $risk: KubernetesAssetRisk; $selected: boolean; $offset: boolean }>`
  position: relative;
  min-height: 9.4rem;
  padding: 0;
  border: 0;
  color: ${({ theme }) => theme.colors.text};
  background: transparent;
  cursor: pointer;
  transform: translateY(${({ $offset }) => ($offset ? "1.2rem" : "0")});

  @media (max-width: 760px) {
    transform: none;
  }

  &::before {
    position: absolute;
    inset: 0;
    content: "";
    clip-path: polygon(25% 3%, 75% 3%, 100% 50%, 75% 97%, 25% 97%, 0 50%);
    background: ${({ $risk, theme }) => riskColor($risk, theme)};
    opacity: ${({ $selected }) => ($selected ? 0.88 : 0.38)};
    transition: opacity 160ms ease, transform 160ms ease;
  }

  &:hover::before,
  &:focus-visible::before {
    opacity: 0.82;
    transform: scale(1.025);
  }

  ${({ $selected, theme }) =>
    $selected &&
    css`
      filter: drop-shadow(0 0 22px rgba(34, 211, 238, 0.2));

      ${CellChrome} {
        background: linear-gradient(180deg, rgba(18, 36, 44, 0.98), rgba(7, 16, 20, 0.96));
      }

      ${CellKind} {
        color: ${theme.colors.accent};
      }
    `}
`;

const CellChrome = styled.span`
  position: absolute;
  inset: 2px;
  display: grid;
  align-content: center;
  gap: 0.4rem;
  padding: 1.3rem 1rem;
  clip-path: polygon(25% 3%, 75% 3%, 100% 50%, 75% 97%, 25% 97%, 0 50%);
  background: linear-gradient(180deg, rgba(18, 36, 44, 0.92), rgba(13, 26, 32, 0.95));
  text-align: center;
`;

const CellTop = styled.span`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.35rem;
  color: ${({ theme }) => theme.colors.muted};
`;

const RiskText = styled.span`
  font-size: 0.68rem;
  font-weight: 900;
  text-transform: uppercase;
`;

const CellName = styled.strong`
  display: block;
  overflow: hidden;
  font-size: 0.88rem;
  line-height: 1.2;
  text-overflow: ellipsis;
`;

const CellKind = styled.span`
  color: ${({ theme }) => theme.colors.faint};
  font-size: 0.68rem;
  font-weight: 900;
  text-transform: uppercase;
`;

const PolicyTag = styled.span`
  justify-self: center;
  width: fit-content;
  padding: 0.18rem 0.45rem;
  border: 1px solid rgba(239, 68, 68, 0.42);
  border-radius: 999px;
  color: ${({ theme }) => theme.colors.critical};
  background: rgba(239, 68, 68, 0.12);
  font-size: 0.62rem;
  font-weight: 900;
`;

const EmptyState = styled.div`
  display: grid;
  place-items: center;
  gap: 0.35rem;
  min-height: 15rem;
  border: 1px dashed ${({ theme }) => theme.colors.border};
  border-radius: 8px;
  color: ${({ theme }) => theme.colors.muted};
  text-align: center;

  strong {
    color: ${({ theme }) => theme.colors.text};
  }
`;
