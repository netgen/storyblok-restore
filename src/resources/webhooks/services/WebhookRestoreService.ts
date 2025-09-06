import type { RestoreOptions } from "@core/types/types";
import { BaseResourceRestoreService } from "@core/services/BaseRestoreService";
import type { StoryblokResource } from "@core/types/types";
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
    throw new Error(
      `Webhook restoration failed: ${error instanceof Error ? error.message : String(error)}`
    );
  }
}
