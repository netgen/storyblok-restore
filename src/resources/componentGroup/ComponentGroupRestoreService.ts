import type { RestoreOptions } from "../../shared/types";
import { BaseResourceRestoreService } from "../../single/services/BaseRestoreService";
import type { StoryblokResource } from "../../single/StoryblokResource";
import type { ISbResponse } from "storyblok-js-client";

/**
 * Resource restore service for Storyblok component groups.
 * Implements URL and parameter construction for component groups.
 */
export class ComponentGroupRestoreService extends BaseResourceRestoreService<StoryblokResource> {
  canHandle(type: string) {
    return type === "component-group";
  }

  getCreateUrl(_resource: StoryblokResource, options: RestoreOptions): string {
    return `spaces/${options.spaceId}/component_groups`;
  }

  getUpdateUrl(resource: StoryblokResource, options: RestoreOptions): string {
    return `spaces/${options.spaceId}/component_groups/${resource.id}`;
  }

  getParams(resource: StoryblokResource) {
    return {
      component_group: resource,
    };
  }

  getResponseData(response: ISbResponse): StoryblokResource {
    return response.data.component_group;
  }
}
