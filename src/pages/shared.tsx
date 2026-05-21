import styled from "styled-components";

export const PageStack = styled.div`
  display: grid;
  gap: 1rem;
`;

export const PageHeader = styled.div`
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  gap: 1rem;

  @media (max-width: 760px) {
    align-items: flex-start;
    flex-direction: column;
  }
`;

export const PageTitle = styled.div`
  min-width: 0;

  h2 {
    margin: 0;
    font-size: 1.35rem;
    letter-spacing: 0;
  }

  p {
    margin: 0.35rem 0 0;
    color: ${({ theme }) => theme.colors.muted};
    font-size: 0.9rem;
  }
`;

export const Grid = styled.div<{ $columns?: string }>`
  display: grid;
  grid-template-columns: ${({ $columns }) => $columns ?? "repeat(2, minmax(0, 1fr))"};
  gap: 1rem;

  @media (max-width: 980px) {
    grid-template-columns: 1fr;
  }
`;

export const MonoText = styled.span`
  color: ${({ theme }) => theme.colors.muted};
  font-family: "SFMono-Regular", Consolas, "Liberation Mono", monospace;
  font-size: 0.8rem;
`;
