import { logger } from "@shared/logging";
import fs from "fs";
import path from "path";
import type { ISbStoriesParams } from "storyblok-js-client";
import type { ResourceCollectionRestoreServiceFactory } from "../factories/ResourceCollectionRestoreServiceFactory";
import type { Context } from "../types/context";
import { ResourceType, type RestoreOptions } from "../types/types";
import { ResourceMappingRegistry } from "./ResourceMappingRegistry";

const RESOURCE_ORDER = Object.values(ResourceType);

export class SpaceRestoreService {
  private resourceMappingRegistry: ResourceMappingRegistry =
    new ResourceMappingRegistry();
  private restoreTypes: ResourceType[];

  constructor(
    private resourceCollectionRestoreServiceFactory: ResourceCollectionRestoreServiceFactory,
    private context: Context,
    resourceTypes?: ResourceType[]
  ) {
    this.restoreTypes = this.sortResourceTypes(resourceTypes);
  }

  async restore(options: RestoreOptions) {
    this.restoreSpaceSettings(options);

    for (const resourceType of this.restoreTypes) {
      const folder = path.join(options.backupPath, resourceType);
      if (!fs.existsSync(folder)) continue;

      const resources = this.loadResources(folder);
      this.resourceMappingRegistry.init(resourceType);

      const resourceCollectionRestoreService =
        this.resourceCollectionRestoreServiceFactory.getServiceForType(
          this.context,
          resourceType
        );

      await resourceCollectionRestoreService.restore(
        resources,
        options,
        this.resourceMappingRegistry
      );
    }
  }

  private loadResources(folder: string): any[] {
    return fs
      .readdirSync(folder)
      .filter((f) => f.endsWith(".json"))
      .map((f) => JSON.parse(fs.readFileSync(path.join(folder, f), "utf8")));
  }

  private sortResourceTypes(resourceTypes?: ResourceType[]): ResourceType[] {
    if (!resourceTypes || resourceTypes.length === 0) {
      return RESOURCE_ORDER;
    }

    return RESOURCE_ORDER.filter((resourceType) =>
      resourceTypes.includes(resourceType)
    );
  }

  private async restoreSpaceSettings(options: RestoreOptions) {
    const spaceConfigFilename =
      fs
        .readdirSync(options.backupPath)
        .find((f) => /^space-\d+\.json$/.test(f)) || "";
    const spaceConfigFilePath = path.join(
      options.backupPath,
      spaceConfigFilename
    );

    if (!fs.existsSync(spaceConfigFilePath)) {
      logger.warn(`No space configuration file found: ${spaceConfigFilePath}`);
      return;
    }

    const spaceData = JSON.parse(fs.readFileSync(spaceConfigFilePath, "utf8"));

    const spaceWithChangedName = {
      ...spaceData,
      name: spaceData.name + " - Restored",
    };

    try {
      await this.context.apiClient.put(`spaces/${options.spaceId}`, {
        space: spaceWithChangedName,
      } as ISbStoriesParams);
    } catch (error) {
      logger.error(`Failed to restore space settings: ${error}`);
      throw new Error(`Failed to restore space settings: ${error}`);
    }
  }
}
