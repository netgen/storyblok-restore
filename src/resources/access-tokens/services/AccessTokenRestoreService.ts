import type { RestoreOptions } from "@core/types/types";
import { BaseResourceRestoreService } from "@core/services/BaseRestoreService";
import type { StoryblokResource } from "@core/types/types";
import type { ISbResponse } from "storyblok-js-client";

/**
 * Resource restore service for Storyblok access tokens.
 * Implements URL and parameter construction for access tokens.
 */
export class AccessTokenRestoreService extends BaseResourceRestoreService<StoryblokResource> {
  canHandle(type: string) {
    return type === "access-token";
  }

  getCreateUrl(_resource: StoryblokResource, options: RestoreOptions): string {
    return `spaces/${options.spaceId}/api_keys`;
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
    throw new Error(
      `Access token restoration failed: ${error instanceof Error ? error.message : String(error)}`
    );
  }
}
