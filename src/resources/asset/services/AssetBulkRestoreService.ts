import { FieldReplacerPreprocessor } from "@shared/processors/FieldReplacerPreprocessor";
import { ResourceCollectionRestoreService } from "@core/services/ResourceCollectionRestoreService";
import { ResourceType } from "@core/types/types";
import type { StoryblokResource } from "@core/types/types";
import type { Context } from "@core/types/context";
import { AssetRestoreService } from "./AssetRestoreService";

export default class AssetResourceCollectionRestoreService extends ResourceCollectionRestoreService<StoryblokResource> {
  static RESOURCE_TYPE: ResourceType = ResourceType.ASSETS;

  constructor(context: Context) {
    super(ResourceType.ASSETS, new AssetRestoreService(context), undefined, [
      new FieldReplacerPreprocessor({
        resourceField: "asset_folder_id",
        contextStore: "asset-folders",
        contextStoreItem: "oldIdToNewIdMap",
      }),
    ]);
  }
}
