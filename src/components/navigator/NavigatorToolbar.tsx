import { Search } from "lucide-react";
import styled from "styled-components";
import type { EntityFilter, EntityType, KubernetesEntity, OverlayMode } from "../../types/kubernetes";
import { EntityTypeSelector } from "./EntityTypeSelector";
import { FilterBar } from "./FilterBar";
import { GroupBySelector } from "./GroupBySelector";
import { OverlayModeSelector } from "./OverlayModeSelector";
import { SortSelector } from "./SortSelector";

interface NavigatorToolbarProps {
  entityType: EntityType;
  groupBy: string;
  sortBy: string;
  overlayMode: OverlayMode;
  filters: EntityFilter[];
  entities: KubernetesEntity[];
  search: string;
  onEntityTypeChange: (value: EntityType) => void;
  onGroupByChange: (value: string) => void;
  onSortByChange: (value: string) => void;
  onOverlayModeChange: (value: OverlayMode) => void;
  onFilterChange: (key: string, value: string) => void;
  onSearchChange: (value: string) => void;
}

export function NavigatorToolbar(props: NavigatorToolbarProps) {
  return (
    <Toolbar>
      <Controls>
        <EntityTypeSelector value={props.entityType} onChange={props.onEntityTypeChange} />
        <SortSelector entityType={props.entityType} value={props.sortBy} onChange={props.onSortByChange} />
        <GroupBySelector entityType={props.entityType} value={props.groupBy} onChange={props.onGroupByChange} />
        <OverlayModeSelector value={props.overlayMode} onChange={props.onOverlayModeChange} />
        <SearchBox>
          <Search size={16} />
          <input value={props.search} placeholder="Search entity, node, namespace" onChange={(event) => props.onSearchChange(event.target.value)} />
        </SearchBox>
      </Controls>
      <FilterBar filters={props.filters} entities={props.entities} onChange={props.onFilterChange} />
    </Toolbar>
  );
}

const Toolbar = styled.section`
  display: grid;
  gap: 0.85rem;
  padding: 0.9rem 1rem;
  border-bottom: 1px solid ${({ theme }) => theme.colors.border};
  background: rgba(11, 23, 29, 0.96);
`;

const Controls = styled.div`
  display: grid;
  grid-template-columns: repeat(4, minmax(10rem, 1fr)) minmax(16rem, 1.2fr);
  gap: 0.75rem;
  align-items: end;

  @media (max-width: 1220px) {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }

  @media (max-width: 680px) {
    grid-template-columns: 1fr;
  }
`;

const SearchBox = styled.label`
  display: flex;
  align-items: center;
  gap: 0.55rem;
  height: 2.35rem;
  align-self: end;
  padding: 0 0.7rem;
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: 6px;
  color: ${({ theme }) => theme.colors.muted};
  background: #0b171d;

  input {
    width: 100%;
    min-width: 0;
    border: 0;
    outline: 0;
    color: ${({ theme }) => theme.colors.text};
    background: transparent;
  }
`;
