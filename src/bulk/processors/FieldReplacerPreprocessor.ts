import type { ContextStores, BulkRestoreContext } from "../../shared/types";
import type { ResourcePreprocessor } from "../../single/processors/ResourcePreproceossor";
import type { StoryblokResource } from "../../single/StoryblokResource";

/**
 * Preprocessor that updates a field of a resource using a context mapping.
 */
export class FieldReplacerPreprocessor<
  TResourceField extends string | number,
  TStoryblokResource extends StoryblokResource &
    Record<TResourceField, unknown> = StoryblokResource &
    Record<TResourceField, unknown>
> implements ResourcePreprocessor<TStoryblokResource>
{
  constructor(
    private readonly params: {
      resourceField: TResourceField;
      contextStore: keyof ContextStores;
    }
  ) {}

  /**
   * Updates the field of the resource if a new mapping exists.
   * @param resource The resource to preprocess.
   * @param context The bulk restore context containing the idMapping.
   * @returns The resource with updated field, or unchanged if no mapping is found.
   */
  preprocess(
    resource: TStoryblokResource,
    context: BulkRestoreContext
  ): TStoryblokResource {
    const field = this.params.resourceField;

    if (field in resource && resource[field]) {
      const newFieldValue = context[this.params.contextStore].get(
        resource[field] as never
      );

      if (newFieldValue) {
        return { ...resource, [field]: newFieldValue };
      }
    }
    return resource;
  }
}
