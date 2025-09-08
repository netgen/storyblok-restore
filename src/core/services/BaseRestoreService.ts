import type { ISbResponse, ISbStoriesParams } from "storyblok-js-client";
import type { RestoreOptions } from "../types/types";
import type { Context } from "../types/context";
import type { ResourceMappingRegistry } from "./ResourceMappingRegistry";
import type { StoryblokResource } from "@core/types/types";
import type { ResourceRestoreService } from "./ResourceRestoreService";

/**
 * Abstract base class for resource restore services.
 * Provides the main restore logic and requires subclasses to implement URL and parameter construction.
 *
 * @template T The type of Storyblok resource being restored.
 */
export abstract class BaseResourceRestoreService<T extends StoryblokResource>
  implements ResourceRestoreService<T>
{
  constructor(private context: Context) {}

  /**
   * Returns the URL for creating a resource.
   * @param resource The resource to create.
   * @param options The restore options.
   */
  abstract getCreateUrl(resource: T, options: RestoreOptions): string;

  /**
   * Returns the parameters for the API call.
   * @param resource The resource to restore.
   */
  abstract getParams(resource: T): any & { publish?: number };

  abstract handleError(error: unknown): never;

  /**
   * Restores a resource by creating or updating it via the API client.
   * @param resource The resource to restore.
   * @param options The restore options.
   * @param resourceMappingRegistry The restore resourceMappingRegistry.
   * @returns The restored resource as returned by the API.
   */
  async restore(
    resource: T,
    options: RestoreOptions,
    _resourceMappingRegistry: ResourceMappingRegistry
  ): Promise<T> {
    try {
      const url = this.getCreateUrl(resource, options);
      let params = this.getParams(resource);
      params.publish = 1;

      const response = await this.context.apiClient.post(
        url,
        params as ISbStoriesParams
      );
      return this.getResponseData(response as unknown as ISbResponse); // TODO fix types
    } catch (error) {
      this.handleError(error);
    }
  }

  abstract getResponseData(response: ISbResponse): T;
}
