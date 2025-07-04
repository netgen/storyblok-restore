import type { BulkRestoreContext } from "../../shared/types";
import type { ResourcePreprocessor } from "../../single/processors/ResourcePreproceossor";
import type { StoryblokResource } from "../../single/StoryblokResource";

export class ComponentGroupUuidPreprocessor
  implements ResourcePreprocessor<StoryblokResource>
{
  preprocess(
    resource: StoryblokResource,
    _context: BulkRestoreContext,
    allContexts?: Map<string, BulkRestoreContext>
  ): StoryblokResource {
    const groupContext = allContexts?.get("component-groups");

    if (
      "component_group_uuid" in resource &&
      typeof resource.component_group_uuid === "string" &&
      groupContext
    ) {
      const newUuid = groupContext.oldUuidToNewUuidMap.get(
        resource.component_group_uuid
      );

      if (newUuid) {
        return {
          ...resource,
          component_group_uuid: newUuid,
        } as StoryblokResource;
      }
    }
    return resource;
  }
}
