#!/usr/bin/env node
import fs from "fs";
import path from "path";
import StoryblokClient from "storyblok-js-client";
import { bulkRestoreServiceFactory } from "../../bulk/factory/BulkRestoreServiceFactory";

export async function runSpaceRestore(args: Record<string, any>) {
  if (!args["backup-folder"] || !args.token || !args.space) {
    console.error(
      "Usage: space-restore --backup-folder <folder> --token <token> --space <space_id> [options]"
    );
    process.exit(1);
  }

  const oauthToken = args.token || process.env.STORYBLOK_OAUTH_TOKEN;
  const spaceId = args.space || process.env.STORYBLOK_SPACE_ID;
  const region = args.region || "eu";

  const backupRoot = args["backup-folder"];
  const context = {
    apiClient: new StoryblokClient({ oauthToken, region }),
    oldIdToNewIdMap: new Map(),
    oldUuidToNewUuidMap: new Map(),
    spaceId,
  };
  const options = {
    publish: !!args.publish,
    create: !!args.create,
    forceUpdate: !!args.forceUpdate,
    spaceId: args.space,
  };

  const RESOURCE_ORDER = [
    { type: "asset-folders", folder: "asset-folders" },
    { type: "stories", folder: "stories" },
  ];

  for (const { type, folder } of RESOURCE_ORDER) {
    const folderPath = path.join(backupRoot, folder);
    if (!fs.existsSync(folderPath)) {
      console.log(`Skipping ${type}: folder not found`);
      continue;
    }
    const files = fs.readdirSync(folderPath).filter((f) => f.endsWith(".json"));
    if (files.length === 0) {
      console.log(`Skipping ${type}: no JSON files found`);
      continue;
    }
    const resources = files.map((f) =>
      JSON.parse(fs.readFileSync(path.join(folderPath, f), "utf8"))
    );
    const bulkRestoreService =
      bulkRestoreServiceFactory.getServiceForType(type);
    console.log(`Restoring ${resources.length} ${type}...`);
    await bulkRestoreService.restore(resources, options, context);
    console.log(`Finished restoring ${type}`);
  }
  console.log("Space restore complete!");
}
