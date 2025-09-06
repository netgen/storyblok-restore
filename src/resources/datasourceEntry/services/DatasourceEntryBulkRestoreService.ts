import { FieldReplacerPreprocessor } from "@shared/processors/FieldReplacerPreprocessor";
import { ResourceCollectionRestoreService } from "@core/services/ResourceCollectionRestoreService";
import { TopologicalSortStrategy } from "@shared/sorting/TopologicalSort";
import { ResourceType } from "@core/types/types";
import type { StoryblokResource } from "@core/types/types";
import type { Context } from "@core/types/context";
import { DatasourceEntryRestoreService } from "./DatasourceEntryRestoreService";

export default class DatasourceEntryResourceCollectionRestoreService extends ResourceCollectionRestoreService<StoryblokResource> {
  static RESOURCE_TYPE: ResourceType = ResourceType.DATASOURCE_ENTRIES;

  constructor(context: Context) {
    super(
      ResourceType.DATASOURCE_ENTRIES,
      new DatasourceEntryRestoreService(context),
      new TopologicalSortStrategy(),
      [
        new FieldReplacerPreprocessor({
          resourceField: "datasource_id",
          contextStore: "datasources",
          contextStoreItem: "oldIdToNewIdMap",
        }),
      ]
    );
  }
}
