#!/usr/bin/env node
import { runBulkRestore } from "../bulk/commands/bulk-restore";
import { runSingleRestore } from "../single/commands/single-restore";
import { runSpaceRestore } from "../space/command/space-restore";
import { Command } from "commander";

const program = new Command();

program
  .name("storyblok-backup-and-restore")
  .description("Backup and restore Storyblok CMS content");

program
  .command("single-restore")
  .description("Restore a single resource from a file")
  .option("--type <type>", "Resource type")
  .option("--file <file>", "Path to resource JSON file")
  .option("--token <token>", "Storyblok OAuth token")
  .option("--space <space_id>", "Storyblok space ID")
  .option("--publish", "Publish after restore")
  .option("--create", "Create new resource")
  .option("--propagate", "Propagate UUID changes")
  .option("--verbose", "Enable verbose logging")
  .action(runSingleRestore);

program
  .command("bulk-restore")
  .description("Restore multiple resources from a folder")
  .option("--type <type>", "Resource type")
  .option("--folder <folder>", "Path to folder of JSON files")
  .option("--token <token>", "Storyblok OAuth token")
  .option("--space <space_id>", "Storyblok space ID")
  .option("--publish", "Publish after restore")
  .option("--create", "Create new resources")
  .option("--propagate", "Propagate UUID changes")
  .option("--verbose", "Enable verbose logging")
  .action(runBulkRestore);

program
  .command("space-restore")
  .description("Restore an entire space from a backup folder")
  .option("--backup-folder <folder>", "Path to backup root folder")
  .option("--token <token>", "Storyblok OAuth token")
  .option("--space <space_id>", "Storyblok space ID")
  .option("--publish", "Publish after restore")
  .option("--create", "Create new resources")
  .option("--propagate", "Propagate UUID changes")
  .option("--verbose", "Enable verbose logging")
  .action(runSpaceRestore);

program.parse(process.argv);
