import type { RestoreOptions, StoryblokResource } from "@core/types/types";
import { BaseResourceRestoreService } from "@core/services/BaseRestoreService";
import type { ISbResponse, ISbResult } from "storyblok-js-client";

interface DatasourceEntryResource extends StoryblokResource {
  name: string;
  datasource_id?: number;
}
/**
 * Resource restore service for Storyblok datasource entries.
 * Implements URL and parameter construction for datasource entries.
 */
export class DatasourceEntryRestoreService extends BaseResourceRestoreService<DatasourceEntryResource> {
  getCreateUrl(
    _resource: DatasourceEntryResource,
    options: RestoreOptions
  ): string {
    return `spaces/${options.spaceId}/datasource_entries`;
  }

  getParams(resource: DatasourceEntryResource) {
    return {
      datasource_entry: resource,
    };
  }

  getUpdateUrl(
    resource: DatasourceEntryResource,
    options: RestoreOptions
  ): string {
    return `spaces/${options.spaceId}/datasource_entries/${resource.id}`;
  }

  getResourceType(): string {
    return "datasource entry";
  }

  protected async findExistingResource(
    resource: DatasourceEntryResource,
    options: RestoreOptions
  ): Promise<DatasourceEntryResource | null> {
    if (!resource.datasource_id) return null;

    // @ts-expect-error - storyblok js client did not type datasource_id as possible parameter
    const response = (await this.context.apiClient.get(
      `spaces/${options.spaceId}/datasource_entries`,
      {
        datasource_id: resource.datasource_id,
      }
    )) as ISbResult;

    const datasourceEntries = response.data
      ?.datasource_entries as DatasourceEntryResource[];

    return (
      datasourceEntries.find((entry) => entry.name === resource.name) || null
    );
  }

  getResponseData(response: ISbResponse): DatasourceEntryResource {
    // When updating a datasource entry, the response data is empty
    if (!response.data.datasource_entry) {
      return {
        // @ts-expect-error
        id: undefined,
        // @ts-expect-error
        uuid: undefined,
      };
    }
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
