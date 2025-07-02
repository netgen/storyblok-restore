import type { ResourcePostProcessor } from '../../single/processors/ResourcePostProcessor'
import type { StoryblokResource } from '../../single/StoryblokResource'
import type { BulkRestoreContext, BulkRestoreOptions } from '../../shared/types'

/**
 * Post-processor that fixes references between resources after bulk restore.
 * For each old-to-new UUID mapping, updates all referencing stories to use the new UUID.
 */
export class ReferenceFixer implements ResourcePostProcessor<StoryblokResource> {
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
		const { apiClient, oldUuidToNewUuidMap: uuidMapping } = context

		for (const [oldUuid, newUuid] of uuidMapping) {
			const referencingStories = await apiClient.getAll(`spaces/${options.spaceId}/stories`, {
				// @ts-expect-error TODO fix
				reference_search: oldUuid,
			})

			for (const story of referencingStories) {
				const fullStory = await apiClient.get(
					`spaces/${options.spaceId}/stories/${story.id}`
				)

				const updatedContent = JSON.parse(
					JSON.stringify(fullStory.data.story).replaceAll(oldUuid, newUuid)
				)

				await apiClient.put(`spaces/${options.spaceId}/stories/${story.id}`, {
					story: updatedContent,
				})
			}
		}
	}
}
