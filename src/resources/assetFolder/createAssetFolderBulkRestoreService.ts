import { BulkRestoreService } from "../../bulk/services/BulkRestore";
import type { StoryblokResource } from "../../single/StoryblokResource";
import { AssetFolderRestoreService } from "./AssetFolderRestoreService";
import { TopologicalSortStrategy } from "../../bulk/sorting/TopologicalSort";
import { FieldReplacerPreprocessor } from "../../bulk/processors/FieldReplacerPreprocessor";

export function createAssetFolderBulkRestoreService() {
  return new BulkRestoreService<StoryblokResource>(
    new AssetFolderRestoreService(),
    new TopologicalSortStrategy(),
    new FieldReplacerPreprocessor({
      resourceField: "parent_id",
      contextStore: "oldIdToNewIdMap",
    })
  );
}
