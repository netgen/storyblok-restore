import { DatasourceEntryDatasourceIdPreprocessor } from "../../bulk/processors/DatasourceEntryDatasourceIdPreprocessor";
import { BulkRestoreService } from "../../bulk/services/BulkRestore";
import { TopologicalSortStrategy } from "../../bulk/sorting/TopologicalSort";
import type { StoryblokResource } from "../../single/StoryblokResource";
import { DatasourceEntryRestoreService } from "./DatasourceEntryRestoreService";

export function createDatasourceEntryBulkRestoreService() {
  return new BulkRestoreService<StoryblokResource>(
    new DatasourceEntryRestoreService(),
    new TopologicalSortStrategy(),
    new DatasourceEntryDatasourceIdPreprocessor()
  );
}
