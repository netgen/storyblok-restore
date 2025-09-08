import type { RestoreOptions } from "@core/types/types";
import { BaseResourceRestoreService } from "@core/services/BaseRestoreService";
import type { StoryblokResource } from "@core/types/types";
import type { ISbResponse } from "storyblok-js-client";

/**
 * Resource restore service for Storyblok component groups.
 * Implements URL and parameter construction for component groups.
 */
export class ComponentGroupRestoreService extends BaseResourceRestoreService<StoryblokResource> {
  getCreateUrl(_resource: StoryblokResource, options: RestoreOptions): string {
    return `spaces/${options.spaceId}/component_groups`;
  }

  getParams(resource: StoryblokResource) {
    return {
      component_group: resource,
    };
  }

  getResponseData(response: ISbResponse): StoryblokResource {
    return response.data.component_group;
  }

  handleError(error: unknown): never {
    // @ts-expect-error
    console.log(error, error.response.data);
    const message =
      typeof error === "object" && error !== null && "message" in error
        ? error.message
        : String(error);

    throw new Error(`Component group restoration failed: ${message}`);
  }
}
