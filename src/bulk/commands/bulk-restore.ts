#!/usr/bin/env node
/**
 * Bulk Restore CLI Entrypoint
 *
 * This script restores a collection of Storyblok resources from a folder of JSON files.
 * It handles sorting, parent/child mapping, ID/UUID mapping, and post-processing (e.g., reference fixing).
 *
 * Usage:
 *   $ node bulk-restore.mjs --type <type> --folder <folder> --token <token> --space <space_id> [--publish] [--create] [--propagate] [--verbose]
 *
 * Options:
 *   --type      Resource type (e.g., 'story')
 *   --folder    Folder containing resource JSON files
 *   --token     Storyblok OAuth token
 *   --space     Storyblok space ID
 *   --publish   Publish resources after restore
 *   --create    Create new resources (instead of update)
 *   --propagate Propagate UUID changes to references
 *   --verbose   Enable verbose logging
 */

import fs from "fs";
import StoryblokClient from "storyblok-js-client";
import type { StoryblokResource } from "../../single/StoryblokResource.js";
import { bulkRestoreServiceFactory } from "../factory/BulkRestoreServiceFactory.js";

export async function runBulkRestore(args: Record<string, any>) {
  if (
    args.help ||
    !args.type ||
    !args.folder ||
    (!args.token && !process.env.STORYBLOK_OAUTH_TOKEN) ||
    (!args.space && !process.env.STORYBLOK_SPACE_ID)
  ) {
    console.log(`USAGE
	$ node bulk-restore.mjs --type <type> --file <file> --token <token> --space <space_id> [--publish] [--create] [--propagate] [--verbose]
	`);
    process.exit(0);
  }

  const resourceType = args.type;
  const oauthToken = args.token || process.env.STORYBLOK_OAUTH_TOKEN;
  const spaceId = args.space || process.env.STORYBLOK_SPACE_ID;
  const region = args.region || "eu";

  const apiClient = new StoryblokClient({ oauthToken, region });
  const context = {
    apiClient,
    oldIdToNewIdMap: new Map(),
    oldUuidToNewUuidMap: new Map(),
  };

  const options = {
    publish: !!args.publish,
    create: !!args.create,
    propagate: !!args.propagate,
    verbose: !!args.verbose,
    spaceId,
  };

  const bulkRestoreService =
    bulkRestoreServiceFactory.getServiceForType(resourceType);

  const folder = args.folder;
  const resources: StoryblokResource[] = [];

  const files = fs.readdirSync(folder).filter((file) => file.endsWith(".json"));

  for (const file of files) {
    const filePath = `${folder}/${file}`;
    const content = fs.readFileSync(filePath, "utf-8");
    const resource = JSON.parse(content) as StoryblokResource;
    resources.push(resource);
  }

  console.log(`Loaded ${resources.length} resources from ${folder}`);

  bulkRestoreService
    .restore(resources, options, context)
    .then(() => {
      console.log("Restore successful.");
      process.exit(0);
    })
    .catch((err) => {
      console.error("Restore failed:", err);
      process.exit(1);
    });
}
