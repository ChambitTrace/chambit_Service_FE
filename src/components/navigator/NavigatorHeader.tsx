import { Bot, HelpCircle, Link2, Share2, Star, Tags, Workflow } from "lucide-react";
import styled from "styled-components";

export function NavigatorHeader() {
  return (
    <Header>
      <Left>
        <Breadcrumb>Kubernetes / Clusters</Breadcrumb>
        <TitleRow>
          <h2>otel-community-demo</h2>
          <IconButton aria-label="favorite">
            <Star size={17} />
          </IconButton>
        </TitleRow>
        <Actions>
          <ActionButton><Tags size={15} /> Tags</ActionButton>
          <ActionButton>Metadata</ActionButton>
          <ActionButton><Workflow size={15} /> Workloads</ActionButton>
        </Actions>
      </Left>
      <Right>
        <HeaderTool><HelpCircle size={15} /> Help</HeaderTool>
        <HeaderTool><Bot size={15} /> Ask AI</HeaderTool>
        <HeaderTool><Share2 size={15} /> Share</HeaderTool>
        <HeaderTool><Link2 size={15} /> Link</HeaderTool>
        <TimeRange>Since 30 minutes ago (UTC)</TimeRange>
      </Right>
    </Header>
  );
}

const Header = styled.section`
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 1rem;
  padding: 1rem 1.1rem;
  border-bottom: 1px solid ${({ theme }) => theme.colors.border};
  background: rgba(10, 19, 24, 0.94);

  @media (max-width: 1100px) {
    flex-direction: column;
  }
`;

const Left = styled.div`
  display: grid;
  gap: 0.65rem;
  min-width: 0;
`;

const Breadcrumb = styled.div`
  color: ${({ theme }) => theme.colors.muted};
  font-size: 0.78rem;
  font-weight: 700;
`;

const TitleRow = styled.div`
  display: flex;
  align-items: center;
  gap: 0.55rem;

  h2 {
    margin: 0;
    font-size: 1.35rem;
    letter-spacing: 0;
  }
`;

const Actions = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.45rem;
`;

const ActionButton = styled.button`
  display: inline-flex;
  align-items: center;
  gap: 0.35rem;
  min-height: 2rem;
  padding: 0 0.65rem;
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: 6px;
  color: ${({ theme }) => theme.colors.text};
  background: rgba(18, 36, 44, 0.82);
  font-weight: 800;
  font-size: 0.78rem;
`;

const IconButton = styled(ActionButton)`
  width: 2rem;
  padding: 0;
  justify-content: center;
  color: ${({ theme }) => theme.colors.warning};
`;

const Right = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-end;
  flex-wrap: wrap;
  gap: 0.45rem;
`;

const HeaderTool = styled(ActionButton)`
  color: ${({ theme }) => theme.colors.muted};
`;

const TimeRange = styled.div`
  display: inline-flex;
  align-items: center;
  min-height: 2rem;
  padding: 0 0.75rem;
  border: 1px solid rgba(34, 211, 238, 0.28);
  border-radius: 6px;
  color: ${({ theme }) => theme.colors.accent};
  background: rgba(34, 211, 238, 0.08);
  font-size: 0.78rem;
  font-weight: 800;
`;
