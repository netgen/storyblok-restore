import type { BulkRestoreContext } from "../../shared/types";
import type { ResourcePreprocessor } from "../../single/processors/ResourcePreproceossor";
import type { StoryblokResource } from "../../single/StoryblokResource";

export class DatasourceEntryDatasourceIdPreprocessor
  implements ResourcePreprocessor<StoryblokResource>
{
  preprocess(
    resource: StoryblokResource,
    _context: BulkRestoreContext,
    allContexts?: Map<string, BulkRestoreContext>
  ): StoryblokResource {
    const datasourceContext = allContexts?.get("datasources");

    if (
      "datasource_id" in resource &&
      typeof resource.datasource_id === "number" &&
      datasourceContext
    ) {
      const newId = datasourceContext.oldIdToNewIdMap.get(
        resource.datasource_id
      );

      if (newId) {
        return {
          ...resource,
          datasource_id: newId,
        } as StoryblokResource;
      }
    }
    return resource;
  }
}
