import { ResourceCollectionRestoreService } from "@core/services/ResourceCollectionRestoreService";
import type { StoryblokResource } from "@core/types/types";
import { AssetFolderRestoreService } from "./AssetFolderRestoreService";
import { TopologicalSortStrategy } from "@shared/sorting/TopologicalSort";
import { FieldReplacerPreprocessor } from "@shared/processors/FieldReplacerPreprocessor";
import { ResourceType } from "@core/types/types";
import type { Context } from "@core/types/context";

export default class AssetFolderResourceCollectionRestoreService extends ResourceCollectionRestoreService<StoryblokResource> {
  static RESOURCE_TYPE: ResourceType = ResourceType.ASSET_FOLDERS;

  constructor(context: Context) {
    super(
      ResourceType.ASSET_FOLDERS,
      new AssetFolderRestoreService(context),
      new TopologicalSortStrategy(),
      [
        new FieldReplacerPreprocessor({
          resourceField: "parent_id",
          contextStore: "asset-folders",
          contextStoreItem: "oldIdToNewIdMap",
        }),
      ]
    );
  }
}
