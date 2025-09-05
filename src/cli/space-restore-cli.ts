#!/usr/bin/env node
import { ResourceType } from "@core/types/types";
import { spaceRestore } from "../entries/space-restore";

export async function runSpaceRestoreCli(args: Record<string, string>) {
  const oauthToken = args.token || process.env.STORYBLOK_OAUTH_TOKEN;
  const spaceId = args["space-id"] || process.env.STORYBLOK_SPACE_ID;
  const region = args.region || "eu";
  const resourceTypes = args["resource-types"]?.split(",");
  const backupPath = args["backup-path"];

  const filteredResourceTypes = resourceTypes
    ?.map((resourceType) => {
      if (resourceType in ResourceType) return resourceType as ResourceType;
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
