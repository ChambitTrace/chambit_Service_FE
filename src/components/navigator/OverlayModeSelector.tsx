import type { OverlayMode } from "../../types/kubernetes";
import { overlayModes } from "../../utils/entityOptions";
import { Field, Select } from "./EntityTypeSelector";

interface OverlayModeSelectorProps {
  value: OverlayMode;
  onChange: (value: OverlayMode) => void;
}

export function OverlayModeSelector({ value, onChange }: OverlayModeSelectorProps) {
  return (
    <Field>
      <span>Overlay</span>
      <Select value={value} onChange={(event) => onChange(event.target.value as OverlayMode)}>
        {overlayModes.map((option) => (
          <option key={option} value={option}>{option}</option>
        ))}
      </Select>
    </Field>
  );
}
