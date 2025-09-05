import type { BulkRestoreContext } from "../../shared/types";
import type { ResourcePreprocessor } from "../../single/processors/ResourcePreproceossor";
import type { StoryblokResource } from "../../single/StoryblokResource";

export class AssetFolderIdPreprocessor
  implements ResourcePreprocessor<StoryblokResource>
{
  preprocess(
    resource: StoryblokResource,
    _context: BulkRestoreContext,
    allContexts?: Map<string, BulkRestoreContext>
  ): StoryblokResource {
    const assetFolderContext = allContexts?.get("asset-folders");

    if (
      "asset_folder_id" in resource &&
      typeof resource.asset_folder_id === "number" &&
      assetFolderContext
    ) {
      const newId = assetFolderContext.oldIdToNewIdMap.get(
        resource.asset_folder_id
      );

      if (newId) {
        return {
          ...resource,
          asset_folder_id: newId,
        } as StoryblokResource;
      }
    }
    return resource;
  }
}
