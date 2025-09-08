import type { ISbContentMangmntAPI, ISbResponse } from "storyblok-js-client";
import { BaseResourceRestoreService } from "@core/services/BaseRestoreService";
import type { RestoreOptions, StoryblokResource } from "@core/types/types";

/**
 * Resource restore service for Storyblok stories.
 * Implements URL and parameter construction for stories.
 */
export class StoryRestoreService extends BaseResourceRestoreService<StoryblokResource> {
  getCreateUrl(_resource: StoryblokResource, options: RestoreOptions): string {
    return `spaces/${options.spaceId}/stories`;
  }

  getParams(resource: StoryblokResource) {
    return {
      story: resource as unknown as ISbContentMangmntAPI["story"], // TODO fix
    };
  }

  getResponseData(response: ISbResponse): StoryblokResource {
    return response.data.story;
  }

  handleError(error: unknown): never {
    const message =
      typeof error === "object" && error !== null && "message" in error
        ? error.message
        : String(error);

    throw new Error(`Story restoration failed: ${message}`);
  }
}
