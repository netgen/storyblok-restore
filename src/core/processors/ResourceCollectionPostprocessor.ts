import type { RestoreOptions } from "../types/types";
import type { ResourceMappingRegistry } from "../services/ResourceMappingRegistry";
import type { StoryblokResource } from "../types/types";

/**
 * Interface for post-processors used after bulk restore.
 * Post-processors can perform actions such as fixing references after all resources are restored.
 */
export interface ResourceCollectionPostprocessor<T extends StoryblokResource> {
  /**
   * Post-process resources after restore.
   * @param resources The array of restored resources.
   * @param options The bulk restore options.
   * @param resourceMappingRegistry The bulk restore resourceMappingRegistry.
   */
  postProcess(
    resources: T[],
    options: RestoreOptions,
    resourceMappingRegistry: ResourceMappingRegistry
  ): Promise<void>;
}
