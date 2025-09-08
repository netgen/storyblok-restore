import type { RestoreOptions } from "@core/types/types";
import { BaseResourceRestoreService } from "@core/services/BaseRestoreService";
import type { StoryblokResource } from "@core/types/types";
import type { ISbResponse } from "storyblok-js-client";

/**
 * Resource restore service for Storyblok components.
 * Implements URL and parameter construction for components.
 */
export class ComponentRestoreService extends BaseResourceRestoreService<StoryblokResource> {
  getCreateUrl(_resource: StoryblokResource, options: RestoreOptions): string {
    return `spaces/${options.spaceId}/components`;
  }

  getParams(resource: StoryblokResource) {
    return {
      component: resource,
    };
  }

  getResponseData(response: ISbResponse): StoryblokResource {
    return response.data.component;
  }

  handleError(error: unknown): never {
    const message =
      typeof error === "object" && error !== null && "message" in error
        ? error.message
        : String(error);

    throw new Error(`Component restoration failed: ${message}`);
  }
}
