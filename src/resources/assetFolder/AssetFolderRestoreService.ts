import type { RestoreOptions } from "../../shared/types";
import { BaseResourceRestoreService } from "../../single/services/BaseRestoreService";
import type { StoryblokResource } from "../../single/StoryblokResource";
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

  getUpdateUrl(resource: StoryblokResource, options: RestoreOptions): string {
    return `spaces/${options.spaceId}/asset_folders/${resource.id}`;
  }

  getParams(resource: StoryblokResource) {
    return {
      asset_folder: resource,
    };
  }

  getResponseData(response: ISbResponse): StoryblokResource {
    return response.data.asset_folder;
  }
}
