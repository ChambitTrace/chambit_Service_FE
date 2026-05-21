import type { EntityType } from "../../types/kubernetes";
import { sortByOptions } from "../../utils/entityOptions";
import { Field, Select } from "./EntityTypeSelector";

interface SortSelectorProps {
  entityType: EntityType;
  value: string;
  onChange: (value: string) => void;
}

export function SortSelector({ entityType, value, onChange }: SortSelectorProps) {
  return (
    <Field>
      <span>Sort by</span>
      <Select value={value} onChange={(event) => onChange(event.target.value)}>
        {sortByOptions[entityType].map((option) => (
          <option key={option} value={option}>{option}</option>
        ))}
      </Select>
    </Field>
  );
}
