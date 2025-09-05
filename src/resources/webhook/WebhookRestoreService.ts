import type { RestoreOptions } from "../../shared/types";
import { BaseResourceRestoreService } from "../../single/services/BaseRestoreService";
import type { StoryblokResource } from "../../single/StoryblokResource";
import type { ISbResponse } from "storyblok-js-client";

interface WebhookResource extends StoryblokResource {
  secret?: string;
}

/**
 * Resource restore service for Storyblok webhooks.
 * Implements URL and parameter construction for webhooks.
 */
export class WebhookRestoreService extends BaseResourceRestoreService<WebhookResource> {
  canHandle(type: string) {
    return type === "webhook";
  }

  getCreateUrl(_resource: WebhookResource, options: RestoreOptions): string {
    return `spaces/${options.spaceId}/webhook_endpoints`;
  }

  getUpdateUrl(resource: WebhookResource, options: RestoreOptions): string {
    return `spaces/${options.spaceId}/webhook_endpoints/${resource.id}`;
  }

  getParams(resource: WebhookResource) {
    const { secret, ...webhookWithoutSecret } = resource;

    return {
      webhook_endpoint: webhookWithoutSecret, // This is required because you cannot create a webhook with a secret with the SB API
    };
  }

  getResponseData(response: ISbResponse): StoryblokResource {
    return response.data.webhook_endpoint;
  }
}
