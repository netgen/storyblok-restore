import fs from "fs";
import path from "path";
import type { Context } from "../types/context";
import { ResourceMappingRegistry } from "./ResourceMappingRegistry";
import type { ResourceCollectionRestoreServiceFactory } from "../factories/ResourceCollectionRestoreServiceFactory";
import type { ResourceType, RestoreOptions } from "../types/types";

const RESOURCE_ORDER: ResourceType[] = [
  "webhooks",
  "access-tokens",
  "component-groups",
  "components",
  "datasources",
  "datasource-entries",
  "asset-folders",
  "assets",
  "stories",
];

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
}
