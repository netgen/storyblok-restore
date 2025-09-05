# Storyblok Restore – Usage Guide

## Introduction
Storyblok Restore is a CLI tool for restoring entire Storyblok CMS spaces from backup files. It handles the complete restoration process including dependencies, ID/UUID mapping, and reference fixing across all resource types.

Notes:
- Webhooks cannot be restored with their `secret`, so you will have to manually add the secret back through the interface

---

## Installation & Setup

### Prerequisites
- Node.js (v16 or higher recommended)
- A Storyblok account with an OAuth token
- Access to your Storyblok space ID

### Install from npm
You can install globally (recommended for CLI usage):

```sh
npm install -g storyblok-restore
```

Or use locally in your project:

```sh
npm install storyblok-restore
```

### Environment Variables
You can provide your Storyblok credentials via CLI flags or environment variables:
- `STORYBLOK_OAUTH_TOKEN` – Your Storyblok OAuth token
- `STORYBLOK_SPACE_ID` – Your Storyblok space ID
- `STORYBLOK_REGION` – (Optional) Your Storyblok region (default: 'eu')

---

## Space Restore CLI
Restore an entire Storyblok space from a backup folder containing all resource types.

### Usage
```sh
storyblok-restore space-restore --backup-path <path> --token <token> --space <space_id> [options]
```

### Options
- `--backup-path`    Path to the backup root folder
- `--token`          Storyblok OAuth token (or use env var)
- `--space`          Storyblok space ID (or use env var)
- `--resource-types` Resource types to restore (comma separated, optional)
- `--verbose`        Enable verbose logging

### Example
```sh
storyblok-restore space-restore --backup-path ./backup --token $STORYBLOK_OAUTH_TOKEN --space $STORYBLOK_SPACE_ID
```

### Restore Specific Resource Types
You can restore only specific resource types by specifying them:

```sh
storyblok-restore space-restore --backup-path ./backup --token $STORYBLOK_OAUTH_TOKEN --space $STORYBLOK_SPACE_ID --resource-types "stories,assets,components"
```

### Supported Resource Types
- `webhooks`
- `access-tokens`
- `component-groups`
- `components`
- `datasources`
- `datasource-entries`
- `asset-folders`
- `assets`
- `stories`

### How Space Restore Works
- Reads the backup folder structure
- Restores resources in dependency order (e.g., components before stories)
- Handles cross-resource references and ID/UUID mapping
- Processes each resource type with appropriate preprocessing and postprocessing
- Maintains relationships between resources (e.g., story components, asset folders)

---

## Backup Folder Structure

The tool expects a backup folder with the following structure:

```
backup/
├── webhooks/
│   └── *.json
├── access-tokens/
│   └── *.json
├── component-groups/
│   └── *.json
├── components/
│   └── *.json
├── datasources/
│   └── *.json
├── datasource-entries/
│   └── *.json
├── asset-folders/
│   └── *.json
├── assets/
│   └── *.json
├── asset-files/
│   └── *.*
└── stories/
    └── *.json
```

Each resource type folder should contain JSON files representing individual resources. Asset files (images, documents, etc.) should be in the `asset-files/` folder.

---

## Troubleshooting & FAQ

### Common Issues
- **Authentication errors:**
  - Ensure your OAuth token and space ID are correct and have sufficient permissions.
  - Try passing them as CLI flags if env vars are not picked up.
- **Invalid backup structure:**
  - Make sure your backup folder follows the expected structure.
  - Ensure all JSON files are valid and match the Storyblok API format.
- **API rate limits:**
  - The tool respects Storyblok's rate limits, but if you hit errors, try reducing the number of resources or wait before retrying.
- **Cross-resource reference issues:**
  - Ensure all referenced resources are included in your backup.
  - The tool will attempt to update references automatically.

### Verbose Output
- Use the `--verbose` flag to get detailed logs for debugging.

---

## Contact & Support
- Report bugs or request features on [GitHub Issues](https://github.com/your-org/storyblok-restore/issues)
- For help, open an issue or contact the maintainer listed in `package.json`.

---

## Roadmap
- Backup functionality (exporting resources) coming soon
- Support for more resource types and advanced workflows
