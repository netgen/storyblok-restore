import type { RestoreOptions } from "../../shared/types";
import { BaseResourceRestoreService } from "../../single/services/BaseRestoreService";
import type { StoryblokResource } from "../../single/StoryblokResource";
import type { ISbResponse } from "storyblok-js-client";

/**
 * Resource restore service for Storyblok collaborators.
 * Implements URL and parameter construction for collaborators.
 */
export class CollaboratorRestoreService extends BaseResourceRestoreService<StoryblokResource> {
  canHandle(type: string) {
    return type === "collaborator";
  }

  getCreateUrl(_resource: StoryblokResource, options: RestoreOptions): string {
    return `spaces/${options.spaceId}/collaborators`;
  }

  getUpdateUrl(resource: StoryblokResource, options: RestoreOptions): string {
    return `spaces/${options.spaceId}/collaborators/${resource.id}`;
  }

  getParams(resource: StoryblokResource) {
    return {
      collaborator: resource,
    };
  }

  getResponseData(response: ISbResponse): StoryblokResource {
    return response.data.collaborator;
  }
}
