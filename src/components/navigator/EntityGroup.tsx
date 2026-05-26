import styled from "styled-components";
import type { CSSProperties } from "react";
import type { EntityGroupModel, KubernetesEntity, OverlayMode } from "../../types/kubernetes";
import type { HoneycombAnimationPhase } from "./HoneycombCanvas";
import { HexEntityNode } from "./HexEntityNode";

const HEX_WIDTH = 36;
const HEX_HEIGHT = 42;
const ROW_STEP = HEX_HEIGHT * 0.75;
const COLUMN_STEP = HEX_WIDTH;
const ROW_OFFSET = HEX_WIDTH / 2;
const COLUMNS = 30;

interface EntityGroupProps {
  group: EntityGroupModel;
  overlayMode: OverlayMode;
  animationPhase: HoneycombAnimationPhase;
  selectedId?: string;
  onHover: (entity: KubernetesEntity, x: number, y: number) => void;
  onLeave: () => void;
  onSelect: (entity: KubernetesEntity) => void;
}

export function EntityGroup({ group, overlayMode, animationPhase, selectedId, onHover, onLeave, onSelect }: EntityGroupProps) {
  const rowCount = Math.max(1, Math.ceil(group.entities.length / COLUMNS));
  const canvasWidth = COLUMNS * COLUMN_STEP + ROW_OFFSET;
  const canvasHeight = (rowCount - 1) * ROW_STEP + HEX_HEIGHT;

  return (
    <Group>
      <GroupTitle>
        <strong>{group.name}</strong>
        <span>({group.entities.length})</span>
      </GroupTitle>
      <HoneycombStage style={{ width: canvasWidth, height: canvasHeight }}>
        {group.entities.map((entity, index) => {
          const row = Math.floor(index / COLUMNS);
          const column = index % COLUMNS;
          const x = column * COLUMN_STEP + (row % 2 === 1 ? ROW_OFFSET : 0);
          const y = row * ROW_STEP;
          const angle = ((index * 137.5) % 360) * (Math.PI / 180);
          const distance = 68 + (index % 7) * 10;
          const scatterX = Math.cos(angle) * distance;
          const scatterY = Math.sin(angle) * distance;

          return (
            <Cell
              key={entity.id}
              $phase={animationPhase}
              style={{
                "--x": `${x}px`,
                "--y": `${y}px`,
                "--scatter-x": `${scatterX}px`,
                "--scatter-y": `${scatterY}px`,
                "--assemble-delay": `${Math.min(index * 6, 180)}ms`,
              } as CSSProperties}
            >
            <HexEntityNode
              entity={entity}
              overlayMode={overlayMode}
              selected={selectedId === entity.id}
              onHover={onHover}
              onLeave={onLeave}
              onSelect={onSelect}
            />
          </Cell>
          );
        })}
      </HoneycombStage>
    </Group>
  );
}

const Group = styled.section`
  width: max-content;
  padding: 0.4rem 0 0.8rem;
`;

const GroupTitle = styled.div`
  display: flex;
  align-items: baseline;
  gap: 0.35rem;
  margin-bottom: 0.45rem;
  padding-left: 0.15rem;

  strong {
    color: ${({ theme }) => theme.colors.text};
    font-size: 0.92rem;
  }

  span {
    color: ${({ theme }) => theme.colors.muted};
    font-size: 0.82rem;
    font-weight: 800;
  }
`;

const HoneycombStage = styled.div`
  position: relative;
`;

const Cell = styled.div<{ $phase: HoneycombAnimationPhase }>`
  position: absolute;
  top: 0;
  left: 0;
  width: ${HEX_WIDTH}px;
  height: ${HEX_HEIGHT}px;
  opacity: ${({ $phase }) => ($phase === "scatter" ? 0.16 : 1)};
  transform: ${({ $phase }) =>
    $phase === "scatter"
      ? "translate(calc(var(--x) + var(--scatter-x)), calc(var(--y) + var(--scatter-y))) scale(0.35)"
      : "translate(var(--x), var(--y)) scale(1)"};
  transition:
    opacity ${({ $phase }) => ($phase === "scatter" ? "120ms" : "260ms")} ease,
    transform ${({ $phase }) => ($phase === "scatter" ? "150ms" : "520ms")} cubic-bezier(0.16, 1, 0.3, 1);
  transition-delay: ${({ $phase }) => ($phase === "assemble" ? "var(--assemble-delay)" : "0ms")};

  ${({ $phase }) =>
    $phase === "assemble" &&
    `
      animation: honeycomb-reassemble 520ms cubic-bezier(0.16, 1, 0.3, 1) both;
      animation-delay: var(--assemble-delay);
    `}

  @keyframes honeycomb-reassemble {
    from {
      opacity: 0.16;
      transform: translate(calc(var(--x) + var(--scatter-x)), calc(var(--y) + var(--scatter-y))) scale(0.35);
    }
    to {
      opacity: 1;
      transform: translate(var(--x), var(--y)) scale(1);
    }
  }
`;
