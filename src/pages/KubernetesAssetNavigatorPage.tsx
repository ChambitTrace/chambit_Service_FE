import { useMemo, useState } from "react";
import styled from "styled-components";
import { EntityDetailDrawer } from "../components/navigator/EntityDetailDrawer";
import { HoneycombCanvas } from "../components/navigator/HoneycombCanvas";
import { NavigatorHeader } from "../components/navigator/NavigatorHeader";
import { NavigatorToolbar } from "../components/navigator/NavigatorToolbar";
import { kubernetesEntityService } from "../data/kubernetesEntityService";
import type { EntityFilter, EntityType, KubernetesEntity, OverlayMode } from "../types/kubernetes";
import { filterEntities } from "../utils/entityFilters";
import { groupEntities } from "../utils/entityGrouping";
import { filterDefinitions, groupByOptions, sortByOptions } from "../utils/entityOptions";
import { sortEntities } from "../utils/entitySorting";

const initialFilters: EntityFilter[] = filterDefinitions.map((filter) => ({ ...filter, value: "All" }));

export function KubernetesAssetNavigatorPage() {
  const [entityType, setEntityType] = useState<EntityType>("pod");
  const [groupBy, setGroupBy] = useState("Namespace");
  const [sortBy, setSortBy] = useState("Runtime Drift Count");
  const [overlayMode, setOverlayMode] = useState<OverlayMode>("Health");
  const [filters, setFilters] = useState<EntityFilter[]>(initialFilters);
  const [search, setSearch] = useState("");
  const [selectedEntity, setSelectedEntity] = useState<KubernetesEntity | undefined>();

  const entities = kubernetesEntityService.getEntities();

  const visibleEntities = useMemo(
    () => filterEntities(entities, entityType, filters, search),
    [entities, entityType, filters, search],
  );

  const groups = useMemo(() => {
    const grouped = groupEntities(visibleEntities, groupBy);
    return grouped.map((group) => ({ ...group, entities: sortEntities(group.entities, sortBy) }));
  }, [groupBy, sortBy, visibleEntities]);

  const handleEntityTypeChange = (nextType: EntityType) => {
    setEntityType(nextType);
    setGroupBy(groupByOptions[nextType][0] ?? "Namespace");
    setSortBy(sortByOptions[nextType][0] ?? "Runtime Drift Count");
    setSelectedEntity(undefined);
  };

  const handleFilterChange = (key: string, value: string) => {
    setFilters((current) => current.map((filter) => (filter.key === key ? { ...filter, value } : filter)));
  };

  return (
    <NavigatorShell>
      <LocalSidebar>
        <strong>Kubernetes Asset Navigator</strong>
        {[
          "Summary",
          "Overview Dashboard",
          "Kubernetes Events",
          "Runtime SBOM",
          "Drift Detection",
          "CVE Mapping",
          "Policy Violations",
          "Alerts",
          "Logs",
          "Metrics Explorer",
        ].map((item) => (
          <a key={item} href={`#${item.toLowerCase().replaceAll(" ", "-")}`}>
            {item}
          </a>
        ))}
      </LocalSidebar>
      <NavigatorMain>
        <NavigatorHeader />
        <NavigatorToolbar
          entityType={entityType}
          groupBy={groupBy}
          sortBy={sortBy}
          overlayMode={overlayMode}
          filters={filters}
          entities={entities}
          search={search}
          onEntityTypeChange={handleEntityTypeChange}
          onGroupByChange={setGroupBy}
          onSortByChange={setSortBy}
          onOverlayModeChange={setOverlayMode}
          onFilterChange={handleFilterChange}
          onSearchChange={setSearch}
        />
        <CanvasMeta>
          <span>{visibleEntities.length.toLocaleString()} entities</span>
          <span>{groups.length} groups</span>
          <span>Overlay: {overlayMode}</span>
        </CanvasMeta>
        <HoneycombCanvas groups={groups} overlayMode={overlayMode} selected={selectedEntity} onSelect={setSelectedEntity} />
      </NavigatorMain>
      <EntityDetailDrawer entity={selectedEntity} onClose={() => setSelectedEntity(undefined)} />
    </NavigatorShell>
  );
}

const NavigatorShell = styled.div`
  display: grid;
  grid-template-columns: 14.5rem minmax(0, 1fr);
  min-height: calc(100vh - 5rem);
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: 8px;
  overflow: hidden;
  background: #081116;

  @media (max-width: 980px) {
    grid-template-columns: 1fr;
  }
`;

const LocalSidebar = styled.nav`
  display: grid;
  align-content: start;
  gap: 0.15rem;
  padding: 1rem;
  border-right: 1px solid ${({ theme }) => theme.colors.border};
  background: rgba(6, 13, 17, 0.92);

  strong {
    margin-bottom: 0.7rem;
    color: ${({ theme }) => theme.colors.text};
    font-size: 0.86rem;
  }

  a {
    padding: 0.62rem 0.65rem;
    border-radius: 6px;
    color: ${({ theme }) => theme.colors.muted};
    font-size: 0.82rem;
    font-weight: 800;

    &:hover,
    &:first-of-type {
      color: ${({ theme }) => theme.colors.text};
      background: rgba(18, 36, 44, 0.88);
    }
  }
`;

const NavigatorMain = styled.div`
  min-width: 0;
`;

const CanvasMeta = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.45rem;
  padding: 0.75rem 1rem;
  border-bottom: 1px solid ${({ theme }) => theme.colors.border};
  background: rgba(8, 17, 22, 0.96);

  span {
    padding: 0.25rem 0.55rem;
    border: 1px solid rgba(148, 174, 182, 0.25);
    border-radius: 999px;
    color: ${({ theme }) => theme.colors.muted};
    font-size: 0.75rem;
    font-weight: 800;
  }
`;
