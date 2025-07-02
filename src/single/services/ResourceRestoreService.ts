import type { StoryblokResource } from '../StoryblokResource'
import type { RestoreContext, RestoreOptions } from '../../shared/types'

/**
 * Interface for services that handle the restoration of Storyblok resources.
 * Defines the contract for creating and updating resources via the Storyblok API.
 *
 * @template T The type of Storyblok resource being restored.
 * @property canHandle - Whether the service can handle the given resource type.
 * @property restore - Method for restoring a single resource.
 * @property getCreateUrl - Method for getting the URL to create a new resource.
 * @property getUpdateUrl - Method for getting the URL to update an existing resource.
 */
export interface ResourceRestoreService<T extends StoryblokResource> {
	canHandle(type: string): boolean
	restore(resource: T, options: RestoreOptions, context: RestoreContext): Promise<T>
	getCreateUrl(resource: T, options: RestoreOptions): string
	getUpdateUrl(resource: T, options: RestoreOptions): string
}
