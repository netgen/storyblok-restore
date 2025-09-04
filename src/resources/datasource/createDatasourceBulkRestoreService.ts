import { BulkRestoreService } from "../../bulk/services/BulkRestore";
import type { StoryblokResource } from "../../single/StoryblokResource";
import { DatasourceRestoreService } from "./DatasourceRestoreService";

export function createDatasourceBulkRestoreService() {
  return new BulkRestoreService<StoryblokResource>(
    new DatasourceRestoreService()
  );
}
