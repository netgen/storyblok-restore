import type { ResourceMappingRegistry } from "../services/ResourceMappingRegistry";
import type { StoryblokResource } from "../types/types";

/**
 * Interface for resource preprocessors used in bulk restore.
 * Preprocessors can mutate or prepare resources before they are restored (e.g., update parent IDs).
 */
export interface ResourcePreprocessor<T extends StoryblokResource> {
  /**
   * Preprocess a resource before restore.
   * @param resource The resource to preprocess.
   * @param resourceMappingRegistry The bulk restore resourceMappingRegistry.
   * @returns The preprocessed resource.
   */
  preprocess(resource: T, resourceMappingRegistry: ResourceMappingRegistry): T;
}
