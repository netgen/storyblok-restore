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

    const sorted = this.sortingStrategy?.sort(resources) || resources;
    const results = {
      succeeded: 0,
      failed: 0,
      errors: [] as Array<{ resource: T; error: unknown }>,
    };

    for (const resource of sorted) {
      try {
        await this.restoreSingleResource(
          resource,
          options,
          resourceMappingRegistry
        );
        results.succeeded++;
      } catch (error) {
        results.failed++;
        results.errors.push({ resource, error });
        console.error(
          // LOGGER
          `Failed to restore ${this.resourceType} ${resource.id}:`,
          error instanceof Error ? error.message : String(error)
        );
      }
    }

    await this.resourceCollectionPostProcessor?.postProcess(
      sorted,
      options,
      resourceMappingRegistry
    );

    console.log(
      // LOGGER
      `${this.resourceType} restoration complete: ${results.succeeded} succeeded, ${results.failed} failed`
    );
  }

  private async restoreSingleResource(
    resource: T,
    options: RestoreOptions,
    resourceMappingRegistry: ResourceMappingRegistry
  ): Promise<void> {
    let processed = resource;

    if (Array.isArray(this.resourcePreprocessor)) {
      for (const preprocessor of this.resourcePreprocessor) {
        processed = preprocessor.preprocess(resource, resourceMappingRegistry);
      }
    } else if (this.resourcePreprocessor) {
      processed = this.resourcePreprocessor.preprocess(
        resource,
        resourceMappingRegistry
      );
    }

    const importedResource = await this.restoreService.restore(
      processed,
      options,
      resourceMappingRegistry
    );

    resourceMappingRegistry
      .get(this.resourceType)
      .oldIdToNewIdMap.set(resource.id, importedResource.id);
    resourceMappingRegistry
      .get(this.resourceType)
      .oldUuidToNewUuidMap.set(resource.uuid, importedResource.uuid);
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
