import { ComponentGroupUuidPreprocessor } from "../../bulk/processors/ComponentGroupUuidPreprocessor";
import { BulkRestoreService } from "../../bulk/services/BulkRestore";
import { TopologicalSortStrategy } from "../../bulk/sorting/TopologicalSort";
import type { StoryblokResource } from "../../single/StoryblokResource";
import { ComponentRestoreService } from "./ComponentRestoreService";

export function createComponentBulkRestoreService() {
  return new BulkRestoreService<StoryblokResource>(
    new ComponentRestoreService(),
    new TopologicalSortStrategy(),
    new ComponentGroupUuidPreprocessor()
  );
}
