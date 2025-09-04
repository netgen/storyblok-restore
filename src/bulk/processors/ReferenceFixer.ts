import type { ResourcePostProcessor } from "../../single/processors/ResourcePostProcessor";
import type { StoryblokResource } from "../../single/StoryblokResource";
import type {
  BulkRestoreContext,
  BulkRestoreOptions,
} from "../../shared/types";

/**
 * Post-processor that fixes references between resources after bulk restore.
 * For each old-to-new UUID mapping, updates all referencing stories to use the new UUID.
 */
export class ReferenceFixer
  implements ResourcePostProcessor<StoryblokResource>
{
  /**
   * Updates references in all stories that point to old UUIDs, replacing them with new UUIDs.
   * @param _resources The array of restored resources (not used directly).
   * @param options The bulk restore options.
   * @param context The bulk restore context containing uuidMapping and apiClient.
   */
  async postProcess(
    _resources: StoryblokResource[],
    options: BulkRestoreOptions,
    context: BulkRestoreContext
  ): Promise<void> {
    const { apiClient, oldUuidToNewUuidMap: uuidMapping } = context;

    const failedFetchReferences: [string, unknown][] = [];
    let successfullyFetchedReferences = 0;
    let totalFetchedReferences = uuidMapping.size;

    console.log("Fixing references...");
    for (const [oldUuid, newUuid] of uuidMapping) {
      try {
        const referencingStories = await apiClient.getAll(
          `spaces/${options.spaceId}/stories`,
          {
            // @ts-expect-error TODO fix
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
            const fullStory = await apiClient.get(
              `spaces/${options.spaceId}/stories/${story.id}`
            );

            const updatedContent = JSON.parse(
              JSON.stringify(fullStory.data.story).replaceAll(oldUuid, newUuid)
            );

            await apiClient.put(
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
