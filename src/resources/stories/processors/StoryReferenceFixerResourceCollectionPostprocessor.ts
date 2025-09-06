import type { ResourceCollectionPostprocessor } from "@core/processors/ResourceCollectionPostprocessor";
import type { RestoreOptions, StoryblokResource } from "@core/types/types";
import type { ResourceMappingRegistry } from "@core/services/ResourceMappingRegistry";
import type { Context } from "@core/types/context";
import { logger } from "@shared/logging";

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

    logger.info("\n🔗 Starting story reference fixing process");
    logger.debug("UUID mappings to process:", {
      totalMappings: oldUuidToNewUuidMap.size,
      mappings: Array.from(oldUuidToNewUuidMap.entries()).map(
        ([old, newUuid]) => ({
          oldUuid: old,
          newUuid: newUuid,
        })
      ),
    });

    const failedFetchReferences: [string, unknown][] = [];
    let successfullyFetchedReferences = 0;
    let totalFetchedReferences = oldUuidToNewUuidMap.size;

    logger.info(`Processing ${totalFetchedReferences} UUID mappings...`);
    for (const [oldUuid, newUuid] of oldUuidToNewUuidMap) {
      try {
        logger.debug(`Searching for stories referencing UUID: ${oldUuid}`);
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

        logger.info(
          `\n🔍 Found ${totalFixedReferences} stories referencing ${oldUuid} -> ${newUuid}`
        );
        logger.debug(
          `Referencing stories:`,
          referencingStories.map((s) => ({ id: s.id, name: s.name }))
        );

        for (const story of referencingStories) {
          try {
            logger.debug(`Fetching full story data for story ${story.id}`);
            const fullStory = await this.context.apiClient.get(
              `spaces/${options.spaceId}/stories/${story.id}`
            );

            logger.debug(
              `Updating story ${story.id} content: replacing ${oldUuid} with ${newUuid}`
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
            logger.info(
              `✅ Fixed story ${story.id} (${successfullyFixedReferences}/${totalFixedReferences})`
            );
          } catch (error) {
            logger.error(
              `❌ Failed to fix story ${story.id}: ${oldUuid} -> ${newUuid}`
            );
            logger.debug(`Error details for story ${story.id}:`, error);
            failedFixedReferences.push([oldUuid, error]);
          }
        }

        if (failedFixedReferences.length > 0) {
          logger.warn(
            `⚠️ Failed to fix ${failedFixedReferences.length} references for ${oldUuid}:`
          );
          for (const [reference, error] of failedFixedReferences) {
            logger.error(`  - Failed to fix reference: ${reference}`, error);
          }
        }

        successfullyFetchedReferences++;
        logger.info(
          `📊 Completed UUID mapping ${successfullyFetchedReferences}/${totalFetchedReferences}: ${oldUuid} -> ${newUuid}`
        );
      } catch (error) {
        logger.error(
          `❌ Failed to fetch references for ${oldUuid} -> ${newUuid}`
        );
        logger.debug(`Error details for UUID ${oldUuid}:`, error);
        failedFetchReferences.push([oldUuid, error]);
      }
    }

    if (failedFetchReferences.length > 0) {
      logger.error(
        `\n❌ Failed to fetch ${failedFetchReferences.length} UUID mappings:`
      );
      for (const [reference, error] of failedFetchReferences) {
        logger.error(`  - Failed to fetch reference: ${reference}`, error);
      }
    }

    logger.info(`\n🎉 Story reference fixing completed!`);
    logger.info(
      `📈 Summary: ${successfullyFetchedReferences}/${totalFetchedReferences} UUID mappings processed`
    );
    if (failedFetchReferences.length > 0) {
      logger.warn(
        `⚠️ ${failedFetchReferences.length} UUID mappings failed to process`
      );
    }
  }
}
