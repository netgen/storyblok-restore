import type { RestoreOptions } from "@core/types/types";
import { BaseResourceRestoreService } from "@core/services/BaseRestoreService";
import type { StoryblokResource } from "@core/types/types";
import type { ISbResponse } from "storyblok-js-client";

interface DatasourceResource extends StoryblokResource {
  slug: string;
}

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

  getUpdateUrl(resource: DatasourceResource, options: RestoreOptions): string {
    return `spaces/${options.spaceId}/datasources/${resource.id}`;
  }

  getResourceType(): string {
    return "datasource";
  }

  protected async findExistingResource(
    resource: DatasourceResource,
    options: RestoreOptions
  ): Promise<DatasourceResource | null> {
    const response = await this.context.apiClient.get(
      `spaces/${options.spaceId}/datasources`,
      {
        search: resource.slug,
      }
    );
    return response.data?.datasources?.[0] || null;
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
