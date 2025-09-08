import type { RestoreOptions } from "@core/types/types";
import { BaseResourceRestoreService } from "@core/services/BaseRestoreService";
import type { StoryblokResource } from "@core/types/types";
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

  getParams(resource: StoryblokResource) {
    return {
      collaborator: resource,
    };
  }

  getResponseData(response: ISbResponse): StoryblokResource {
    return response.data.collaborator;
  }

  handleError(error: unknown): never {
    const message =
      typeof error === "object" && error !== null && "message" in error
        ? error.message
        : String(error);

    throw new Error(`Collaborator restoration failed: ${message}`);
  }
}
