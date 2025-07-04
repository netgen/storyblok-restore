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

  const apiClient = new StoryblokClient({ oauthToken, region });
  const options = {
    publish: !!args.publish,
    create: !!args.create,
    forceUpdate: !!args.forceUpdate,
    spaceId: spaceId,
  };

  const RESOURCE_ORDER = [
    "asset-folders",
    "stories",
    "component-groups",
    "components",
  ];

  const spaceRestoreService = new SpaceRestoreService(
    bulkRestoreServiceFactory,
    RESOURCE_ORDER
  );
  await spaceRestoreService.restore(backupRoot, options, apiClient);

  console.log("Space restore complete!");
}
