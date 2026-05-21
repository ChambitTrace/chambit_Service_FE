import type { EntityFilter, EntityType, KubernetesEntity } from "../types/kubernetes";

export const filterEntities = (
  entities: KubernetesEntity[],
  entityType: EntityType,
  filters: EntityFilter[],
  search: string,
) => {
  const normalizedSearch = search.trim().toLowerCase();

  return entities.filter((entity) => {
    if (entity.type !== entityType) return false;
    if (normalizedSearch && !`${entity.name} ${entity.namespace ?? ""} ${entity.relationships.node ?? ""}`.toLowerCase().includes(normalizedSearch)) {
      return false;
    }

    return filters.every((filter) => {
      if (filter.value === "All") return true;
      const value = entity.groupKeys[filter.key] ?? entity.namespace ?? "";
      return value === filter.value;
    });
  });
};
