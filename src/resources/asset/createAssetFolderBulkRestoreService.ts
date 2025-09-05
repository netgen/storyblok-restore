import { AssetFolderIdPreprocessor } from "../../bulk/processors/AssetFolderIdPreprocessor";
import { BulkRestoreService } from "../../bulk/services/BulkRestore";
import type { StoryblokResource } from "../../single/StoryblokResource";
import { AssetRestoreService } from "./AssetRestoreService";

export function createAssetBulkRestoreService() {
  return new BulkRestoreService<StoryblokResource>(
    new AssetRestoreService(),
    undefined,
    new AssetFolderIdPreprocessor()
  );
}
