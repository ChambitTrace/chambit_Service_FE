import styled from "styled-components";

export const Card = styled.section`
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: 8px;
  background: linear-gradient(180deg, rgba(18, 36, 44, 0.96), rgba(13, 26, 32, 0.96));
  box-shadow: ${({ theme }) => theme.shadow};
`;

export const CardHeader = styled.div`
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 1rem;
  padding: 1.25rem 1.25rem 0;
`;

export const CardTitle = styled.h2`
  margin: 0;
  color: ${({ theme }) => theme.colors.text};
  font-size: 1rem;
  line-height: 1.35;
`;

export const CardSubtitle = styled.p`
  margin: 0.35rem 0 0;
  color: ${({ theme }) => theme.colors.muted};
  font-size: 0.82rem;
`;

export const CardBody = styled.div`
  padding: 1.25rem;
`;
