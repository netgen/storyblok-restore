import { glob } from "glob";
import { fileURLToPath } from "url";
import { dirname, join } from "path";
import type { Context } from "../types/context";
import type { ResourceType } from "../types/types";
import type { ResourceRestoreService } from "../services/ResourceRestoreService";
import { logger } from "@shared/logging";

type ResourceRestoreServiceCreator = {
  resourceType: ResourceType;
  create: (ctx: Context) => ResourceRestoreService;
};

export class ResourceRestoreServiceFactory {
  constructor(private services: ResourceRestoreServiceCreator[]) {}

  static async create() {
    const __filename = fileURLToPath(import.meta.url);
    const __dirname = dirname(__filename);
    const resourcesDir = join(__dirname, "../../resources");
    const ext = __filename.endsWith(".ts") ? ".ts" : ".js";
    const serviceFiles = (
      await glob(join(resourcesDir, `**/*RestoreService${ext}`))
    ).filter((file) => !file.endsWith(`ResourceCollectionRestoreService${ext}`));

    logger.debug("ResourceRestore service files", serviceFiles);

    const creators = await Promise.all(
      serviceFiles.map(async (file) => {
        const module = await import(file);
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

    logger.debug("ResourceRestore service creators", creators);

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
