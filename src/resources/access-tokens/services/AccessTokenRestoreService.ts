import type { RestoreOptions } from "@core/types/types";
import { BaseResourceRestoreService } from "@core/services/BaseRestoreService";
import type { StoryblokResource } from "@core/types/types";
import type { ISbResponse } from "storyblok-js-client";

/**
 * Resource restore service for Storyblok access tokens.
 * Implements URL and parameter construction for access tokens.
 */
export class AccessTokenRestoreService extends BaseResourceRestoreService<StoryblokResource> {
  getCreateUrl(_resource: StoryblokResource, options: RestoreOptions): string {
    return `spaces/${options.spaceId}/api_keys`;
  }

  getUpdateUrl(resource: StoryblokResource, options: RestoreOptions): string {
    return `spaces/${options.spaceId}/api_keys/${resource.id}`;
  }

  getResourceIdentifier(resource: StoryblokResource): string {
    return resource.id.toString();
  }

  getResourceType(): string {
    return "access token";
  }

  getParams(resource: StoryblokResource) {
    return {
      api_key: resource,
    };
  }

  getResponseData(response: ISbResponse): StoryblokResource {
    return response.data;
  }

  handleError(error: unknown): never {
    const message =
      typeof error === "object" && error !== null && "message" in error
        ? error.message
        : String(error);

    throw new Error(`Access token restoration failed: ${message}`);
  }
}
