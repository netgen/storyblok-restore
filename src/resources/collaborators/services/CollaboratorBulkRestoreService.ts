import { ResourceCollectionRestoreService } from "@core/services/ResourceCollectionRestoreService";
import { ResourceType } from "@core/types/types";
import type { StoryblokResource } from "@core/types/types";
import type { Context } from "@core/types/context";
import { CollaboratorRestoreService } from "./CollaboratorRestoreService";

export default class CollaboratorBulkRestoreService extends ResourceCollectionRestoreService<StoryblokResource> {
  static RESOURCE_TYPE: ResourceType = ResourceType.COLLABORATORS;

  constructor(context: Context) {
    super(ResourceType.COLLABORATORS, new CollaboratorRestoreService(context));
  }
}
