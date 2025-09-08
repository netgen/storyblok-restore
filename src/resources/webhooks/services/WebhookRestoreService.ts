import { BaseResourceRestoreService } from "@core/services/BaseRestoreService";
import type { RestoreOptions, StoryblokResource } from "@core/types/types";
import type { ISbResponse } from "storyblok-js-client";

interface WebhookResource extends StoryblokResource {
  secret?: string;
}

/**
 * Resource restore service for Storyblok webhooks.
 * Implements URL and parameter construction for webhooks.
 */
export class WebhookRestoreService extends BaseResourceRestoreService<WebhookResource> {
  getCreateUrl(_resource: WebhookResource, options: RestoreOptions): string {
    return `spaces/${options.spaceId}/webhook_endpoints`;
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

  handleError(error: unknown): never {
    const message =
      typeof error === "object" && error !== null && "message" in error
        ? error.message
        : String(error);

    throw new Error(`Webhook restoration failed: ${message}`);
  }
}
