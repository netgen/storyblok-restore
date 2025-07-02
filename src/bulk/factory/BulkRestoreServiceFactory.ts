import type { BulkRestoreService } from "@/bulk/services/BulkRestore";
import { createAssetFolderBulkRestoreService } from "@/resources/assetFolder/createAssetFolderBulkRestoreService";
import { createStoryBulkRestoreService } from "@/resources/story/createStoryBulkRestoreService";

export class BulkRestoreServiceFactory {
  constructor(
    private creators: { type: string; create: () => BulkRestoreService<any> }[]
  ) {}

  getServiceForType(type: string): BulkRestoreService<any> {
    const entry = this.creators.find((c) => c.type === type);
    if (!entry) throw new Error(`No BulkRestoreService for type: ${type}`);
    return entry.create();
  }
}

export const bulkRestoreServiceFactory = new BulkRestoreServiceFactory([
  { type: "stories", create: createStoryBulkRestoreService },
  { type: "asset-folders", create: createAssetFolderBulkRestoreService },
]);
