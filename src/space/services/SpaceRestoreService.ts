import fs from "fs";
import path from "path";
import StoryblokClient from "storyblok-js-client";
import type { BulkRestoreServiceFactory } from "../../bulk/factory/BulkRestoreServiceFactory";
import type { BulkRestoreContext, RestoreOptions } from "../../shared/types";

export class SpaceRestoreService {
  private contexts: Map<string, BulkRestoreContext> = new Map();

  constructor(
    private bulkRestoreServiceFactory: BulkRestoreServiceFactory,
    private restoreOrder: string[]
  ) {}

  async restore(
    spaceBackupRoot: string,
    options: RestoreOptions,
    apiClient: StoryblokClient
  ) {
    for (const type of this.restoreOrder) {
      const folder = path.join(spaceBackupRoot, type);
      if (!fs.existsSync(folder)) continue;

      const resources = this.loadResources(folder);
      const context = this.createContext(apiClient);
      this.contexts.set(type, context);

      console.log("SpaceRestoreService", this.contexts);

      const bulkRestore =
        this.bulkRestoreServiceFactory.getServiceForType(type);
      await bulkRestore.restore(resources, options, context, this.contexts);
    }
  }

  private createContext(apiClient: StoryblokClient): BulkRestoreContext {
    return {
      apiClient,
      oldIdToNewIdMap: new Map(),
      oldUuidToNewUuidMap: new Map(),
    };
  }

  private loadResources(folder: string): any[] {
    return fs
      .readdirSync(folder)
      .filter((f) => f.endsWith(".json"))
      .map((f) => JSON.parse(fs.readFileSync(path.join(folder, f), "utf8")));
  }
}
