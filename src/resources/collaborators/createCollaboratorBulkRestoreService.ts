import { BulkRestoreService } from "../../bulk/services/BulkRestore";
import type { StoryblokResource } from "../../single/StoryblokResource";
import { CollaboratorRestoreService } from "./CollaboratorRestoreService";

export function createCollaboratorBulkRestoreService() {
  return new BulkRestoreService<StoryblokResource>(
    new CollaboratorRestoreService()
  );
}
