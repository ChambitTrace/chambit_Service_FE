import styled from "styled-components";

interface SwitchProps {
  checked: boolean;
  onChange: () => void;
}

export function Switch({ checked, onChange }: SwitchProps) {
  return (
    <Button type="button" role="switch" aria-checked={checked} $checked={checked} onClick={onChange}>
      <Thumb $checked={checked} />
    </Button>
  );
}

const Button = styled.button<{ $checked: boolean }>`
  width: 3.1rem;
  height: 1.65rem;
  padding: 0.18rem;
  border: 1px solid ${({ $checked, theme }) => ($checked ? "rgba(34, 197, 94, 0.48)" : theme.colors.border)};
  border-radius: 999px;
  background: ${({ $checked }) => ($checked ? "rgba(34, 197, 94, 0.2)" : "rgba(148, 174, 182, 0.12)")};
`;

const Thumb = styled.span<{ $checked: boolean }>`
  display: block;
  width: 1.15rem;
  height: 1.15rem;
  border-radius: 999px;
  background: ${({ $checked, theme }) => ($checked ? theme.colors.success : theme.colors.faint)};
  transform: translateX(${({ $checked }) => ($checked ? "1.35rem" : "0")});
  transition: transform 160ms ease, background 160ms ease;
`;
