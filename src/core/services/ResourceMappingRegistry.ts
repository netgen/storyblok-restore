import type { ResourceType } from "../types/types";

export type ResourceMappingData = {
  oldIdToNewIdMap: Map<number, number>;
  oldUuidToNewUuidMap: Map<string, string>;
};

export class ResourceMappingRegistry {
  private contexts = new Map<ResourceType, ResourceMappingData>();

  init(type: ResourceType): void {
    this.contexts.set(type, {
      oldIdToNewIdMap: new Map(),
      oldUuidToNewUuidMap: new Map(),
    });
  }

  set(type: ResourceType, resourceMappingRegistry: ResourceMappingData): void {
    this.contexts.set(type, resourceMappingRegistry);
  }

  get(type: ResourceType): ResourceMappingData {
    const resourceMappingRegistry = this.contexts.get(type);
    if (!resourceMappingRegistry) {
      this.init(type);

      return this.get(type)!;
    }
    return resourceMappingRegistry;
  }

  getAll(): Map<ResourceType, ResourceMappingData> {
    return new Map(this.contexts);
  }

  has(type: ResourceType): boolean {
    return this.contexts.has(type);
  }
}
