import { FieldReplacerPreprocessor } from "@shared/processors/FieldReplacerPreprocessor";
import { TopologicalSortStrategy } from "@shared/sorting/TopologicalSort";
import { ResourceCollectionRestoreService } from "@core/services/ResourceCollectionRestoreService";
import { ResourceType, type StoryblokResource } from "@core/types/types";
import type { Context } from "@core/types/context";
import { StoryReferenceFixerResourceCollectionPostprocessor } from "../processors/StoryReferenceFixerResourceCollectionPostprocessor";
import { StoryRestoreService } from "./StoryRestoreService";

export default class StoryBulkRestoreService extends ResourceCollectionRestoreService<StoryblokResource> {
  static RESOURCE_TYPE: ResourceType = ResourceType.STORIES;

  constructor(context: Context) {
    super(
      StoryBulkRestoreService.RESOURCE_TYPE,
      new StoryRestoreService(context),
      new TopologicalSortStrategy(),
      [
        new FieldReplacerPreprocessor({
          resourceField: "parent_id",
          contextStore: "stories",
          contextStoreItem: "oldIdToNewIdMap",
        }),
      ],
      new StoryReferenceFixerResourceCollectionPostprocessor(context)
    );
  }
}
