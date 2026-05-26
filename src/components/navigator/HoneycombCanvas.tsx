import { useState } from "react";
import styled from "styled-components";
import type { EntityGroupModel, KubernetesEntity, OverlayMode } from "../../types/kubernetes";
import { EntityGroup } from "./EntityGroup";
import { EntityTooltip } from "./EntityTooltip";

export type HoneycombAnimationPhase = "idle" | "scatter" | "assemble";

interface HoneycombCanvasProps {
  groups: EntityGroupModel[];
  overlayMode: OverlayMode;
  animationPhase?: HoneycombAnimationPhase;
  selected?: KubernetesEntity;
  onSelect: (entity: KubernetesEntity) => void;
}

interface HoverState {
  entity: KubernetesEntity;
  x: number;
  y: number;
}

export function HoneycombCanvas({ groups, overlayMode, animationPhase = "idle", selected, onSelect }: HoneycombCanvasProps) {
  const [hover, setHover] = useState<HoverState | undefined>();

  return (
    <Canvas>
      <ScrollArea>
        <Groups>
          {groups.map((group) => (
            <EntityGroup
              key={group.name}
              group={group}
              overlayMode={overlayMode}
              animationPhase={animationPhase}
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
  display: grid;
  grid-template-rows: minmax(0, 1fr);
  min-width: 0;
  min-height: 0;
  overflow: hidden;
  background:
    linear-gradient(rgba(34, 211, 238, 0.04) 1px, transparent 1px),
    linear-gradient(90deg, rgba(34, 211, 238, 0.04) 1px, transparent 1px),
    #081116;
  background-size: 34px 34px;
`;

const ScrollArea = styled.div`
  overflow: auto;
  min-width: 0;
  height: auto;
  min-height: 0;
`;

const Groups = styled.div`
  display: grid;
  grid-template-columns: repeat(3, max-content);
  align-items: start;
  gap: 2.9rem 4rem;
  width: max-content;
  min-width: 100%;
  padding: 0.9rem 1rem 1.5rem;
`;
