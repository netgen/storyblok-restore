#!/usr/bin/env node
import { ResourceType } from "@core/types/types";
import { spaceRestore } from "../entries/space-restore";
import { setLogLevel, LogLevel } from "@shared/logging";

export async function runSpaceRestoreCli(args: Record<string, string>) {
  if (args.verbose) {
    setLogLevel(LogLevel.DEBUG);
  } else {
    setLogLevel(LogLevel.INFO);
  }

  console.log("Running space restore CLI", args);
  const oauthToken = args.token || process.env.STORYBLOK_OAUTH_TOKEN;
  const spaceId = args["spaceId"] || process.env.STORYBLOK_SPACE_ID;
  const region = args.region || "eu";
  const resourceTypes = args["resourceTypes"]?.split(",");
  const backupPath = args["backupPath"];

  const filteredResourceTypes = resourceTypes
    ?.map((resourceType) => {
      if (Object.values(ResourceType).includes(resourceType as ResourceType))
        return resourceType as ResourceType;
      console.error(`Invalid resource type: ${resourceType}. Skipping it.`);
      return null;
    })
    .filter((resourceType) => resourceType !== null);

  const errors: string[] = [];
  if (!backupPath) errors.push("backup-path is required");
  if (!oauthToken) errors.push("token is required");
  if (!spaceId) errors.push("space-id is required");

  if (errors.length > 0) {
    console.error(errors.join("\n"));
    process.exit(1);
  }

  try {
    spaceRestore({
      spaceId: spaceId!,
      oauthToken: oauthToken!,
      backupPath: backupPath!,
      region,
      resourceTypes: filteredResourceTypes,
    });
  } catch {
    process.exit(1);
  }
}
