import type { RestoreOptions } from "../types/types";
import type { StoryblokResource } from "@core/types/types";
import type { ResourceMappingRegistry } from "./ResourceMappingRegistry";

/**
 * Interface for services that handle the restoration of Storyblok resources.
 * Defines the contract for creating and updating resources via the Storyblok API.
 *
 * @template T The type of Storyblok resource being restored.
 * @property canHandle - Whether the service can handle the given resource type.
 * @property restore - Method for restoring a single resource.
 */
export interface ResourceRestoreService<
  T extends StoryblokResource = StoryblokResource,
> {
  restore(
    resource: T,
    options: RestoreOptions,
    resourceMappingRegistry: ResourceMappingRegistry
  ): Promise<T>;
}
