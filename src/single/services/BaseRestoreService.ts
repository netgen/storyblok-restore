import type { ISbResponse, ISbStoriesParams } from "storyblok-js-client";
import type { RestoreContext, RestoreOptions } from "../../shared/types";
import type { StoryblokResource } from "../StoryblokResource";
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
  /**
   * Determines if this service can handle the given resource type.
   * @param type The resource type (e.g., 'story').
   */
  abstract canHandle(type: string): boolean;
  /**
   * Returns the URL for creating a resource.
   * @param resource The resource to create.
   * @param options The restore options.
   */
  abstract getCreateUrl(resource: T, options: RestoreOptions): string;
  /**
   * Returns the URL for updating a resource.
   * @param resource The resource to update.
   * @param options The restore options.
   */
  abstract getUpdateUrl(resource: T, options: RestoreOptions): string;
  /**
   * Returns the parameters for the API call.
   * @param resource The resource to restore.
   */
  abstract getParams(
    resource: T
  ): Record<string, unknown> & { publish?: number };

  /**
   * Restores a resource by creating or updating it via the API client.
   * @param resource The resource to restore.
   * @param options The restore options.
   * @param context The restore context.
   * @returns The restored resource as returned by the API.
   */
  async restore(
    resource: T,
    options: RestoreOptions,
    context: RestoreContext
  ): Promise<T> {
    let params = this.getParams(resource);
    if (options.publish) params.publish = 1;

    let response;
    if (options.create && !options.forceUpdate) {
      const url = this.getCreateUrl(resource, options);
      console.log({ url, params });
      response = await context.apiClient.post(url, params as ISbStoriesParams);
    } else {
      const url = this.getUpdateUrl(resource, options);
      response = await context.apiClient.put(url, params as ISbStoriesParams);
    }

    console.log("Response", response);
    return this.getResponseData(response as unknown as ISbResponse); // TODO fix
  }

  abstract getResponseData(response: ISbResponse): T;
}
