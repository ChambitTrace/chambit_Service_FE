import { Search } from "lucide-react";
import styled from "styled-components";

interface SearchFieldProps {
  value: string;
  placeholder: string;
  onChange: (value: string) => void;
}

export function SearchField({ value, placeholder, onChange }: SearchFieldProps) {
  return (
    <Wrap>
      <Search size={18} aria-hidden />
      <Input value={value} placeholder={placeholder} onChange={(event) => onChange(event.target.value)} />
    </Wrap>
  );
}

const Wrap = styled.label`
  display: flex;
  align-items: center;
  gap: 0.65rem;
  width: min(100%, 28rem);
  padding: 0.72rem 0.85rem;
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: 8px;
  color: ${({ theme }) => theme.colors.muted};
  background: rgba(7, 16, 20, 0.72);
`;

const Input = styled.input`
  width: 100%;
  min-width: 0;
  border: 0;
  outline: 0;
  color: ${({ theme }) => theme.colors.text};
  background: transparent;

  &::placeholder {
    color: ${({ theme }) => theme.colors.faint};
  }
`;
