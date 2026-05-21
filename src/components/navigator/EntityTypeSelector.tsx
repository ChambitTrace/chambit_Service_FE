import styled from "styled-components";
import type { EntityType } from "../../types/kubernetes";
import { entityTypeLabels, entityTypes } from "../../utils/entityOptions";

interface EntityTypeSelectorProps {
  value: EntityType;
  onChange: (value: EntityType) => void;
}

export function EntityTypeSelector({ value, onChange }: EntityTypeSelectorProps) {
  return (
    <Field>
      <span>Entity type</span>
      <Select value={value} onChange={(event) => onChange(event.target.value as EntityType)}>
        {entityTypes.map((type) => (
          <option key={type} value={type}>
            {entityTypeLabels[type]}
          </option>
        ))}
      </Select>
    </Field>
  );
}

export const Field = styled.label`
  display: grid;
  gap: 0.3rem;
  min-width: 11rem;

  span {
    color: ${({ theme }) => theme.colors.muted};
    font-size: 0.7rem;
    font-weight: 900;
    text-transform: uppercase;
  }
`;

export const Select = styled.select`
  height: 2.35rem;
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: 6px;
  color: ${({ theme }) => theme.colors.text};
  background: #0b171d;
  padding: 0 0.65rem;
  font-weight: 800;
`;
