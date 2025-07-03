import type { RestoreOptions } from "../../shared/types";
import { BaseResourceRestoreService } from "../../single/services/BaseRestoreService";
import type { StoryblokResource } from "../../single/StoryblokResource";
import type { ISbContentMangmntAPI, ISbResponse } from "storyblok-js-client";

/**
 * Resource restore service for Storyblok stories.
 * Implements URL and parameter construction for stories.
 */
export class StoryRestoreService extends BaseResourceRestoreService<StoryblokResource> {
  canHandle(type: string) {
    return type === "story";
  }

  getCreateUrl(_resource: StoryblokResource, options: RestoreOptions): string {
    return `spaces/${options.spaceId}/stories`;
  }

  getUpdateUrl(resource: StoryblokResource, options: RestoreOptions): string {
    return `spaces/${options.spaceId}/stories/${resource.id}`;
  }

  getParams(resource: StoryblokResource) {
    return {
      story: resource as unknown as ISbContentMangmntAPI["story"], // TODO fix
    };
  }

  getResponseData(response: ISbResponse): StoryblokResource {
    return response.data.story;
  }
}
