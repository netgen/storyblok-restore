# Storyblok Restore – Usage Guide

## Introduction
Storyblok Restore is a CLI and library for restoring content to your Storyblok CMS space from backup files. It supports both single-resource and bulk-resource restore workflows, making it easy to recover or migrate your content. (Backup functionality is coming soon.)

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

## Single Restore CLI
Restore a single resource (e.g., a story) from a JSON file.

### Usage
```sh
single-restore --type <type> --file <file> --token <token> --space <space_id> [options]
```

### Options
- `--type`      Resource type (e.g., `story`, `asset-folder`)
- `--file`      Path to the resource JSON file
- `--token`     Storyblok OAuth token (or use env var)
- `--space`     Storyblok space ID (or use env var)
- `--publish`   Publish the resource after restore
- `--create`    Create a new resource (instead of update)
- `--propagate` Update references to new UUIDs (if applicable)
- `--verbose`   Enable verbose logging

### Example
```sh
single-restore --type story --file ./my-story.json --token $STORYBLOK_OAUTH_TOKEN --space $STORYBLOK_SPACE_ID --publish --create
```

---

## Bulk Restore CLI
Restore multiple resources from a folder of JSON files. Handles dependencies (e.g., parent/child), ID/UUID mapping, and reference fixing.

### Usage
```sh
bulk-restore --type <type> --folder <folder> --token <token> --space <space_id> [options]
```

### Options
- `--type`      Resource type (e.g., `story`, `asset-folder`)
- `--folder`    Path to the folder containing resource JSON files
- `--token`     Storyblok OAuth token (or use env var)
- `--space`     Storyblok space ID (or use env var)
- `--publish`   Publish resources after restore
- `--create`    Create new resources (instead of update)
- `--propagate` Update references to new UUIDs (if applicable)
- `--verbose`   Enable verbose logging

### Example
```sh
bulk-restore --type story --folder ./stories --token $STORYBLOK_OAUTH_TOKEN --space $STORYBLOK_SPACE_ID --publish --create
```

### How Bulk Restore Works
- Reads all JSON files in the specified folder.
- Sorts resources to respect dependencies (e.g., parents before children).
- Updates parent IDs and references as needed.
- Restores each resource using the correct API call.
- Optionally fixes references (e.g., UUIDs) after all resources are created.

---

## Configuration

### Environment Variables
- `STORYBLOK_OAUTH_TOKEN` – Your Storyblok OAuth token
- `STORYBLOK_SPACE_ID` – Your Storyblok space ID
- `STORYBLOK_REGION` – (Optional) Your Storyblok region (default: 'eu')

You can also provide these as CLI flags.

### File/Folder Structure
- **Single restore:** expects a single JSON file representing the resource.
- **Bulk restore:** expects a folder containing one JSON file per resource (e.g., all stories in `./stories/`).
- Each JSON file should match the format exported by Storyblok's API or backup tools.

---

## Troubleshooting & FAQ

### Common Issues
- **Authentication errors:**
  - Ensure your OAuth token and space ID are correct and have sufficient permissions.
  - Try passing them as CLI flags if env vars are not picked up.
- **Invalid file/folder structure:**
  - Make sure your JSON files are valid and match the expected format.
  - For bulk restore, ensure all files are in the specified folder.
- **API rate limits:**
  - The tool respects Storyblok's rate limits, but if you hit errors, try reducing the number of resources or wait before retrying.
- **Reference/parent mapping issues:**
  - Ensure all referenced resources are included in your bulk restore folder.
  - The tool will attempt to update parent IDs and references automatically.

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
