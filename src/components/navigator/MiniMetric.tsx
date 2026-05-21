import styled from "styled-components";

interface MiniMetricProps {
  label: string;
  value: string | number;
}

export function MiniMetric({ label, value }: MiniMetricProps) {
  return (
    <Metric>
      <span>{label}</span>
      <strong>{value}</strong>
    </Metric>
  );
}

const Metric = styled.div`
  display: grid;
  gap: 0.25rem;
  padding: 0.7rem;
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: 8px;
  background: rgba(7, 16, 20, 0.42);

  span {
    color: ${({ theme }) => theme.colors.muted};
    font-size: 0.72rem;
  }

  strong {
    color: ${({ theme }) => theme.colors.text};
    font-size: 0.92rem;
  }
`;
