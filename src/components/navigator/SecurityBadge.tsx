import styled, { css } from "styled-components";

interface SecurityBadgeProps {
  label: string;
  tone?: "good" | "warning" | "critical" | "neutral" | "info";
}

export function SecurityBadge({ label, tone = "neutral" }: SecurityBadgeProps) {
  return <Badge $tone={tone}>{label}</Badge>;
}

const Badge = styled.span<{ $tone: string }>`
  display: inline-flex;
  align-items: center;
  min-height: 1.7rem;
  padding: 0 0.58rem;
  border: 1px solid rgba(148, 174, 182, 0.28);
  border-radius: 999px;
  color: ${({ theme }) => theme.colors.muted};
  background: rgba(148, 174, 182, 0.08);
  font-size: 0.75rem;
  font-weight: 800;
  white-space: nowrap;

  ${({ $tone, theme }) =>
    $tone === "good" &&
    css`
      color: ${theme.colors.success};
      border-color: rgba(34, 197, 94, 0.35);
      background: rgba(34, 197, 94, 0.1);
    `}

  ${({ $tone, theme }) =>
    $tone === "warning" &&
    css`
      color: ${theme.colors.warning};
      border-color: rgba(245, 158, 11, 0.35);
      background: rgba(245, 158, 11, 0.1);
    `}

  ${({ $tone, theme }) =>
    $tone === "critical" &&
    css`
      color: ${theme.colors.critical};
      border-color: rgba(239, 68, 68, 0.4);
      background: rgba(239, 68, 68, 0.12);
    `}

  ${({ $tone, theme }) =>
    $tone === "info" &&
    css`
      color: ${theme.colors.accent};
      border-color: rgba(34, 211, 238, 0.34);
      background: rgba(34, 211, 238, 0.1);
    `}
`;
