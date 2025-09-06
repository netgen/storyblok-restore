import { glob } from "glob";
import path from "path";
import type { Context } from "../types/context";
import type { ResourceCollectionRestoreService } from "../services/ResourceCollectionRestoreService";
import type { ResourceType } from "../types/types";

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

    console.log("Service files", serviceFiles); // LOGGER

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

    console.log("Creators", creators); // LOGGER

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
