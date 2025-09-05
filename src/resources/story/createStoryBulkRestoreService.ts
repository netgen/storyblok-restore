import { FieldReplacerPreprocessor } from "../../bulk/processors/FieldReplacerPreprocessor";
import { ReferenceFixer } from "../../bulk/processors/ReferenceFixer";
import { StoryAssetFixerPreprocessor } from "../../bulk/processors/StoryAssetFixerPreprocessor";
import { BulkRestoreService } from "../../bulk/services/BulkRestore";
import { TopologicalSortStrategy } from "../../bulk/sorting/TopologicalSort";
import type { StoryblokResource } from "../../single/StoryblokResource";
import { StoryRestoreService } from "./StoryRestoreService";

export function createStoryBulkRestoreService() {
  return new BulkRestoreService<StoryblokResource>(
    new StoryRestoreService(),
    new TopologicalSortStrategy(),
    [
      new FieldReplacerPreprocessor({
        resourceField: "parent_id",
        contextStore: "oldIdToNewIdMap",
      }),
      new StoryAssetFixerPreprocessor(),
    ],
    new ReferenceFixer()
  );
}
