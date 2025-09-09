import type { StoryblokResource } from "@core/types/types";
import { logger } from "@shared/logging";
import type { ISbResponse, ISbStoriesParams } from "storyblok-js-client";
import type { Context } from "../types/context";
import type { RestoreOptions } from "../types/types";
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
  constructor(protected context: Context) {}

  /**
   * Returns the URL for creating a resource.
   * @param resource The resource to create.
   * @param options The restore options.
   */
  abstract getCreateUrl(resource: T, options: RestoreOptions): string;

  /**
   * Returns the URL for updating a resource.
   */
  abstract getUpdateUrl(resource: T, options: RestoreOptions): string;

  /**
   * Returns the parameters for the API call.
   * @param resource The resource to restore.
   */
  abstract getParams(resource: T): any & { publish?: number };

  /**
   * Finds an existing resource that conflicts with the given resource.
   * Only implemented by services that need upsert functionality.
   */
  protected async findExistingResource(
    _resource: T,
    _options: RestoreOptions
  ): Promise<T | null> {
    return null;
  }

  /**
   * Handles an error that occurred during the restore process.
   */
  abstract handleError(error: unknown): never;

  /**
   * Returns the data from the response.
   */
  abstract getResponseData(response: ISbResponse): T;

  /**
   * Returns a human-readable identifier for the resource (for logging).
   */
  protected getResourceIdentifier(resource: T): string {
    return resource.id.toString();
  }

  /**
   * Returns the resource type name (for logging).
   */
  abstract getResourceType(): string;

  /**
   * Checks if an error indicates a resource conflict (already exists).
   */
  protected isConflictError(error: unknown): boolean {
    const messageExists =
      typeof error === "object" && error !== null && "message" in error;

    const messageFromArray =
      messageExists &&
      Array.isArray(error.message) &&
      !!error.message[0] &&
      typeof error.message[0] === "string"
        ? error.message[0]
        : "";

    const messageFromString =
      messageExists && typeof error.message === "string"
        ? error.message.toLowerCase()
        : "";

    const message = messageFromArray || messageFromString;

    return (
      message.includes("already taken") ||
      message.includes("been taken") ||
      message.includes("already exists") ||
      message.includes("duplicate") ||
      message.includes("conflict") ||
      message.includes("name taken") ||
      message.includes("slug taken")
    );
  }

  /**
   * Restores a resource using upsert logic: create first, update if conflict.
   */
  async restore(resource: T, options: RestoreOptions): Promise<T> {
    try {
      // Try to create first (fast path for 99.9% of cases)
      logger.debug(
        `Creating ${this.getResourceType()} ${this.getResourceIdentifier(resource)}`
      );
      return await this.createResource(resource, options);
    } catch (error) {
      if (this.isConflictError(error)) {
        // Resource already exists, try to update
        logger.warn(
          `${this.getResourceType()} ${this.getResourceIdentifier(resource)} already exists, attempting update...`
        );

        try {
          const existingResource = await this.findExistingResource(
            resource,
            options
          );

          if (existingResource) {
            logger.debug(
              `Updating existing ${this.getResourceType()} ${this.getResourceIdentifier(resource)}`
            );
            return await this.updateResource(
              existingResource,
              resource,
              options
            );
          } else {
            logger.error(
              `Conflict detected but could not find existing ${this.getResourceType()} ${this.getResourceIdentifier(resource)}`
            );
          }
        } catch (error) {
          logger.error(
            `Conflict detected but could not find existing ${this.getResourceType()} ${this.getResourceIdentifier(resource)}`
          );
          this.handleError(error);
        }
      }

      // Re-throw if not a conflict or if update failed
      this.handleError(error);
    }
  }

  /**
   * Creates a new resource.
   */
  private async createResource(
    resource: T,
    options: RestoreOptions
  ): Promise<T> {
    const url = this.getCreateUrl(resource, options);
    let params = this.getParams(resource);
    params.publish = 1;

    logger.debug(
      `Creating ${this.getResourceType()} ${this.getResourceIdentifier(resource)} with url ${url} and params `,
      params
    );

    const response = await this.context.apiClient.post(
      url,
      params as ISbStoriesParams
    );

    const createdResource = this.getResponseData(
      response as unknown as ISbResponse
    );

    return createdResource;
  }

  /**
   * Updates an existing resource.
   */
  private async updateResource(
    existingResource: T,
    newResource: T,
    options: RestoreOptions
  ): Promise<T> {
    const url = this.getUpdateUrl(existingResource, options);
    let params = this.getParams(newResource);
    params.publish = 1;

    logger.debug(
      `Updating ${this.getResourceType()} ${this.getResourceIdentifier(existingResource)} with url ${url} and params `,
      params
    );

    const response = await this.context.apiClient.put(
      url,
      params as ISbStoriesParams
    );

    const updatedResource = this.getResponseData(
      response as unknown as ISbResponse
    );

    return updatedResource;
  }
}
