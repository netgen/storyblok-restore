import { glob } from "glob";
import path from "path";
import type { Context } from "../types/context";
import type { ResourceType } from "../types/types";
import type { ResourceRestoreService } from "../services/ResourceRestoreService";

type ResourceRestoreServiceCreator = {
  resourceType: ResourceType;
  create: (ctx: Context) => ResourceRestoreService;
};

export class ResourceRestoreServiceFactory {
  constructor(private services: ResourceRestoreServiceCreator[]) {}

  static async create() {
    const serviceFiles = (
      await glob("@resources/**/*RestoreService.ts")
    ).filter((file) => !file.endsWith("ResourceCollectionRestoreService.ts"));

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

    return new ResourceRestoreServiceFactory(creators);
  }

  getServiceForType(
    context: Context,
    resourceType: ResourceType
  ): ResourceRestoreService {
    const service = this.services.find((s) => s.resourceType === resourceType);
    if (!service)
      throw new Error(`No restore service for resource type: ${resourceType}`);
    return service.create(context);
  }
}
