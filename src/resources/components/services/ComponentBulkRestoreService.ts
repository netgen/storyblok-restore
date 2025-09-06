import { FieldReplacerPreprocessor } from "@shared/processors/FieldReplacerPreprocessor";
import { ResourceCollectionRestoreService } from "@core/services/ResourceCollectionRestoreService";
import { TopologicalSortStrategy } from "@shared/sorting/TopologicalSort";
import { ResourceType } from "@core/types/types";
import type { StoryblokResource } from "@core/types/types";
import { ComponentRestoreService } from "./ComponentRestoreService";
import type { Context } from "@core/types/context";

export default class ComponentResourceCollectionRestoreService extends ResourceCollectionRestoreService<StoryblokResource> {
  static RESOURCE_TYPE: ResourceType = ResourceType.COMPONENTS;

  constructor(context: Context) {
    super(
      ResourceType.COMPONENTS,
      new ComponentRestoreService(context),
      new TopologicalSortStrategy(),
      [
        new FieldReplacerPreprocessor({
          resourceField: "component_group_uuid",
          contextStore: "component-groups",
          contextStoreItem: "oldUuidToNewUuidMap",
        }),
      ]
    );
  }
}
