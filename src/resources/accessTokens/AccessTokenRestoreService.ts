import type { RestoreOptions } from "../../shared/types";
import { BaseResourceRestoreService } from "../../single/services/BaseRestoreService";
import type { StoryblokResource } from "../../single/StoryblokResource";
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

  getUpdateUrl(resource: StoryblokResource, options: RestoreOptions): string {
    return `spaces/${options.spaceId}/api_keys/${resource.id}`;
  }

  getParams(resource: StoryblokResource) {
    return {
      api_key: resource,
    };
  }

  getResponseData(response: ISbResponse): StoryblokResource {
    return response.data.api_key;
  }
}
