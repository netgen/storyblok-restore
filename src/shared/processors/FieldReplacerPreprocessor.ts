import type { ResourcePreprocessor } from "@core/processors/ResourcePreproceossor";
import type { ResourceType, StoryblokResource } from "@core/types/types";
import type {
  ResourceMappingData,
  ResourceMappingRegistry,
} from "@core/services/ResourceMappingRegistry";

/**
 * Preprocessor that updates a field of a resource using a resourceMappingRegistry mapping.
 */
export class FieldReplacerPreprocessor<
  TResourceField extends string | number,
  TStoryblokResource extends StoryblokResource &
    Record<TResourceField, unknown> = StoryblokResource &
    Record<TResourceField, unknown>,
> implements ResourcePreprocessor<TStoryblokResource>
{
  constructor(
    private readonly params: {
      contextStore: ResourceType;
      resourceField: TResourceField;
      contextStoreItem: keyof ResourceMappingData;
    }
  ) {}

  /**
   * Updates the field of the resource if a new mapping exists.
   * @param resource The resource to preprocess.
   * @param resourceMappingRegistry The bulk restore resourceMappingRegistry containing the idMapping.
   * @returns The resource with updated field, or unchanged if no mapping is found.
   */
  preprocess(
    resource: TStoryblokResource,
    resourceMappingRegistry: ResourceMappingRegistry
  ): TStoryblokResource {
    const selectedContextStore = resourceMappingRegistry.get(
      this.params.contextStore
    );
    const field = this.params.resourceField;

    if (field in resource && resource[field]) {
      const newFieldValue = selectedContextStore[
        this.params.contextStoreItem
      ].get(
        resource[field] as never // TODO fix type
      );

      if (newFieldValue !== undefined) {
        return { ...resource, [field]: newFieldValue };
      }
    }
    return resource;
  }
}
