import type { StoryblokResource } from '../StoryblokResource'
import type { BulkRestoreContext } from '../../shared/types'

/**
 * Interface for resource preprocessors used in bulk restore.
 * Preprocessors can mutate or prepare resources before they are restored (e.g., update parent IDs).
 */
export interface ResourcePreprocessor<T extends StoryblokResource> {
	/**
	 * Preprocess a resource before restore.
	 * @param resource The resource to preprocess.
	 * @param context The bulk restore context.
	 * @returns The preprocessed resource.
	 */
	preprocess(resource: T, context: BulkRestoreContext): T
}
