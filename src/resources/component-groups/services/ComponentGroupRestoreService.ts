import type { RestoreOptions } from "@core/types/types";
import { BaseResourceRestoreService } from "@core/services/BaseRestoreService";
import type { StoryblokResource } from "@core/types/types";
import type { ISbResponse } from "storyblok-js-client";

interface ComponentGroupResource extends StoryblokResource {
  name: string;
}

/**
 * Resource restore service for Storyblok component groups.
 * Implements URL and parameter construction for component groups.
 */
export class ComponentGroupRestoreService extends BaseResourceRestoreService<ComponentGroupResource> {
  getCreateUrl(
    _resource: ComponentGroupResource,
    options: RestoreOptions
  ): string {
    return `spaces/${options.spaceId}/component_groups`;
  }

  getUpdateUrl(
    resource: ComponentGroupResource,
    options: RestoreOptions
  ): string {
    return `spaces/${options.spaceId}/component_groups/${resource.id}`;
  }

  getResourceIdentifier(resource: ComponentGroupResource): string {
    return resource.id.toString();
  }

  getResourceType(): string {
    return "component group";
  }

  async findExistingResource(
    resource: ComponentGroupResource,
    options: RestoreOptions
  ): Promise<ComponentGroupResource | null> {
    const response = await this.context.apiClient.get(
      `spaces/${options.spaceId}/component_groups`,
      {
        search: resource.name,
      }
    );
    return response.data?.component_groups?.[0] || null;
  }

  getParams(resource: ComponentGroupResource) {
    return {
      component_group: resource,
    };
  }

  getResponseData(response: ISbResponse): ComponentGroupResource {
    return response.data.component_group;
  }

  handleError(error: unknown): never {
    const message =
      typeof error === "object" && error !== null && "message" in error
        ? error.message
        : String(error);

    throw new Error(`Component group restoration failed: ${message}`);
  }
}
