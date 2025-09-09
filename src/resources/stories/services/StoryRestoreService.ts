import type {
  ISbContentMangmntAPI,
  ISbResponse,
  ISbResult,
} from "storyblok-js-client";
import { BaseResourceRestoreService } from "@core/services/BaseRestoreService";
import type { RestoreOptions, StoryblokResource } from "@core/types/types";

interface StoryResource extends StoryblokResource {
  full_slug: string;
}

/**
 * Resource restore service for Storyblok stories.
 * Implements URL and parameter construction for stories.
 */
export class StoryRestoreService extends BaseResourceRestoreService<StoryResource> {
  getCreateUrl(_resource: StoryblokResource, options: RestoreOptions): string {
    return `spaces/${options.spaceId}/stories`;
  }

  getUpdateUrl(resource: StoryResource, options: RestoreOptions): string {
    return `spaces/${options.spaceId}/stories/${resource.id}`;
  }
  getResourceType(): string {
    return "story";
  }

  protected async findExistingResource(
    resource: StoryResource,
    options: RestoreOptions
  ): Promise<StoryResource | null> {
    const response = (await this.context.apiClient.get(
      `spaces/${options.spaceId}/stories`,
      {
        by_slugs: resource.full_slug,
      }
    )) as ISbResult;

    return response.data?.stories?.[0] || null;
  }

  getParams(resource: StoryResource) {
    return {
      story: resource as unknown as ISbContentMangmntAPI["story"], // TODO fix
      force_update: 1,
    };
  }

  getResponseData(response: ISbResponse): StoryResource {
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
