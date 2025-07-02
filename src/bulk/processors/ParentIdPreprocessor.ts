import type { ResourcePreprocessor } from '../../single/processors/ResourcePreproceossor'
import type { StoryblokResource } from '../../single/StoryblokResource'
import type { BulkRestoreContext } from '../../shared/types'

/**
 * Preprocessor that updates the parent_id of a resource using the current idMapping in the bulk restore context.
 * Used to ensure parent-child relationships are correctly restored with new IDs.
 */
export class ParentIdPreprocessor implements ResourcePreprocessor<StoryblokResource> {
	/**
	 * Updates the parent_id of the resource if a new parent ID mapping exists.
	 * @param resource The resource to preprocess.
	 * @param context The bulk restore context containing the idMapping.
	 * @returns The resource with updated parent_id, or unchanged if no mapping is found.
	 */
	preprocess(resource: StoryblokResource, context: BulkRestoreContext): StoryblokResource {
		if ('parent_id' in resource && resource.parent_id) {
			const newParentId = context.oldIdToNewIdMap.get(resource.parent_id)
			console.log('parent_id', resource.parent_id, newParentId)
			if (newParentId) {
				return { ...resource, parent_id: newParentId }
			}
		}
		return resource
	}
}
