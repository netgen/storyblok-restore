import { BulkRestoreService } from "@/bulk/services/BulkRestore";
import type { StoryblokResource } from "@/single/StoryblokResource";
import { AssetFolderRestoreService } from "./AssetFolderRestoreService";
import { ParentIdPreprocessor } from "@/bulk/processors/ParentIdPreprocessor";
import { TopologicalSortStrategy } from "@/bulk/sorting/TopologicalSort";

export function createAssetFolderBulkRestoreService() {
  return new BulkRestoreService<StoryblokResource>(
    new AssetFolderRestoreService(),
    new TopologicalSortStrategy(),
    new ParentIdPreprocessor()
  );
}
