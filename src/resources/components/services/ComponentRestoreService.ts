import type { RestoreOptions } from "@core/types/types";
import { BaseResourceRestoreService } from "@core/services/BaseRestoreService";
import type { StoryblokResource } from "@core/types/types";
import type { ISbResponse } from "storyblok-js-client";

interface ComponentResource extends StoryblokResource {
  name: string;
}

/**
 * Resource restore service for Storyblok components.
 * Implements URL and parameter construction for components.
 */
export class ComponentRestoreService extends BaseResourceRestoreService<ComponentResource> {
  getCreateUrl(_resource: ComponentResource, options: RestoreOptions): string {
    return `spaces/${options.spaceId}/components`;
  }

  getParams(resource: ComponentResource) {
    return {
      component: resource,
    };
  }

  getUpdateUrl(resource: ComponentResource, options: RestoreOptions): string {
    return `spaces/${options.spaceId}/components/${resource.id}`;
  }

  getResourceType(): string {
    return "component";
  }

  protected async findExistingResource(
    resource: ComponentResource,
    options: RestoreOptions
  ): Promise<ComponentResource | null> {
    const response = await this.context.apiClient.get(
      `spaces/${options.spaceId}/components`,
      {
        search: resource.name,
      }
    );
    return response.data?.components?.[0] || null;
  }

  getResponseData(response: ISbResponse): ComponentResource {
    return response.data.component;
  }

  handleError(error: unknown): never {
    const message =
      typeof error === "object" && error !== null && "message" in error
        ? error.message
        : String(error);

    throw new Error(`Component restoration failed: ${message}`);
  }
}
