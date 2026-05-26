import {
  Activity,
  AlertTriangle,
  Boxes,
  FileWarning,
  Gauge,
  GitCompareArrows,
  Hexagon,
  Network,
  PanelLeftClose,
  PanelLeftOpen,
  ShieldCheck,
} from "lucide-react";
import { useState } from "react";
import type { ReactNode } from "react";
import { NavLink } from "react-router-dom";
import styled from "styled-components";

const navItems = [
  { label: "Overview", to: "/", icon: Gauge },
  { label: "Cluster Status", to: "/clusters", icon: Network },
  { label: "K8s Asset Navigator", to: "/kubernetes-assets", icon: Hexagon },
  { label: "Runtime SBOM", to: "/runtime-sbom", icon: Boxes },
  { label: "Drift Detection", to: "/drift", icon: GitCompareArrows },
  { label: "CVE Mapping", to: "/cves", icon: FileWarning },
  { label: "Policy Engine", to: "/policies", icon: ShieldCheck },
  { label: "Alerts", to: "/alerts", icon: AlertTriangle },
];

interface AppLayoutProps {
  children: ReactNode;
}

export function AppLayout({ children }: AppLayoutProps) {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  return (
    <Shell $sidebarCollapsed={sidebarCollapsed}>
      <Sidebar $collapsed={sidebarCollapsed}>
        <SidebarToggle
          type="button"
          aria-label={sidebarCollapsed ? "Expand sidebar" : "Collapse sidebar"}
          onClick={() => setSidebarCollapsed((current) => !current)}
        >
          {sidebarCollapsed ? <PanelLeftOpen size={17} /> : <PanelLeftClose size={17} />}
        </SidebarToggle>
        <Brand>
          <BrandMark>
            <ShieldCheck size={24} />
          </BrandMark>
          <BrandText $collapsed={sidebarCollapsed}>
            <strong>Chambit</strong>
            <span>Runtime SBOM Security</span>
          </BrandText>
        </Brand>
        <Nav aria-label="Primary navigation">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavItem key={item.to} to={item.to}>
                <Icon size={18} />
                <NavLabel $collapsed={sidebarCollapsed}>{item.label}</NavLabel>
              </NavItem>
            );
          })}
        </Nav>
      </Sidebar>
      <Main>
        <Header>
          <HeaderCopy>
            <Kicker>Kubernetes Runtime Threat Console</Kicker>
            <h1>Runtime SBOM Control Plane</h1>
          </HeaderCopy>
          <HeaderStatus>
            <Activity size={18} />
            Live mock telemetry
          </HeaderStatus>
        </Header>
        <Content>{children}</Content>
      </Main>
    </Shell>
  );
}

const Shell = styled.div<{ $sidebarCollapsed: boolean }>`
  display: grid;
  grid-template-columns: ${({ $sidebarCollapsed }) => ($sidebarCollapsed ? "4.75rem" : "17rem")} minmax(0, 1fr);
  min-height: 100vh;
  transition: grid-template-columns 160ms ease;

  @media (max-width: 900px) {
    grid-template-columns: 1fr;
  }
`;

const Sidebar = styled.aside<{ $collapsed: boolean }>`
  position: sticky;
  top: 0;
  height: 100vh;
  padding: ${({ $collapsed }) => ($collapsed ? "1rem 0.75rem" : "1.25rem")};
  border-right: 1px solid ${({ theme }) => theme.colors.border};
  background: rgba(7, 16, 20, 0.88);
  backdrop-filter: blur(18px);
  overflow: hidden;

  @media (max-width: 900px) {
    position: static;
    height: auto;
    border-right: 0;
    border-bottom: 1px solid ${({ theme }) => theme.colors.border};
  }
`;

const SidebarToggle = styled.button`
  display: grid;
  place-items: center;
  width: 2.25rem;
  height: 2.25rem;
  margin: 0 0 1rem auto;
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: 6px;
  color: ${({ theme }) => theme.colors.muted};
  background: rgba(18, 36, 44, 0.82);

  &:hover {
    color: ${({ theme }) => theme.colors.text};
  }
`;

const Brand = styled.div`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  min-width: 0;
`;

const BrandMark = styled.div`
  display: grid;
  place-items: center;
  width: 2.75rem;
  height: 2.75rem;
  border: 1px solid rgba(34, 211, 238, 0.38);
  border-radius: 8px;
  color: ${({ theme }) => theme.colors.accent};
  background: rgba(34, 211, 238, 0.1);
`;

const BrandText = styled.div<{ $collapsed: boolean }>`
  display: grid;
  min-width: 0;
  opacity: ${({ $collapsed }) => ($collapsed ? 0 : 1)};
  pointer-events: ${({ $collapsed }) => ($collapsed ? "none" : "auto")};
  transition: opacity 120ms ease;

  strong {
    font-size: 1.12rem;
  }

  span {
    color: ${({ theme }) => theme.colors.muted};
    font-size: 0.73rem;
  }
`;

const Nav = styled.nav`
  display: grid;
  gap: 0.35rem;
  margin-top: 2rem;

  @media (max-width: 900px) {
    grid-template-columns: repeat(2, minmax(0, 1fr));
    margin-top: 1rem;
  }

  @media (max-width: 560px) {
    grid-template-columns: 1fr;
  }
`;

const NavItem = styled(NavLink)`
  display: flex;
  align-items: center;
  gap: 0.7rem;
  min-height: 2.7rem;
  padding: 0 0.8rem;
  border: 1px solid transparent;
  border-radius: 8px;
  color: ${({ theme }) => theme.colors.muted};
  font-size: 0.9rem;
  font-weight: 700;

  &.active,
  &:hover {
    color: ${({ theme }) => theme.colors.text};
    border-color: ${({ theme }) => theme.colors.border};
    background: rgba(18, 36, 44, 0.95);
  }
`;

const NavLabel = styled.span<{ $collapsed: boolean }>`
  display: ${({ $collapsed }) => ($collapsed ? "none" : "inline")};
`;

const Main = styled.main`
  min-width: 0;
`;

const Header = styled.header`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
  padding: 1.25rem 1.5rem;
  border-bottom: 1px solid ${({ theme }) => theme.colors.border};
  background: rgba(7, 16, 20, 0.58);

  @media (max-width: 720px) {
    align-items: flex-start;
    flex-direction: column;
  }
`;

const HeaderCopy = styled.div`
  min-width: 0;

  h1 {
    margin: 0.2rem 0 0;
    font-size: clamp(1.35rem, 2.4vw, 2.1rem);
    line-height: 1.15;
    letter-spacing: 0;
  }
`;

const Kicker = styled.p`
  margin: 0;
  color: ${({ theme }) => theme.colors.accent};
  font-size: 0.74rem;
  font-weight: 800;
  text-transform: uppercase;
`;

const HeaderStatus = styled.div`
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  min-height: 2.4rem;
  padding: 0 0.8rem;
  border: 1px solid rgba(34, 197, 94, 0.35);
  border-radius: 8px;
  color: ${({ theme }) => theme.colors.success};
  background: rgba(34, 197, 94, 0.1);
  font-size: 0.84rem;
  font-weight: 800;
`;

const Content = styled.div`
  padding: 1.5rem;

  @media (max-width: 720px) {
    padding: 1rem;
  }
`;
