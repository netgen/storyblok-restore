import type { BulkRestoreContext } from "../../shared/types";
import type { ResourcePreprocessor } from "../../single/processors/ResourcePreproceossor";
import type { StoryblokResource } from "../../single/StoryblokResource";

export class StoryAssetFixerPreprocessor
  implements ResourcePreprocessor<StoryblokResource>
{
  preprocess(
    resource: StoryblokResource,
    _context: BulkRestoreContext,
    allContexts?: Map<string, BulkRestoreContext>
  ): StoryblokResource {
    const assetsContext = allContexts?.get("assets");

    console.log("assetsContext", assetsContext, resource);

    // if (
    //   "datasource_id" in resource &&
    //   typeof resource.datasource_id === "number" &&
    //   assetsContext
    // ) {
    //   const newId = assetsContext.oldIdToNewIdMap.get(resource.datasource_id);

    //   if (newId) {
    //     return {
    //       ...resource,
    //       datasource_id: newId,
    //     } as StoryblokResource;
    //   }
    // }
    return resource;
  }
}
