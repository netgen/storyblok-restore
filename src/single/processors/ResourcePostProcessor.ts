import type { StoryblokResource } from '../StoryblokResource'
import type { BulkRestoreContext, BulkRestoreOptions } from '../../shared/types'

/**
 * Interface for post-processors used after bulk restore.
 * Post-processors can perform actions such as fixing references after all resources are restored.
 */
export interface ResourcePostProcessor<T extends StoryblokResource> {
	/**
	 * Post-process resources after restore.
	 * @param resources The array of restored resources.
	 * @param options The bulk restore options.
	 * @param context The bulk restore context.
	 */
	postProcess(
		resources: T[],
		options: BulkRestoreOptions,
		context: BulkRestoreContext
	): Promise<void>
}
