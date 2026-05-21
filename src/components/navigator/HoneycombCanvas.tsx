import { useState } from "react";
import styled from "styled-components";
import type { EntityGroupModel, KubernetesEntity, OverlayMode } from "../../types/kubernetes";
import { EntityGroup } from "./EntityGroup";
import { EntityTooltip } from "./EntityTooltip";

interface HoneycombCanvasProps {
  groups: EntityGroupModel[];
  overlayMode: OverlayMode;
  selected?: KubernetesEntity;
  onSelect: (entity: KubernetesEntity) => void;
}

interface HoverState {
  entity: KubernetesEntity;
  x: number;
  y: number;
}

export function HoneycombCanvas({ groups, overlayMode, selected, onSelect }: HoneycombCanvasProps) {
  const [hover, setHover] = useState<HoverState | undefined>();

  return (
    <Canvas>
      <Legend>
        <span><i className="healthy" /> Healthy</span>
        <span><i className="warning" /> Warning</span>
        <span><i className="critical" /> Critical</span>
        <span><i className="drift" /> Drift ring</span>
        <span><i className="missing" /> SBOM missing</span>
      </Legend>
      <ScrollArea>
        <Groups>
          {groups.map((group) => (
            <EntityGroup
              key={group.name}
              group={group}
              overlayMode={overlayMode}
              selectedId={selected?.id}
              onHover={(entity, x, y) => setHover({ entity, x, y })}
              onLeave={() => setHover(undefined)}
              onSelect={onSelect}
            />
          ))}
        </Groups>
      </ScrollArea>
      {hover && <EntityTooltip entity={hover.entity} x={hover.x} y={hover.y} />}
    </Canvas>
  );
}

const Canvas = styled.section`
  position: relative;
  min-height: 43rem;
  background:
    linear-gradient(rgba(34, 211, 238, 0.04) 1px, transparent 1px),
    linear-gradient(90deg, rgba(34, 211, 238, 0.04) 1px, transparent 1px),
    #081116;
  background-size: 34px 34px;
`;

const Legend = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.7rem;
  padding: 0.8rem 1rem;
  border-bottom: 1px solid ${({ theme }) => theme.colors.border};
  color: ${({ theme }) => theme.colors.muted};
  font-size: 0.75rem;
  font-weight: 800;

  span {
    display: inline-flex;
    align-items: center;
    gap: 0.35rem;
  }

  i {
    width: 0.7rem;
    height: 0.7rem;
    border-radius: 999px;
  }

  .healthy { background: #22c55e; }
  .warning { background: #f59e0b; }
  .critical { background: #ef4444; }
  .drift { border: 2px solid #a855f7; }
  .missing { background: #64748b; opacity: 0.65; }
`;

const ScrollArea = styled.div`
  overflow: auto;
  height: calc(100vh - 19rem);
  min-height: 36rem;
`;

const Groups = styled.div`
  display: grid;
  grid-template-columns: repeat(2, minmax(44rem, 1fr));
  align-items: start;
  gap: 1rem;
  min-width: 92rem;
  padding: 1rem;
`;
