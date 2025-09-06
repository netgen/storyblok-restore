import { glob } from "glob";
import path from "path";
import type { Context } from "../types/context";
import type { ResourceCollectionRestoreService } from "../services/ResourceCollectionRestoreService";
import type { ResourceType } from "../types/types";
import { logger } from "@shared/logging";

type ResourceCollectionRestoreServiceCreator = {
  resourceType: ResourceType;
  create: (ctx: Context) => ResourceCollectionRestoreService;
};

export class ResourceCollectionRestoreServiceFactory {
  constructor(private services: ResourceCollectionRestoreServiceCreator[]) {}

  static async create() {
    const serviceFiles = await glob(
      "src/resources/**/*ResourceCollectionRestoreService.ts"
    );

    logger.debug("ResourceCollectionRestore service files", serviceFiles);

    const creators = await Promise.all(
      serviceFiles.map(async (file) => {
        const module = await import(path.resolve(file));
        const ServiceClass = module.default;

        const resourceType = ServiceClass.RESOURCE_TYPE;

        if (!resourceType) {
          throw new Error(
            `Service ${file} is missing required RESOURCE_TYPE property`
          );
        }

        return {
          resourceType,
          create: (ctx: Context) => new ServiceClass(ctx),
        };
      })
    );

    logger.debug("ResourceCollectionRestore service creators", creators);

    return new ResourceCollectionRestoreServiceFactory(creators);
  }

  getServiceForType(
    context: Context,
    resourceType: ResourceType
  ): ResourceCollectionRestoreService {
    const service = this.services.find((s) => s.resourceType === resourceType);
    if (!service)
      throw new Error(
        `No bulk restore service for resource type: ${resourceType}`
      );
    return service.create(context);
  }
}
