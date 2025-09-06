import { ResourceCollectionRestoreService } from "@core/services/ResourceCollectionRestoreService";
import { ResourceType } from "@core/types/types";
import type { StoryblokResource } from "@core/types/types";
import type { Context } from "@core/types/context";
import { WebhookRestoreService } from "./WebhookRestoreService";

export default class WebhookResourceCollectionRestoreService extends ResourceCollectionRestoreService<StoryblokResource> {
  static RESOURCE_TYPE: ResourceType = ResourceType.WEBHOOKS;

  constructor(context: Context) {
    super(ResourceType.WEBHOOKS, new WebhookRestoreService(context));
  }
}
