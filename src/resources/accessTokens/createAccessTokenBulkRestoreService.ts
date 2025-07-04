import { BulkRestoreService } from "../../bulk/services/BulkRestore";
import type { StoryblokResource } from "../../single/StoryblokResource";
import { AccessTokenRestoreService } from "./AccessTokenRestoreService";

export function createAccessTokenBulkRestoreService() {
  return new BulkRestoreService<StoryblokResource>(
    new AccessTokenRestoreService()
  );
}
