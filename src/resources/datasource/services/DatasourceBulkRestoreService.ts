import { ResourceCollectionRestoreService } from "@core/services/ResourceCollectionRestoreService";
import { ResourceType } from "@core/types/types";
import type { StoryblokResource } from "@core/types/types";
import type { Context } from "@core/types/context";
import { DatasourceRestoreService } from "./DatasourceRestoreService";

export default class DatasourceBulkRestoreService extends ResourceCollectionRestoreService<StoryblokResource> {
  static RESOURCE_TYPE: ResourceType = ResourceType.DATASOURCES;

  constructor(context: Context) {
    super(ResourceType.DATASOURCES, new DatasourceRestoreService(context));
  }
}
