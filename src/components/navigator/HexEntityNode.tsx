import { AlertTriangle } from "lucide-react";
import styled, { css } from "styled-components";
import type { KubernetesEntity, OverlayMode } from "../../types/kubernetes";
import { colorForEntity, strokeForEntity } from "../../utils/entityColor";

interface HexEntityNodeProps {
  entity: KubernetesEntity;
  overlayMode: OverlayMode;
  selected: boolean;
  onHover: (entity: KubernetesEntity, x: number, y: number) => void;
  onLeave: () => void;
  onSelect: (entity: KubernetesEntity) => void;
}

export function HexEntityNode({ entity, overlayMode, selected, onHover, onLeave, onSelect }: HexEntityNodeProps) {
  return (
    <HexButton
      type="button"
      $fill={colorForEntity(entity, overlayMode)}
      $stroke={strokeForEntity(entity, selected)}
      $selected={selected}
      $dashed={entity.sbom.coverageStatus === "missing"}
      aria-label={entity.name}
      onMouseMove={(event) => onHover(entity, event.clientX, event.clientY)}
      onMouseLeave={onLeave}
      onClick={() => onSelect(entity)}
      title={entity.name}
    >
      {entity.security.criticalCveCount > 0 && <CriticalDot />}
      {entity.security.policyViolationCount > 0 && (
        <PolicyIcon>
          <AlertTriangle size={11} />
        </PolicyIcon>
      )}
      <Name>{entity.name}</Name>
    </HexButton>
  );
}

const HexButton = styled.button<{ $fill: string; $stroke: string; $selected: boolean; $dashed: boolean }>`
  position: relative;
  width: 3rem;
  height: 2.65rem;
  flex: 0 0 auto;
  border: 0;
  padding: 0;
  color: #061014;
  background: ${({ $fill }) => $fill};
  clip-path: polygon(25% 4%, 75% 4%, 100% 50%, 75% 96%, 25% 96%, 0 50%);
  box-shadow: inset 0 0 0 2px ${({ $stroke }) => $stroke};
  transition: transform 120ms ease, filter 120ms ease, box-shadow 120ms ease;

  &:hover {
    transform: translateY(-2px) scale(1.06);
    filter: brightness(1.08);
    z-index: 5;
  }

  ${({ $dashed }) =>
    $dashed &&
    css`
      opacity: 0.74;
      background-image: repeating-linear-gradient(45deg, transparent 0 5px, rgba(255, 255, 255, 0.28) 5px 7px);
    `}

  ${({ $selected }) =>
    $selected &&
    css`
      box-shadow: 0 0 0 3px rgba(56, 189, 248, 0.42), 0 0 22px rgba(56, 189, 248, 0.82);
      z-index: 6;
    `}
`;

const CriticalDot = styled.span`
  position: absolute;
  top: 0.28rem;
  right: 0.42rem;
  width: 0.48rem;
  height: 0.48rem;
  border-radius: 999px;
  background: #b91c1c;
  box-shadow: 0 0 0 2px rgba(5, 12, 16, 0.88);
`;

const PolicyIcon = styled.span`
  position: absolute;
  bottom: 0.22rem;
  right: 0.34rem;
  display: grid;
  place-items: center;
  color: #111827;
`;

const Name = styled.span`
  position: absolute;
  inset: 0.58rem 0.45rem;
  display: grid;
  place-items: center;
  overflow: hidden;
  font-size: 0.45rem;
  font-weight: 900;
  line-height: 1.05;
  text-align: center;
  text-overflow: ellipsis;
  word-break: break-word;
`;
