import type { EntityType } from "../../types/kubernetes";
import { groupByOptions } from "../../utils/entityOptions";
import { Field, Select } from "./EntityTypeSelector";

interface GroupBySelectorProps {
  entityType: EntityType;
  value: string;
  onChange: (value: string) => void;
}

export function GroupBySelector({ entityType, value, onChange }: GroupBySelectorProps) {
  return (
    <Field>
      <span>Group by</span>
      <Select value={value} onChange={(event) => onChange(event.target.value)}>
        {groupByOptions[entityType].map((option) => (
          <option key={option} value={option}>{option}</option>
        ))}
      </Select>
    </Field>
  );
}
