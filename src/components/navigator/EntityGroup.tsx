import styled from "styled-components";
import type { EntityGroupModel, KubernetesEntity, OverlayMode } from "../../types/kubernetes";
import { HexEntityNode } from "./HexEntityNode";

interface EntityGroupProps {
  group: EntityGroupModel;
  overlayMode: OverlayMode;
  selectedId?: string;
  onHover: (entity: KubernetesEntity, x: number, y: number) => void;
  onLeave: () => void;
  onSelect: (entity: KubernetesEntity) => void;
}

export function EntityGroup({ group, overlayMode, selectedId, onHover, onLeave, onSelect }: EntityGroupProps) {
  return (
    <Group>
      <GroupTitle>
        <strong>{group.name}</strong>
        <span>({group.entities.length})</span>
      </GroupTitle>
      <HoneyRows>
        {group.entities.map((entity, index) => (
          <Cell key={entity.id} $offset={Math.floor(index / 12) % 2 === 1}>
            <HexEntityNode
              entity={entity}
              overlayMode={overlayMode}
              selected={selectedId === entity.id}
              onHover={onHover}
              onLeave={onLeave}
              onSelect={onSelect}
            />
          </Cell>
        ))}
      </HoneyRows>
    </Group>
  );
}

const Group = styled.section`
  min-width: 44rem;
  padding: 0.9rem;
  border: 1px solid rgba(32, 57, 67, 0.78);
  border-radius: 8px;
  background: rgba(7, 16, 20, 0.34);
`;

const GroupTitle = styled.div`
  display: flex;
  align-items: baseline;
  gap: 0.35rem;
  margin-bottom: 0.8rem;

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

const HoneyRows = styled.div`
  display: grid;
  grid-template-columns: repeat(12, 3rem);
  grid-auto-rows: 2.18rem;
  gap: 0.28rem 0.34rem;
  align-items: center;
`;

const Cell = styled.div<{ $offset: boolean }>`
  transform: translateX(${({ $offset }) => ($offset ? "1.64rem" : "0")});
`;
