import type { SortingStrategy } from "@core/sort/SortingStrategy";
import toposort from "toposort";
import type { StoryblokResource } from "@core/types/types";

/**
 * Sorting strategy that performs a topological sort on nestable Storyblok resources.
 * Ensures that parent resources are restored before their children.
 */
export class TopologicalSortStrategy
  implements SortingStrategy<StoryblokResource>
{
  /**
   * Sorts resources using topological order based on parent-child relationships.
   * @param resources The array of nestable resources to sort.
   * @returns The sorted array of resources.
   */
  sort(resources: StoryblokResource[]): StoryblokResource[] {
    const idToResourceMap = new Map<string | number, StoryblokResource>();
    resources.forEach((resource) => idToResourceMap.set(resource.id, resource));

    const parentDependencies: [number | null, number][] = resources.map(
      (resource) => {
        if (resource.parent_id) {
          return [resource.parent_id, resource.id];
        } else {
          return [null, resource.id];
        }
      }
    );

    const sortedIds = toposort(parentDependencies).filter((id) => id !== null);

    return sortedIds
      .map((id) => idToResourceMap.get(id))
      .filter((item) => item !== undefined);
  }
}
