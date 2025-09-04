import type { RestoreOptions } from "../../shared/types";
import { BaseResourceRestoreService } from "../../single/services/BaseRestoreService";
import type { StoryblokResource } from "../../single/StoryblokResource";
import type { ISbResponse } from "storyblok-js-client";

/**
 * Resource restore service for Storyblok datasource entries.
 * Implements URL and parameter construction for datasource entries.
 */
export class DatasourceEntryRestoreService extends BaseResourceRestoreService<StoryblokResource> {
  canHandle(type: string) {
    return type === "datasource-entry";
  }

  getCreateUrl(_resource: StoryblokResource, options: RestoreOptions): string {
    return `spaces/${options.spaceId}/datasource_entries`;
  }

  getUpdateUrl(resource: StoryblokResource, options: RestoreOptions): string {
    return `spaces/${options.spaceId}/datasource_entries/${resource.id}`;
  }

  getParams(resource: StoryblokResource) {
    return {
      datasource_entry: resource,
    };
  }

  getResponseData(response: ISbResponse): StoryblokResource {
    return response.data.datasource_entry;
  }
}
