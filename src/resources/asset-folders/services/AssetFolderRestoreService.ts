import type { RestoreOptions } from "@core/types/types";
import { BaseResourceRestoreService } from "@core/services/BaseRestoreService";
import type { StoryblokResource } from "@core/types/types";
import type { ISbResponse } from "storyblok-js-client";

/**
 * Resource restore service for Storyblok asset folders.
 * Implements URL and parameter construction for asset folders.
 */
export class AssetFolderRestoreService extends BaseResourceRestoreService<StoryblokResource> {
  canHandle(type: string) {
    return type === "asset-folder";
  }

  getCreateUrl(_resource: StoryblokResource, options: RestoreOptions): string {
    return `spaces/${options.spaceId}/asset_folders`;
  }

  getParams(resource: StoryblokResource) {
    return {
      asset_folder: resource,
    };
  }

  getResponseData(response: ISbResponse): StoryblokResource {
    return response.data.asset_folder;
  }

  handleError(error: unknown): never {
    const message =
      typeof error === "object" && error !== null && "message" in error
        ? error.message
        : String(error);

    throw new Error(`Failed to restore asset folder: ${message}`);
  }
}
