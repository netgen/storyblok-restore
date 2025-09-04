import type { RestoreOptions } from "../../shared/types";
import { BaseResourceRestoreService } from "../../single/services/BaseRestoreService";
import type { StoryblokResource } from "../../single/StoryblokResource";
import type { ISbResponse } from "storyblok-js-client";

/**
 * Resource restore service for Storyblok datasources.
 * Implements URL and parameter construction for datasources.
 */
export class DatasourceRestoreService extends BaseResourceRestoreService<StoryblokResource> {
  canHandle(type: string) {
    return type === "datasource";
  }

  getCreateUrl(_resource: StoryblokResource, options: RestoreOptions): string {
    return `spaces/${options.spaceId}/datasources`;
  }

  getUpdateUrl(resource: StoryblokResource, options: RestoreOptions): string {
    return `spaces/${options.spaceId}/datasources/${resource.id}`;
  }

  getParams(resource: StoryblokResource) {
    return {
      datasource: resource,
    };
  }

  getResponseData(response: ISbResponse): StoryblokResource {
    return response.data.datasource;
  }
}
