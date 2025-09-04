import type { ResourcePreprocessor } from "../../single/processors/ResourcePreproceossor";
import type { StoryblokResource } from "../../single/StoryblokResource";
import type { BulkRestoreContext } from "../../shared/types";

/**
 * Preprocessor that updates the parent_uuid of a resource using the current idMapping in the bulk restore context.
 * Used to ensure parent-child relationships are correctly restored with new IDs.
 */
export class ParentUuidPreprocessor
  implements ResourcePreprocessor<StoryblokResource>
{
  /**
   * Updates the parent_uuid of the resource if a new parent ID mapping exists.
   * @param resource The resource to preprocess.
   * @param context The bulk restore context containing the idMapping.
   * @returns The resource with updated parent_uuid, or unchanged if no mapping is found.
   */
  preprocess(
    resource: StoryblokResource,
    context: BulkRestoreContext
  ): StoryblokResource {
    if ("parent_uuid" in resource && resource.parent_uuid) {
      const newParentId = context.oldUuidToNewUuidMap.get(resource.parent_uuid);
      console.log("parent_uuid", resource.parent_uuid, newParentId);
      return { ...resource, parent_uuid: newParentId };
    }
    return resource;
  }
}
