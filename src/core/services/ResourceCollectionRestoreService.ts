import type { ResourceCollectionPostprocessor } from "../processors/ResourceCollectionPostprocessor";
import type { ResourcePreprocessor } from "../processors/ResourcePreproceossor";
import type { SortingStrategy } from "../sort/SortingStrategy";
import type {
  ResourceType,
  RestoreOptions,
  StoryblokResource,
} from "../types/types";
import type { ResourceMappingRegistry } from "./ResourceMappingRegistry";
import type { ResourceRestoreService } from "./ResourceRestoreService";
import { logger } from "@shared/logging";

/**
 * Service for orchestrating the bulk restore of Storyblok resources.
 * Handles sorting, preprocessing, restoring, and post-processing of resources.
 *
 * @template T The type of Storyblok resource being restored.
 */
export abstract class ResourceCollectionRestoreService<
  T extends StoryblokResource = StoryblokResource,
> {
  /**
   * @param sortingStrategy Strategy for sorting resources before restore (e.g., topological sort).
   * @param restoreService Service for restoring a single resource.
   * @param resourcePreprocessor Optional preprocessor for mutating resources before restore.
   * @param resourceCollectionPostProcessor Optional post-processor for actions after all resources are restored.
   */
  constructor(
    private resourceType: ResourceType,
    private restoreService: ResourceRestoreService<T>,
    private sortingStrategy?: SortingStrategy<T>,
    private resourcePreprocessor?:
      | ResourcePreprocessor<T>
      | ResourcePreprocessor<T>[],
    private resourceCollectionPostProcessor?: ResourceCollectionPostprocessor<T>
  ) {}

  /**
   * Restores a collection of resources in the correct order, updating mappings and running post-processing.
   * @param resources The array of resources to restore.
   * @param options The bulk restore options.
   * @param resourceMappingRegistry The bulk restore resourceMappingRegistry.
   */
  async restore(
    resources: T[],
    options: RestoreOptions,
    resourceMappingRegistry: ResourceMappingRegistry
  ) {
    if (!resources || resources.length === 0) {
      throw new Error(`No ${this.resourceType} resources to restore`);
    }

    logger.info(
      `Starting ${this.resourceType} restoration for ${resources.length} resources`
    );
    logger.debug(`Restore options:`, options);
    logger.debug(
      `Initial resources:`,
      resources.map((r) => ({ id: r.id, uuid: r.uuid }))
    );

    const sorted = this.sortingStrategy?.sort(resources) || resources;
    logger.debug(
      `Sorted resources:`,
      sorted.map((r) => ({ id: r.id, uuid: r.uuid }))
    );

    const results = {
      succeeded: 0,
      failed: 0,
      errors: [] as Array<{ resource: T; error: unknown }>,
    };

    for (let i = 0; i < sorted.length; i++) {
      const resource = sorted[i];
      if (!resource) continue;

      const progress = `${i + 1}/${sorted.length}`;

      logger.info(
        `Restoring ${this.resourceType} ${resource?.id} (${progress})`
      );
      logger.debug(`Processing resource:`, {
        id: resource.id,
        uuid: resource.uuid,
      });

      try {
        await this.restoreSingleResource(
          resource,
          options,
          resourceMappingRegistry
        );
        results.succeeded++;
        logger.debug(
          `Successfully restored ${this.resourceType} ${resource.id}`
        );
      } catch (error) {
        results.failed++;
        results.errors.push({ resource, error });
        logger.error(
          `Failed to restore ${this.resourceType} ${resource.id}:`,
          error instanceof Error ? error.message : String(error)
        );
        logger.debug(`Error details for ${resource?.id}:`, error);
      }
    }

    logger.info(`Running post-processing for ${this.resourceType}`);
    await this.resourceCollectionPostProcessor?.postProcess(
      sorted,
      options,
      resourceMappingRegistry
    );

    logger.info(
      `${this.resourceType} restoration complete: ${results.succeeded} succeeded, ${results.failed} failed`
    );

    if (results.failed > 0) {
      logger.warn(`${results.failed} resources failed to restore`);
      logger.debug(
        `Failed resources:`,
        results.errors.map((e) => ({ id: e.resource.id, error: e.error }))
      );
    }
  }

  private async restoreSingleResource(
    resource: T,
    options: RestoreOptions,
    resourceMappingRegistry: ResourceMappingRegistry
  ): Promise<void> {
    let processed = resource;

    if (Array.isArray(this.resourcePreprocessor)) {
      logger.debug(
        `Running ${this.resourcePreprocessor.length} preprocessors for ${resource.id}`
      );
      for (const preprocessor of this.resourcePreprocessor) {
        processed = preprocessor.preprocess(resource, resourceMappingRegistry);
        logger.debug(`Preprocessor result for ${resource.id}:`, {
          id: processed.id,
          uuid: processed.uuid,
        });
      }
    } else if (this.resourcePreprocessor) {
      logger.debug(`Running single preprocessor for ${resource.id}`);
      processed = this.resourcePreprocessor.preprocess(
        resource,
        resourceMappingRegistry
      );
      logger.debug(`Preprocessor result for ${resource.id}:`, {
        id: processed.id,
        uuid: processed.uuid,
      });
    }

    logger.debug(`Calling restore service for ${resource.id}`);
    const importedResource = await this.restoreService.restore(
      processed,
      options,
      resourceMappingRegistry
    );
    logger.debug(`Restore service result for ${resource.id}:`, {
      oldId: resource.id,
      newId: importedResource.id,
      oldUuid: resource.uuid,
      newUuid: importedResource.uuid,
    });

    resourceMappingRegistry
      .get(this.resourceType)
      .oldIdToNewIdMap.set(resource.id, importedResource.id);
    resourceMappingRegistry
      .get(this.resourceType)
      .oldUuidToNewUuidMap.set(resource.uuid, importedResource.uuid);

    logger.debug(`Updated mapping registry for ${this.resourceType}:`, {
      oldId: resource.id,
      newId: importedResource.id,
      oldUuid: resource.uuid,
      newUuid: importedResource.uuid,
    });
  }

  /**
   * Checks if the service can handle a given resource type.
   * @param type The type of resource to check.
   * @returns True if the service can handle the resource type, false otherwise.
   */
  canHandle(type: string): boolean {
    return this.restoreService.canHandle(type);
  }
}
