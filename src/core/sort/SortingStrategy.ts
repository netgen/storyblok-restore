import type { StoryblokResource } from "../types/types";

/**
 * Interface for sorting strategies used in bulk restore.
 * Sorting strategies determine the order in which resources are restored (e.g., topological sort).
 *
 * @template T The type of Storyblok resource being sorted.
 */
export interface SortingStrategy<T extends StoryblokResource> {
  /**
   * Sorts the given array of resources and returns the sorted array.
   * @param resources The array of resources to sort.
   * @returns The sorted array of resources.
   */
  sort(resources: T[]): T[];
}
