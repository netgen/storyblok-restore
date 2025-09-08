import { ResourceCollectionRestoreService } from "@core/services/ResourceCollectionRestoreService";
import type { Context } from "@core/types/context";
import type { StoryblokResource } from "@core/types/types";
import { ResourceType } from "@core/types/types";
import { FieldReplacerPreprocessor } from "@shared/processors/FieldReplacerPreprocessor";
import { DatasourceEntryRestoreService } from "./DatasourceEntryRestoreService";

export default class DatasourceEntryResourceCollectionRestoreService extends ResourceCollectionRestoreService<StoryblokResource> {
  static RESOURCE_TYPE: ResourceType = ResourceType.DATASOURCE_ENTRIES;

  constructor(context: Context) {
    super(
      ResourceType.DATASOURCE_ENTRIES,
      new DatasourceEntryRestoreService(context),
      undefined,
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
