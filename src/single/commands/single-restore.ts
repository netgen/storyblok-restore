#!/usr/bin/env node
/**
 * Single Restore CLI Entrypoint
 *
 * This script restores a single Storyblok resource from a JSON file.
 * It delegates the restore logic to the appropriate handler based on resource type.
 *
 * Usage:
 *   $ node single-restore.mjs --type <type> --file <file> --token <token> --space <space_id> [--publish] [--create] [--propagate] [--verbose]
 *
 * Options:
 *   --type      Resource type (e.g., 'story')
 *   --file      Path to the resource JSON file
 *   --token     Storyblok OAuth token
 *   --space     Storyblok space ID
 *   --publish   Publish resource after restore
 *   --create    Create new resource (instead of update)
 *   --propagate Propagate UUID changes to references
 *   --verbose   Enable verbose logging
 */
import fs from "fs";
import minimist from "minimist";
import StoryblokClient from "storyblok-js-client";
import { resourceRestoreServiceFactory } from "../factories/ResourceRestoreServiceFactory";

const args = minimist(process.argv.slice(2));

if (
  args.help ||
  !args.type ||
  !args.file ||
  (!args.token && !process.env.STORYBLOK_OAUTH_TOKEN) ||
  (!args.space && !process.env.STORYBLOK_SPACE_ID)
) {
  console.log(`USAGE
	$ node single-restore.mjs --type <type> --file <file> --token <token> --space <space_id> [--publish] [--create] [--propagate] [--verbose]
	`);
  process.exit(0);
}

const resourceType = args.type;
const resourceFile = args.file;
const oauthToken = args.token || process.env.STORYBLOK_OAUTH_TOKEN;
const spaceId = args.space || process.env.STORYBLOK_SPACE_ID;
const region = args.region || "eu";

const resource = JSON.parse(fs.readFileSync(resourceFile, "utf8"));

const apiClient = new StoryblokClient({ oauthToken, region });
const context = {
  apiClient,
};

const options = {
  publish: !!args.publish,
  create: !!args.create,
  propagate: !!args.propagate,
  verbose: !!args.verbose,
  type: resourceType,
  spaceId,
};

const handler = resourceRestoreServiceFactory.getService(resourceType);

handler
  .restore(resource, options, context)
  .then((result) => {
    console.log("Restore successful.");
    if (args.verbose) {
      console.log(JSON.stringify(result, null, 2));
    }
    process.exit(0);
  })
  .catch((err) => {
    console.error("Restore failed:", err);
    process.exit(1);
  });
