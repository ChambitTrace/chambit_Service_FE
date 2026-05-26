import { AlertTriangle } from "lucide-react";
import styled, { css } from "styled-components";
import type { KubernetesEntity, OverlayMode } from "../../types/kubernetes";
import { colorForEntity, hasAnomaly, strokeForEntity } from "../../utils/entityColor";

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
      $anomaly={hasAnomaly(entity)}
      aria-label={entity.name}
      onMouseMove={(event) => onHover(entity, event.clientX, event.clientY)}
      onMouseLeave={onLeave}
      onClick={() => onSelect(entity)}
      title={entity.name}
    >
      {hasAnomaly(entity) && <AnomalyDot />}
      {entity.security.policyViolationCount > 0 && (
        <PolicyIcon>
          <AlertTriangle size={11} />
        </PolicyIcon>
      )}
    </HexButton>
  );
}

const HexButton = styled.button<{ $fill: string; $stroke: string; $selected: boolean; $dashed: boolean; $anomaly: boolean }>`
  position: relative;
  width: 36px;
  height: 42px;
  flex: 0 0 auto;
  border: 0;
  padding: 0;
  color: #061014;
  background: ${({ $fill }) => $fill};
  clip-path: polygon(50% 0, 100% 25%, 100% 75%, 50% 100%, 0 75%, 0 25%);
  box-shadow: inset 0 0 0 1px ${({ $stroke }) => $stroke};
  transition: transform 120ms ease, filter 120ms ease, box-shadow 120ms ease;

  &:hover {
    transform: scale(1.045);
    filter: brightness(1.08);
    z-index: 5;
  }

  ${({ $dashed }) =>
    $dashed &&
    css`
      opacity: 0.74;
      background-image: repeating-linear-gradient(45deg, transparent 0 5px, rgba(255, 255, 255, 0.28) 5px 7px);
    `}

  ${({ $anomaly }) =>
    $anomaly &&
    css`
      box-shadow: inset 0 0 0 1px rgba(255, 255, 255, 0.28), 0 0 14px rgba(239, 68, 68, 0.18);
    `}

  ${({ $selected }) =>
    $selected &&
    css`
      box-shadow: 0 0 0 3px rgba(56, 189, 248, 0.42), 0 0 22px rgba(56, 189, 248, 0.82);
      z-index: 6;
    `}
`;

const AnomalyDot = styled.span`
  position: absolute;
  top: 0.46rem;
  right: 0.3rem;
  width: 0.3rem;
  height: 0.3rem;
  border-radius: 999px;
  background: #b91c1c;
  box-shadow: 0 0 0 2px rgba(5, 12, 16, 0.88);
`;

const PolicyIcon = styled.span`
  position: absolute;
  bottom: 0.38rem;
  right: 0.22rem;
  display: grid;
  place-items: center;
  color: #111827;
`;
