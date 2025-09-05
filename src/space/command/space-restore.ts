#!/usr/bin/env node
import StoryblokClient from "storyblok-js-client";
import { bulkRestoreServiceFactory } from "../../bulk/factory/BulkRestoreServiceFactory";
import { SpaceRestoreService } from "../services/SpaceRestoreService";

export async function runSpaceRestore(args: Record<string, any>) {
  console.log("runSpaceRestore", args);
  if (!args["backupFolder"] || !args.token || !args.space) {
    console.error(
      "Usage: space-restore --backup-folder <folder> --token <token> --space <space_id> [options]"
    );
    process.exit(1);
  }

  const oauthToken = args.token || process.env.STORYBLOK_OAUTH_TOKEN;
  const spaceId = args.space || process.env.STORYBLOK_SPACE_ID;
  const region = args.region || "eu";

  const backupRoot = args["backupFolder"];

  console.log("backupRoot", backupRoot);

  const apiClient = new StoryblokClient({ oauthToken, region });
  const options = {
    publish: !!args.publish,
    create: !!args.create,
    forceUpdate: !!args.forceUpdate,
    spaceId: spaceId,
    backupPath: backupRoot,
  };

  const RESOURCE_ORDER = [
    // "webhooks",
    // "access-tokens",
    "component-groups",
    "components",
    // "datasources",
    // "datasource-entries",
    "asset-folders",
    "assets",
    "stories",
  ];

  const spaceRestoreService = new SpaceRestoreService(
    bulkRestoreServiceFactory,
    RESOURCE_ORDER
  );
  try {
    await spaceRestoreService.restore(backupRoot, options, apiClient);
  } catch (error) {
    console.error("Space restore failed:", error);
    process.exit(1);
  }

  console.log("Space restore complete!");
}
