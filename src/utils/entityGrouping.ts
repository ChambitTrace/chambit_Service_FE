import type { EntityGroupModel, KubernetesEntity } from "../types/kubernetes";

export const groupEntities = (entities: KubernetesEntity[], groupBy: string): EntityGroupModel[] => {
  const key = normalizeGroupKey(groupBy);
  const groups = new Map<string, KubernetesEntity[]>();

  for (const entity of entities) {
    const name = key === "all" ? "All Nodes" : entity.groupKeys[key] ?? entity.namespace ?? "Unknown";
    groups.set(name, [...(groups.get(name) ?? []), entity]);
  }

  return Array.from(groups.entries())
    .map(([name, groupEntities]) => ({ name, entities: groupEntities }))
    .sort((a, b) => b.entities.length - a.entities.length || a.name.localeCompare(b.name));
};

export const normalizeGroupKey = (groupBy: string) => groupBy.toLowerCase().replace(/\s+/g, "") === "allnodes" ? "all" : groupBy.toLowerCase();
