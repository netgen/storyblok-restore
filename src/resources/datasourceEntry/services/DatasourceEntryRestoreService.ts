import type { RestoreOptions } from "@core/types/types";
import { BaseResourceRestoreService } from "@core/services/BaseRestoreService";
import type { StoryblokResource } from "@core/types/types";
import type { ISbResponse } from "storyblok-js-client";

/**
 * Resource restore service for Storyblok datasource entries.
 * Implements URL and parameter construction for datasource entries.
 */
export class DatasourceEntryRestoreService extends BaseResourceRestoreService<StoryblokResource> {
  getCreateUrl(_resource: StoryblokResource, options: RestoreOptions): string {
    return `spaces/${options.spaceId}/datasource_entries`;
  }

  getParams(resource: StoryblokResource) {
    return {
      datasource_entry: resource,
    };
  }

  getResponseData(response: ISbResponse): StoryblokResource {
    return response.data.datasource_entry;
  }

  handleError(error: unknown): never {
    const message =
      typeof error === "object" && error !== null && "message" in error
        ? error.message
        : String(error);

    throw new Error(`Datasource entry restoration failed: ${message}`);
  }
}
