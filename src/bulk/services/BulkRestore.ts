import type { ResourcePostProcessor } from "../../single/processors/ResourcePostProcessor";
import type { ResourcePreprocessor } from "../../single/processors/ResourcePreproceossor";
import type { ResourceRestoreService } from "../../single/services/ResourceRestoreService";
import type { SortingStrategy } from "../../single/sorting/SortingStrategy";
import type { StoryblokResource } from "../../single/StoryblokResource";
import type {
  BulkRestoreContext,
  BulkRestoreOptions,
} from "../../shared/types";

/**
 * Service for orchestrating the bulk restore of Storyblok resources.
 * Handles sorting, preprocessing, restoring, and post-processing of resources.
 *
 * @template T The type of Storyblok resource being restored.
 */
export class BulkRestoreService<T extends StoryblokResource> {
  /**
   * @param sortingStrategy Strategy for sorting resources before restore (e.g., topological sort).
   * @param restoreService Service for restoring a single resource.
   * @param preprocessor Optional preprocessor for mutating resources before restore.
   * @param postProcessor Optional post-processor for actions after all resources are restored.
   */
  constructor(
    private restoreService: ResourceRestoreService<T>,
    private sortingStrategy?: SortingStrategy<T>,
    private preprocessor?: ResourcePreprocessor<T>,
    private postProcessor?: ResourcePostProcessor<T>
  ) {}

  /**
   * Restores a collection of resources in the correct order, updating mappings and running post-processing.
   * @param resources The array of resources to restore.
   * @param options The bulk restore options.
   * @param context The bulk restore context.
   */
  async restore(
    resources: T[],
    options: BulkRestoreOptions,
    context: BulkRestoreContext
  ) {
    console.log("Restoring resources", resources.length);
    const sorted = this.sortingStrategy?.sort(resources) || resources;

    for (const resource of sorted) {
      console.log("Restoring resource", resource.id);
      const processed =
        this.preprocessor?.preprocess(resource, context) || resource;
      const importedResource = await this.restoreService.restore(
        processed,
        options,
        context
      );

      console.log("Imported resource", importedResource);

      context.oldIdToNewIdMap.set(resource.id, importedResource.id);
      context.oldUuidToNewUuidMap.set(resource.uuid, importedResource.uuid);
    }

    await this.postProcessor?.postProcess(sorted, options, context);
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
