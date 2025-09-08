import type { RestoreOptions } from "@core/types/types";
import { BaseResourceRestoreService } from "@core/services/BaseRestoreService";
import type { StoryblokResource } from "@core/types/types";
import type { ISbResponse } from "storyblok-js-client";

/**
 * Resource restore service for Storyblok datasources.
 * Implements URL and parameter construction for datasources.
 */
export class DatasourceRestoreService extends BaseResourceRestoreService<StoryblokResource> {
  getCreateUrl(_resource: StoryblokResource, options: RestoreOptions): string {
    return `spaces/${options.spaceId}/datasources`;
  }

  getParams(resource: StoryblokResource) {
    return {
      datasource: resource,
    };
  }

  getResponseData(response: ISbResponse): StoryblokResource {
    return response.data.datasource;
  }

  handleError(error: unknown): never {
    const message =
      typeof error === "object" && error !== null && "message" in error
        ? error.message
        : String(error);

    throw new Error(`Datasource restoration failed: ${message}`);
  }
}
