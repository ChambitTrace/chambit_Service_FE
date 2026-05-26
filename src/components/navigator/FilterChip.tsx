import { ChevronDown, X } from "lucide-react";
import styled from "styled-components";
import type { EntityFilter } from "../../types/kubernetes";

interface FilterChipProps {
  filter: EntityFilter;
  values: string[];
  onChange: (value: string) => void;
}

export function FilterChip({ filter, values, onChange }: FilterChipProps) {
  return (
    <Chip>
      <span>{filter.label} =</span>
      <Select value={filter.value} onChange={(event) => onChange(event.target.value)}>
        <option value="All">All</option>
        {values.map((value) => (
          <option key={value} value={value}>
            {value}
          </option>
        ))}
      </Select>
      <ChevronDown size={13} />
      {filter.value !== "All" && <X size={13} />}
    </Chip>
  );
}

const Chip = styled.label`
  display: inline-flex;
  align-items: center;
  gap: 0.32rem;
  height: 2.1rem;
  padding: 0 0.5rem;
  border: 1px solid rgba(59, 130, 246, 0.32);
  border-radius: 6px;
  color: #b9d7ff;
  background: rgba(20, 93, 160, 0.82);
  font-size: 0.75rem;
  font-weight: 800;
  white-space: nowrap;
  min-width: 0;
`;

const Select = styled.select`
  min-width: 0;
  max-width: 9rem;
  border: 0;
  outline: 0;
  appearance: none;
  color: #e8f2ff;
  background: transparent;
  font-weight: 900;
`;
