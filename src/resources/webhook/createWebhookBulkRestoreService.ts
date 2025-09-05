import { BulkRestoreService } from "../../bulk/services/BulkRestore";
import type { StoryblokResource } from "../../single/StoryblokResource";
import { WebhookRestoreService } from "./WebhookRestoreService";

export function createWebhookBulkRestoreService() {
  return new BulkRestoreService<StoryblokResource>(new WebhookRestoreService());
}
