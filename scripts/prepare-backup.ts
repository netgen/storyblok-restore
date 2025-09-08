/**
 * Temporary backup preparation function for restoration.
 * This will be replaced by proper backup functionality in the future.
 */

import { promises as fs } from "fs";
import path from "path";
import { logger } from "../src/shared/logging";

interface PrepareBackupOptions {
  backupPath: string;
}

interface DatasourceEntry {
  id: number;
  name: string;
  value: string;
  dimension_value: string;
}

interface DatasourceEntryWithParent extends DatasourceEntry {
  datasource_id: number;
}

/**
 * Prepares backup folder for restoration by moving/reorganizing files.
 * This is a temporary solution until proper backup functionality is implemented.
 */
export async function prepareBackup(
  options: PrepareBackupOptions
): Promise<void> {
  const { backupPath } = options;

  logger.info("🔧 Preparing backup folder for restoration...");
  logger.debug("Backup path:", backupPath);

  try {
    // Check if backup path exists
    await fs.access(backupPath);
    logger.info(`✅ Backup path exists: ${backupPath}`);

    // Reorganize datasource entries
    await reorganizeDatasourceEntries(backupPath);

    logger.info("🎉 Backup preparation completed successfully!");
  } catch (error) {
    logger.error("❌ Backup preparation failed:");
    logger.error(error instanceof Error ? error.message : String(error));
    logger.debug("Full error details:", error);
    throw error; // Re-throw to let the main CLI handle it
  }
}

/**
 * Reorganizes datasource entries from _entries.json files into individual files.
 * Moves entries from datasources/123_entries.json to datasource-entries/123456.json
 */
async function reorganizeDatasourceEntries(backupPath: string): Promise<void> {
  const datasourcesPath = path.join(backupPath, "datasources");
  const datasourceEntriesPath = path.join(backupPath, "datasource-entries");

  try {
    // Check if datasources folder exists
    await fs.access(datasourcesPath);
    logger.info(`✅ Datasources folder found: ${datasourcesPath}`);
  } catch {
    logger.info(
      "ℹ️ No datasources folder found, skipping datasource entries reorganization"
    );
    return;
  }

  // Create datasource-entries folder if it doesn't exist
  await fs.mkdir(datasourceEntriesPath, { recursive: true });
  logger.info(`✅ Created datasource-entries folder: ${datasourceEntriesPath}`);

  // Read all files in datasources folder
  const files = await fs.readdir(datasourcesPath);
  const entriesFiles = files.filter((file) => file.endsWith("_entries.json"));

  if (entriesFiles.length === 0) {
    logger.info("ℹ️ No datasource entries files found");
    return;
  }

  logger.info(
    `📁 Found ${entriesFiles.length} datasource entries files to process`
  );

  let totalEntriesProcessed = 0;

  for (const entriesFile of entriesFiles) {
    try {
      // Extract datasource ID from filename (e.g., "123_entries.json" -> "123")
      const datasourceId = entriesFile.replace("_entries.json", "");
      const datasourceIdNum = parseInt(datasourceId, 10);

      if (isNaN(datasourceIdNum)) {
        logger.warn(`⚠️ Invalid datasource ID in filename: ${entriesFile}`);
        continue;
      }

      const entriesFilePath = path.join(datasourcesPath, entriesFile);
      const entriesContent = await fs.readFile(entriesFilePath, "utf-8");
      const entries: DatasourceEntry[] = JSON.parse(entriesContent);

      logger.debug(
        `📄 Processing ${entries.length} entries from ${entriesFile} (datasource ID: ${datasourceIdNum})`
      );

      // Process each entry
      for (const entry of entries) {
        const entryWithParent: DatasourceEntryWithParent = {
          ...entry,
          datasource_id: datasourceIdNum,
        };

        const entryFileName = `${entry.id}.json`;
        const entryFilePath = path.join(datasourceEntriesPath, entryFileName);

        await fs.writeFile(
          entryFilePath,
          JSON.stringify(entryWithParent, null, 2)
        );
        totalEntriesProcessed++;
      }

      logger.debug(
        `✅ Processed ${entries.length} entries from ${entriesFile}`
      );

      // Delete the _entries.json file after processing
      await fs.unlink(entriesFilePath);
      logger.debug(`🗑️ Deleted ${entriesFile}`);
    } catch (error) {
      logger.error(
        `❌ Failed to process ${entriesFile}:`,
        error instanceof Error ? error.message : String(error)
      );
      logger.debug(`Error details for ${entriesFile}:`, error);
    }
  }

  logger.info(`🎉 Datasource entries reorganization completed!`);
  logger.info(`📊 Total entries processed: ${totalEntriesProcessed}`);
}
