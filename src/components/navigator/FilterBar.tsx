import { Plus } from "lucide-react";
import styled from "styled-components";
import type { EntityFilter, KubernetesEntity } from "../../types/kubernetes";
import { FilterChip } from "./FilterChip";

interface FilterBarProps {
  filters: EntityFilter[];
  entities: KubernetesEntity[];
  layout?: "horizontal" | "vertical";
  onChange: (key: string, value: string) => void;
}

export function FilterBar({ filters, entities, layout = "horizontal", onChange }: FilterBarProps) {
  const valuesByKey = (key: string) =>
    Array.from(new Set(entities.map((entity) => entity.groupKeys[key] ?? entity.namespace).filter(Boolean) as string[]))
      .sort()
      .slice(0, 80);

  return (
    <Bar $layout={layout}>
      {filters.map((filter) => (
        <FilterChip
          key={filter.key}
          filter={filter}
          values={valuesByKey(filter.key)}
          onChange={(value) => onChange(filter.key, value)}
        />
      ))}
      <AddButton type="button" aria-label="add filter">
        <Plus size={16} />
      </AddButton>
    </Bar>
  );
}

const Bar = styled.div<{ $layout: "horizontal" | "vertical" }>`
  display: flex;
  align-items: center;
  gap: 0.45rem;
  overflow-x: ${({ $layout }) => ($layout === "horizontal" ? "auto" : "visible")};
  padding-bottom: 0.1rem;
  flex-direction: ${({ $layout }) => ($layout === "horizontal" ? "row" : "column")};
  align-items: ${({ $layout }) => ($layout === "horizontal" ? "center" : "stretch")};
  flex-wrap: ${({ $layout }) => ($layout === "horizontal" ? "wrap" : "nowrap")};
  min-width: 0;
`;

const AddButton = styled.button`
  display: inline-grid;
  place-items: center;
  flex: 0 0 auto;
  width: 2.1rem;
  height: 2.1rem;
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: 6px;
  color: ${({ theme }) => theme.colors.text};
  background: rgba(71, 85, 105, 0.8);
`;
