import { createAccessTokenBulkRestoreService } from "../../resources/accessTokens/createAccessTokenBulkRestoreService";
import { createAssetBulkRestoreService } from "../../resources/asset/createAssetFolderBulkRestoreService";
import { createAssetFolderBulkRestoreService } from "../../resources/assetFolder/createAssetFolderBulkRestoreService";
import { createCollaboratorBulkRestoreService } from "../../resources/collaborators/createCollaboratorBulkRestoreService";
import { createComponentBulkRestoreService } from "../../resources/component/createComponentBulkRestoreService";
import { createComponentGroupBulkRestoreService } from "../../resources/componentGroup/createComponentGroupBulkRestoreService";
import { createDatasourceBulkRestoreService } from "../../resources/datasource/createDatasourceBulkRestoreService";
import { createDatasourceEntryBulkRestoreService } from "../../resources/datasourceEntry/createDatasourceEntryBulkRestoreService";
import { createStoryBulkRestoreService } from "../../resources/story/createStoryBulkRestoreService";
import { createWebhookBulkRestoreService } from "../../resources/webhook/createWebhookBulkRestoreService";
import type { BulkRestoreService } from "../services/BulkRestore";

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
  { type: "assets", create: createAssetBulkRestoreService },
  { type: "access-tokens", create: createAccessTokenBulkRestoreService },
  { type: "collaborators", create: createCollaboratorBulkRestoreService },
  { type: "component-groups", create: createComponentGroupBulkRestoreService },
  { type: "components", create: createComponentBulkRestoreService },
  { type: "webhooks", create: createWebhookBulkRestoreService },
  { type: "datasources", create: createDatasourceBulkRestoreService },
  {
    type: "datasource-entries",
    create: createDatasourceEntryBulkRestoreService,
  },
]);
