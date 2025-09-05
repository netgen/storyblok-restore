#!/usr/bin/env node
import { Command } from "commander";
import { runSpaceRestoreCli } from "./space-restore-cli";

const program = new Command();

program
  .name("storyblok-restore")
  .description("Backup and restore Storyblok CMS content");

program
  .command("space-restore")
  .description("Restore an entire space from a backup folder")
  .option("--backup-path <path>", "Path to backup root folder")
  .option("--token <token>", "Storyblok OAuth token")
  .option("--space <space_id>", "Storyblok space ID")
  .option(
    "--resource-types <types>",
    "Resource types to restore (comma separated, optional)"
  )
  .option("--verbose", "Enable verbose logging")
  .action(runSpaceRestoreCli);

program.parse(process.argv);
