import type { BulkRestoreService } from "../services/BulkRestore";
import { createAssetFolderBulkRestoreService } from "../../resources/assetFolder/createAssetFolderBulkRestoreService";
import { createStoryBulkRestoreService } from "../../resources/story/createStoryBulkRestoreService";
import { createAccessTokenBulkRestoreService } from "../../resources/accessTokens/createAccessTokenBulkRestoreService";
import { createCollaboratorBulkRestoreService } from "../../resources/collaborators/createCollaboratorBulkRestoreService";
import { createComponentGroupBulkRestoreService } from "../../resources/componentGroup/createComponentGroupBulkRestoreService";
import { createComponentBulkRestoreService } from "../../resources/component/createComponentBulkRestoreService";

export class BulkRestoreServiceFactory {
  constructor(
    private creators: { type: string; create: () => BulkRestoreService<any> }[]
  ) {}

  getServiceForType(type: string): BulkRestoreService<any> {
    const entry = this.creators.find((c) => c.type === type);
    if (!entry) throw new Error(`No BulkRestoreService for type: ${type}`);
    return entry.create();
  }

  getServices(): BulkRestoreService<any>[] {
    return this.creators.map((c) => c.create());
  }
}

export const bulkRestoreServiceFactory = new BulkRestoreServiceFactory([
  { type: "stories", create: createStoryBulkRestoreService },
  { type: "asset-folders", create: createAssetFolderBulkRestoreService },
  { type: "access-tokens", create: createAccessTokenBulkRestoreService },
  { type: "collaborators", create: createCollaboratorBulkRestoreService },
  { type: "component-groups", create: createComponentGroupBulkRestoreService },
  { type: "components", create: createComponentBulkRestoreService },
]);
