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
