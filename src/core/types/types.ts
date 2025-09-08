export const ResourceType = {
  WEBHOOKS: "webhooks",
  ACCESS_TOKENS: "access-tokens",
  COLLABORATORS: "collaborators",
  COMPONENT_GROUPS: "component-groups",
  COMPONENTS: "components",
  DATASOURCES: "datasources",
  DATASOURCE_ENTRIES: "datasource-entries",
  ASSET_FOLDERS: "asset-folders",
  ASSETS: "assets",
  STORIES: "stories",
} as const;

export type ResourceType = (typeof ResourceType)[keyof typeof ResourceType];

/**
 * Options for restoring a single resource.
 * @member spaceId - The ID of the Storyblok space to restore the resource to.
 * @member backupPath - The path to the backup folder.
 */
export interface RestoreOptions {
  spaceId: string;
  backupPath: string;
}

/**
 * Represents a generic Storyblok resource.
 * Used as the base type for all resources handled by the restore system.
 *
 * @property id - The unique numeric ID of the resource.
 * @property uuid - The unique UUID of the resource.
 * @property publish - Optional publish status (0 or 1).
 * @property parent_id - Optional parent resource ID (for nestable resources).
 */
export interface StoryblokResource {
  id: number;
  uuid: string;
  publish?: 0 | 1;
  parent_id?: number | null;
  parent_uuid?: string | null;
}
