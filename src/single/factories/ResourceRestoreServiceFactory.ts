import { AccessTokenRestoreService } from "../../resources/accessTokens/AccessTokenRestoreService.js";
import { AssetRestoreService } from "../../resources/asset/AssetRestoreService.js";
import { AssetFolderRestoreService } from "../../resources/assetFolder/AssetFolderRestoreService.js";
import { CollaboratorRestoreService } from "../../resources/collaborators/CollaboratorRestoreService.js";
import { ComponentRestoreService } from "../../resources/component/ComponentRestoreService.js";
import { ComponentGroupRestoreService } from "../../resources/componentGroup/ComponentGroupRestoreService.js";
import { DatasourceRestoreService } from "../../resources/datasource/DatasourceRestoreService.js";
import { DatasourceEntryRestoreService } from "../../resources/datasourceEntry/DatasourceEntryRestoreService.js";
import { StoryRestoreService } from "../../resources/story/StoryRestoreService.js";
import { WebhookRestoreService } from "../../resources/webhook/WebhookRestoreService.js";
import type { ResourceRestoreService } from "../services/ResourceRestoreService";

/**
 * Factory for selecting the appropriate ResourceRestoreService for a given resource type.
 */
export class ResourceRestoreServiceFactory {
  /**
   * @param services Array of available resource restore services.
   */
  constructor(private services: ResourceRestoreService<any>[]) {}

  /**
   * Returns the service that can restore the given resource type.
   * @param type The resource type (e.g., 'story').
   * @returns The matching ResourceRestoreService.
   * @throws If no service is found for the type.
   */
  getService(type: string): ResourceRestoreService<any> {
    const service = this.services.find((s) => s.canHandle(type));
    if (!service) throw new Error(`No service for type ${type}`);
    return service;
  }
}

export const resourceRestoreServiceFactory = new ResourceRestoreServiceFactory([
  new StoryRestoreService(),
  new AccessTokenRestoreService(),
  new AssetRestoreService(),
  new AssetFolderRestoreService(),
  new CollaboratorRestoreService(),
  new ComponentGroupRestoreService(),
  new ComponentRestoreService(),
  new DatasourceRestoreService(),
  new DatasourceEntryRestoreService(),
  new WebhookRestoreService(),
]);
