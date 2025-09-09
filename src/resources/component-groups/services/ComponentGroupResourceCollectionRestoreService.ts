import { FieldReplacerPreprocessor } from "@shared/processors/FieldReplacerPreprocessor";
import { ResourceCollectionRestoreService } from "@core/services/ResourceCollectionRestoreService";
import { TopologicalSortStrategy } from "@shared/sorting/TopologicalSort";
import { ResourceType } from "@core/types/types";
import type { StoryblokResource } from "@core/types/types";
import type { Context } from "@core/types/context";
import { ComponentGroupRestoreService } from "./ComponentGroupRestoreService";

export default class ComponentGroupResourceCollectionRestoreService extends ResourceCollectionRestoreService<StoryblokResource> {
  static RESOURCE_TYPE: ResourceType = ResourceType.COMPONENT_GROUPS;

  constructor(context: Context) {
    super(
      ResourceType.COMPONENT_GROUPS,
      new ComponentGroupRestoreService(context),
      new TopologicalSortStrategy(),
      [
        new FieldReplacerPreprocessor({
          resourceField: "parent_id",
          contextStore: "component-groups",
          contextStoreItem: "oldIdToNewIdMap",
        }),
      ]
    );
  }
}
