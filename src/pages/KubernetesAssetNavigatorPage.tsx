import { useEffect, useMemo, useRef, useState } from "react";
import styled from "styled-components";
import { EntityDetailDrawer } from "../components/navigator/EntityDetailDrawer";
import type { HoneycombAnimationPhase } from "../components/navigator/HoneycombCanvas";
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
  const [animationPhase, setAnimationPhase] = useState<HoneycombAnimationPhase>("idle");
  const applyTimerRef = useRef<number | undefined>(undefined);
  const finishTimerRef = useRef<number | undefined>(undefined);

  const entities = kubernetesEntityService.getEntities();

  const visibleEntities = useMemo(
    () => filterEntities(entities, entityType, filters, search),
    [entities, entityType, filters, search],
  );

  const groups = useMemo(() => {
    const grouped = groupEntities(visibleEntities, groupBy);
    return grouped.map((group) => ({ ...group, entities: sortEntities(group.entities, sortBy) }));
  }, [groupBy, sortBy, visibleEntities]);

  useEffect(() => {
    return () => {
      window.clearTimeout(applyTimerRef.current);
      window.clearTimeout(finishTimerRef.current);
    };
  }, []);

  const runQueryTransition = (apply: () => void) => {
    window.clearTimeout(applyTimerRef.current);
    window.clearTimeout(finishTimerRef.current);
    setAnimationPhase("scatter");
    setSelectedEntity(undefined);

    applyTimerRef.current = window.setTimeout(() => {
      apply();
      setAnimationPhase("assemble");

      finishTimerRef.current = window.setTimeout(() => {
        setAnimationPhase("idle");
      }, 720);
    }, 170);
  };

  const handleEntityTypeChange = (nextType: EntityType) => {
    runQueryTransition(() => {
      setEntityType(nextType);
      setGroupBy(groupByOptions[nextType][0] ?? "Namespace");
      setSortBy(sortByOptions[nextType][0] ?? "Runtime Drift Count");
    });
  };

  const handleFilterChange = (key: string, value: string) => {
    runQueryTransition(() => {
      setFilters((current) => current.map((filter) => (filter.key === key ? { ...filter, value } : filter)));
    });
  };

  return (
    <NavigatorShell>
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
          onGroupByChange={(value) => runQueryTransition(() => setGroupBy(value))}
          onSortByChange={(value) => runQueryTransition(() => setSortBy(value))}
          onOverlayModeChange={(value) => runQueryTransition(() => setOverlayMode(value))}
          onFilterChange={handleFilterChange}
          onSearchChange={(value) => runQueryTransition(() => setSearch(value))}
        />
        <HoneycombCanvas
          groups={groups}
          overlayMode={overlayMode}
          animationPhase={animationPhase}
          selected={selectedEntity}
          onSelect={setSelectedEntity}
        />
      </NavigatorMain>
      <EntityDetailDrawer entity={selectedEntity} onClose={() => setSelectedEntity(undefined)} />
    </NavigatorShell>
  );
}

const NavigatorShell = styled.div`
  height: calc(100vh - 5rem);
  margin: -1.5rem;
  overflow: hidden;
  background: #081116;
`;

const NavigatorMain = styled.div`
  display: grid;
  grid-template-rows: auto auto minmax(0, 1fr);
  min-width: 0;
  min-height: 0;
  height: 100%;
  overflow: hidden;
`;
