import { ResourceType } from "../types/types";

export type ResourceMappingData = {
  oldIdToNewIdMap: Map<number, number>;
  oldUuidToNewUuidMap: Map<string, string>;
};

export type ResourceMappingObject = Partial<
  Record<
    ResourceType,
    {
      oldIdToNewIdMap: Record<number, number>;
      oldUuidToNewUuidMap: Record<string, string>;
    }
  >
>;

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

  fromObject(object: ResourceMappingObject): void {
    for (const [type, data] of Object.entries(object)) {
      this.contexts.set(type as ResourceType, {
        oldIdToNewIdMap: new Map(
          Object.entries(data.oldIdToNewIdMap).map(([key, value]) => [
            Number(key),
            value,
          ])
        ),
        oldUuidToNewUuidMap: new Map(Object.entries(data.oldUuidToNewUuidMap)),
      });
    }
  }

  toObject(): ResourceMappingObject {
    const result = {} as ResourceMappingObject;

    // Populate with actual data from contexts
    for (const [type, data] of this.contexts.entries()) {
      if (!result[type]) {
        result[type] = {
          oldIdToNewIdMap: {},
          oldUuidToNewUuidMap: {},
        };
      }

      result[type] = {
        oldIdToNewIdMap: Object.fromEntries(data.oldIdToNewIdMap),
        oldUuidToNewUuidMap: Object.fromEntries(data.oldUuidToNewUuidMap),
      };
    }

    return result;
  }
}
