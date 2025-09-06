import { ResourceCollectionRestoreService } from "@core/services/ResourceCollectionRestoreService";
import { ResourceType } from "@core/types/types";
import type { StoryblokResource } from "@core/types/types";
import type { Context } from "@core/types/context";
import { AccessTokenRestoreService } from "./AccessTokenRestoreService";

export default class AccessTokenResourceCollectionRestoreService extends ResourceCollectionRestoreService<StoryblokResource> {
  static RESOURCE_TYPE: ResourceType = ResourceType.ACCESS_TOKEN;

  constructor(context: Context) {
    super(ResourceType.ACCESS_TOKEN, new AccessTokenRestoreService(context));
  }
}
