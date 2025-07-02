import StoryblokClient from "storyblok-js-client";

/**
 * Context for single resource restore operations.
 * Contains the API client and any other shared state needed for a single restore.
 */
export interface RestoreContext {
  apiClient: StoryblokClient;
}

/**
 * Context for bulk restore operations.
 * Extends RestoreContext with ID and UUID mappings for tracking old-to-new resource relationships.
 * @member oldIdToNewIdMap - Map of old IDs to new IDs.
 * @member oldUuidToNewUuidMap - Map of old UUIDs to new UUIDs.
 */
export interface BulkRestoreContext extends RestoreContext {
  oldIdToNewIdMap: Map<number, number>;
  oldUuidToNewUuidMap: Map<string, string>;
}

/**
 * Options for restoring a single resource.
 * @member publish - Whether to publish the resource.
 * @member create - Whether to create the resource if it doesn't exist.
 * @member forceUpdate - Whether to force update the resource even if it already exists.
 * @member spaceId - The ID of the Storyblok space to restore the resource to.
 */
export interface RestoreOptions {
  publish?: boolean;
  create?: boolean;
  forceUpdate?: boolean;
  spaceId: string;
}

/**
 * Options for bulk restore operations.
 * Extends RestoreOptions with additional options for bulk operations.
 * @member baseFolder - The base folder containing the resource JSON files.
 */
export interface BulkRestoreOptions extends RestoreOptions {
  baseFolder?: string;
}
