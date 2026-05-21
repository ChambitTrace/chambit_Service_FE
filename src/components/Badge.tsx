import styled, { css } from "styled-components";
import type { DriftType, HealthStatus, RiskLevel, Severity } from "../types/security";

type BadgeValue = HealthStatus | Severity | RiskLevel | DriftType | string;

interface BadgeProps {
  value: BadgeValue;
}

const colorFor = (value: BadgeValue) => {
  switch (value) {
    case "Healthy":
    case "Low":
    case "Patched":
    case "Resolved":
      return "success";
    case "Warning":
    case "Medium":
    case "Modified":
    case "Investigating":
    case "Accepted Risk":
      return "warning";
    case "Critical":
    case "High":
    case "Added":
    case "Open":
    case "Block":
      return "danger";
    case "Removed":
      return "low";
    default:
      return "neutral";
  }
};

export function Badge({ value }: BadgeProps) {
  return <Pill $tone={colorFor(value)}>{value}</Pill>;
}

const Pill = styled.span<{ $tone: string }>`
  display: inline-flex;
  align-items: center;
  width: fit-content;
  min-height: 1.75rem;
  padding: 0.24rem 0.62rem;
  border-radius: 999px;
  border: 1px solid ${({ theme }) => theme.colors.border};
  color: ${({ theme }) => theme.colors.muted};
  background: rgba(148, 174, 182, 0.08);
  font-size: 0.76rem;
  font-weight: 700;
  white-space: nowrap;

  ${({ $tone, theme }) =>
    $tone === "success" &&
    css`
      color: ${theme.colors.success};
      border-color: rgba(34, 197, 94, 0.36);
      background: rgba(34, 197, 94, 0.1);
    `}

  ${({ $tone, theme }) =>
    $tone === "warning" &&
    css`
      color: ${theme.colors.warning};
      border-color: rgba(245, 158, 11, 0.38);
      background: rgba(245, 158, 11, 0.11);
    `}

  ${({ $tone, theme }) =>
    $tone === "danger" &&
    css`
      color: ${theme.colors.critical};
      border-color: rgba(239, 68, 68, 0.4);
      background: rgba(239, 68, 68, 0.13);
    `}

  ${({ $tone, theme }) =>
    $tone === "low" &&
    css`
      color: ${theme.colors.low};
      border-color: rgba(56, 189, 248, 0.35);
      background: rgba(56, 189, 248, 0.1);
    `}
`;
