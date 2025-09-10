#!/usr/bin/env node
import { ResourceType } from "@core/types/types";
import { spaceRestore } from "../entries/space-restore";
import { setConsoleLogLevel, LogLevel, logger } from "@shared/logging";
import { prepareBackup } from "../../scripts/prepare-backup";
import * as readline from "readline";

export async function runSpaceRestoreCli(args: Record<string, string>) {
  logger.info("\n🚀 Starting Storyblok Space Restore CLI");
  logger.debug("CLI arguments:", args);

  if (args.verbose) {
    setConsoleLogLevel([
      LogLevel.DEBUG,
      LogLevel.ERROR,
      LogLevel.WARN,
      LogLevel.INFO,
    ]);
    logger.debug("Verbose logging enabled");
  }

  const oauthToken = args.token || process.env.STORYBLOK_OAUTH_TOKEN;
  const spaceId = args["spaceId"] || process.env.STORYBLOK_SPACE_ID;
  const region = args.region || process.env.STORYBLOK_REGION || "eu";
  const resourceTypes = args["resourceTypes"]?.split(",");
  const backupPath = args["backupPath"];

  logger.debug("Configuration:", {
    spaceId,
    region,
    resourceTypes,
    backupPath,
    hasOauthToken: !!oauthToken,
  });

  const filteredResourceTypes = resourceTypes
    ?.map((resourceType) => {
      if (Object.values(ResourceType).includes(resourceType as ResourceType))
        return resourceType as ResourceType;
      logger.warn(`Invalid resource type: ${resourceType}. Skipping it.`);
      return null;
    })
    .filter((resourceType) => resourceType !== null);

  logger.debug("Filtered resource types:", filteredResourceTypes);

  const errors: string[] = [];
  if (!backupPath) errors.push("backup-path is required");
  if (!oauthToken) errors.push("token is required");
  if (!spaceId) errors.push("space-id is required");

  if (errors.length > 0) {
    logger.error("Validation errors:");
    errors.forEach((error) => logger.error(`  - ${error}`));
    process.exit(1);
  }

  logger.info(`✅ Configuration validated successfully`);
  logger.info(`📁 Backup path: ${backupPath}`);
  logger.info(`🌍 Region: ${region}`);
  logger.info(`🔑 Space ID: ${spaceId}`);
  if (filteredResourceTypes && filteredResourceTypes.length > 0) {
    logger.info(`📦 Resource types: ${filteredResourceTypes.join(", ")}`);
  } else {
    logger.info(`📦 Resource types: All available types`);
  }

  try {
    // Prepare backup folder before restoration
    await prepareBackup({ backupPath: backupPath! });

    logger.warn("\n⚠️  IMPORTANT RESTORATION WARNINGS:");
    logger.warn(
      "   • Stories with missing required files or broken references will be SKIPPED"
    );
    logger.warn("   Before proceeding, please ensure:");
    logger.warn(
      "   • The target space has the SAME PLAN and FEATURES as the source space. Plan limitations may prevent certain content from being restored:"
    );
    logger.warn("     - PDF uploads require appropriate plan features");
    logger.warn("     - Collaborator limits based on plan restrictions");
    logger.warn("     - Asset storage limits may affect file uploads");
    logger.warn("     - etc");

    // Prompt user for confirmation
    const rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout,
    });

    const answer = await new Promise<string>((resolve) => {
      rl.question(
        "\n❓ Do you want to proceed with the restoration? (y/N): ",
        resolve
      );
    });

    rl.close();

    if (answer.toLowerCase() !== "y" && answer.toLowerCase() !== "yes") {
      logger.info("❌ Restoration cancelled by user.");
      process.exit(0);
    }

    logger.info("\n🔄 Starting space restoration process...");
    await spaceRestore({
      spaceId: spaceId!,
      oauthToken: oauthToken!,
      backupPath: backupPath!,
      region,
      resourceTypes: filteredResourceTypes,
    });
    logger.info("\n🎉 Space restoration completed successfully!");

    // Check if webhooks were restored and warn about secret limitation
    const hasWebhooks =
      !filteredResourceTypes || filteredResourceTypes.includes("webhooks");
    if (hasWebhooks) {
      logger.warn("\n⚠️  IMPORTANT WEBHOOK NOTICE:");
      logger.warn("   Webhook secrets cannot be restored via API.");
      logger.warn(
        "   Please manually check and update webhook secrets in your Storyblok space."
      );
      logger.warn("   Go to: Settings > Webhooks > [Your Webhook] > Secret");
    }
  } catch (error) {
    logger.error("\n❌ Space restoration failed:");
    logger.error(error instanceof Error ? error.message : String(error));
    logger.debug("Full error details:", error);
    process.exit(1);
  }
}
