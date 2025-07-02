import { ParentIdPreprocessor } from "@/bulk/processors/ParentIdPreprocessor";
import { ReferenceFixer } from "@/bulk/processors/ReferenceFixer";
import { BulkRestoreService } from "@/bulk/services/BulkRestore";
import { TopologicalSortStrategy } from "@/bulk/sorting/TopologicalSort";
import type { StoryblokResource } from "@/single/StoryblokResource";
import { StoryRestoreService } from "./StoryRestoreService";

export function createStoryBulkRestoreService() {
  return new BulkRestoreService<StoryblokResource>(
    new StoryRestoreService(),
    new TopologicalSortStrategy(),
    new ParentIdPreprocessor(),
    new ReferenceFixer()
  );
}
