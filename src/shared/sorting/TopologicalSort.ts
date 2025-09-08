import type { SortingStrategy } from "@core/sort/SortingStrategy";
import toposort from "toposort";
import type { StoryblokResource } from "@core/types/types";

/**
 * Sorting strategy that performs a topological sort on nestable Storyblok resources.
 * Ensures that parent resources are restored before their children.
 */
export class TopologicalSortStrategy<
  TResourceField extends string | number,
  TStoryblokResource extends StoryblokResource &
    Record<TResourceField, unknown> = StoryblokResource &
    Record<TResourceField, unknown>,
> implements SortingStrategy<TStoryblokResource>
{
  constructor(
    private readonly parentField: TResourceField = "parent_id" as TResourceField
  ) {}

  /**
   * Sorts resources using topological order based on parent-child relationships.
   * @param resources The array of nestable resources to sort.
   * @returns The sorted array of resources.
   */
  sort(resources: TStoryblokResource[]): TStoryblokResource[] {
    if (!resources || resources.length === 0) {
      return resources;
    }

    try {
      const idToResourceMap = new Map<string | number, TStoryblokResource>();
      resources.forEach((resource) =>
        idToResourceMap.set(resource.id, resource)
      );

      const parentDependencies: [number | string | null, number | string][] =
        resources.map((resource) => {
          if (this.parentField in resource && resource[this.parentField]) {
            return [resource[this.parentField] as number | string, resource.id];
          } else {
            return [null, resource.id];
          }
        });

      const sortedIds = toposort(parentDependencies).filter(
        (id) => id !== null
      );

      return sortedIds
        .map((id) => idToResourceMap.get(id))
        .filter((item) => item !== undefined);
    } catch (error) {
      throw new Error(
        `Topological sort failed: ${error instanceof Error ? error.message : String(error)}`
      );
    }
  }
}
