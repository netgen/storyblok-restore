import type { ResourceCollectionPostprocessor } from "@core/processors/ResourceCollectionPostprocessor";
import type { RestoreOptions, StoryblokResource } from "@core/types/types";
import type { ResourceMappingRegistry } from "@core/services/ResourceMappingRegistry";
import type { Context } from "@core/types/context";

/**
 * Post-processor that fixes references between resources after bulk restore.
 * For each old-to-new UUID mapping, updates all referencing stories to use the new UUID.
 */
export class StoryReferenceFixerResourceCollectionPostprocessor
  implements ResourceCollectionPostprocessor<StoryblokResource>
{
  constructor(private context: Context) {}
  /**
   * Updates references in all stories that point to old UUIDs, replacing them with new UUIDs.
   * @param _resources The array of restored resources (not used directly).
   * @param options The bulk restore options.
   * @param resourceMappingRegistry The bulk restore resourceMappingRegistry containing uuidMapping and this.context.apiClient.
   */
  async postProcess(
    _resources: StoryblokResource[],
    options: RestoreOptions,
    resourceMappingRegistry: ResourceMappingRegistry
  ): Promise<void> {
    const { oldUuidToNewUuidMap } = resourceMappingRegistry.get("stories");

    const failedFetchReferences: [string, unknown][] = [];
    let successfullyFetchedReferences = 0;
    let totalFetchedReferences = oldUuidToNewUuidMap.size;

    console.log("Fixing references...");
    for (const [oldUuid, newUuid] of oldUuidToNewUuidMap) {
      try {
        const referencingStories = await this.context.apiClient.getAll(
          `spaces/${options.spaceId}/stories`,
          {
            // @ts-expect-error TODO fix types
            reference_search: oldUuid,
          }
        );

        let successfullyFixedReferences = 0;
        const failedFixedReferences: [string, unknown][] = [];
        let totalFixedReferences = referencingStories.length;

        console.log(
          `Fixing ${totalFixedReferences} references for ${oldUuid} -> ${newUuid}`
        );

        for (const story of referencingStories) {
          try {
            const fullStory = await this.context.apiClient.get(
              `spaces/${options.spaceId}/stories/${story.id}`
            );

            const updatedContent = JSON.parse(
              JSON.stringify(fullStory.data.story).replaceAll(oldUuid, newUuid)
            );

            await this.context.apiClient.put(
              `spaces/${options.spaceId}/stories/${story.id}`,
              {
                story: updatedContent,
              }
            );

            successfullyFixedReferences++;
            console.log(
              `Successfully fixed ${successfullyFixedReferences}/${totalFixedReferences} references`
            );
          } catch (error) {
            console.error(`Failed to fix reference: ${oldUuid} -> ${newUuid}`);
            failedFixedReferences.push([oldUuid, error]);
          }
        }

        if (failedFixedReferences.length > 0) {
          console.error(
            `Failed to fix ${failedFixedReferences.length} references:`
          );
          for (const [reference, error] of failedFixedReferences) {
            console.error(`Failed to fix reference: ${reference}`, error);
          }
        }

        successfullyFetchedReferences++;
        console.log(
          `Successfully fetched ${successfullyFetchedReferences}/${totalFetchedReferences} references`
        );
      } catch (error) {
        console.error(`Failed to fetch reference: ${oldUuid} -> ${newUuid}`);
        failedFetchReferences.push([oldUuid, error]);
      }
    }

    if (failedFetchReferences.length > 0) {
      console.error(
        `Failed to fetch ${failedFetchReferences.length} references:`
      );
      for (const [reference, error] of failedFetchReferences) {
        console.error(`Failed to fetch reference: ${reference}`, error);
      }
    }
  }
}
