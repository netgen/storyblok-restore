import type { RestoreOptions } from "../../shared/types";
import { BaseResourceRestoreService } from "../../single/services/BaseRestoreService";
import type { StoryblokResource } from "../../single/StoryblokResource";
import type { ISbResponse } from "storyblok-js-client";

/**
 * Resource restore service for Storyblok components.
 * Implements URL and parameter construction for components.
 */
export class ComponentRestoreService extends BaseResourceRestoreService<StoryblokResource> {
  canHandle(type: string) {
    return type === "component";
  }

  getCreateUrl(_resource: StoryblokResource, options: RestoreOptions): string {
    return `spaces/${options.spaceId}/components`;
  }

  getUpdateUrl(resource: StoryblokResource, options: RestoreOptions): string {
    return `spaces/${options.spaceId}/components/${resource.id}`;
  }

  getParams(resource: StoryblokResource) {
    return {
      component: resource,
    };
  }

  getResponseData(response: ISbResponse): StoryblokResource {
    return response.data.component;
  }
}
