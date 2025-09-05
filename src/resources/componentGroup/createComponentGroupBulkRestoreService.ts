import { FieldReplacerPreprocessor } from "../../bulk/processors/FieldReplacerPreprocessor";
import { BulkRestoreService } from "../../bulk/services/BulkRestore";
import { TopologicalSortStrategy } from "../../bulk/sorting/TopologicalSort";
import type { StoryblokResource } from "../../single/StoryblokResource";
import { ComponentGroupRestoreService } from "./ComponentGroupRestoreService";

export function createComponentGroupBulkRestoreService() {
  return new BulkRestoreService<StoryblokResource>(
    new ComponentGroupRestoreService(),
    new TopologicalSortStrategy(),
    new FieldReplacerPreprocessor({
      resourceField: "parent_id",
      contextStore: "oldIdToNewIdMap",
    })
  );
}
