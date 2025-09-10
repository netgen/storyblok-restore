# Storyblok Backup and Restore

[![npm version](https://img.shields.io/npm/v/storyblok-restore.svg)](https://www.npmjs.com/package/storyblok-restore)
[![license](https://img.shields.io/github/license/yourusername/storyblok-restore)](https://github.com/yourusername/storyblok-restore/blob/main/LICENSE)

A powerful CLI tool to restore entire [Storyblok CMS](https://www.storyblok.com) spaces from backup files created by [storyblok-backup](https://github.com/webflorist/storyblok-backup).

This tool handles the complete restoration process including dependency resolution, ID/UUID mapping, reference fixing, and intelligent conflict resolution across all Storyblok resource types.

## Features

- 🔄 **Complete Space Restoration** - Restore entire Storyblok spaces from backup folders
- 🎯 **Selective Resource Restoration** - Choose specific resource types to restore
- 🔗 **Dependency Resolution** - Automatically handles resource dependencies and restoration order
- 🆔 **ID/UUID Mapping** - Manages cross-resource references and ID mappings
- ⚡ **Smart Conflict Resolution** - Intelligent upsert logic (create-first, update-on-conflict)
- 📁 **Asset File Support** - Restores both asset metadata and actual files
- 🔍 **Verbose Logging** - Detailed progress tracking and debugging information

## Prerequisites

- Node.js (v16 or higher)
- A Storyblok account with Management API access
- OAuth token from your Storyblok account settings
- Backup files created by [storyblok-backup](https://github.com/webflorist/storyblok-backup)

## Installation

### Global Installation (Recommended)
```bash
npm install -g storyblok-restore
```

### Local Installation
```bash
npm install storyblok-restore
```

### Using npx (No Installation Required)
```bash
npx storyblok-restore
```

## Usage

### Basic Space Restore
```bash
storyblok-restore space-restore \
  --backup-path ./backup \
  --token YOUR_OAUTH_TOKEN \
  --space YOUR_SPACE_ID
```

### Environment Variables
You can set credentials via environment variables:

```bash
export STORYBLOK_OAUTH_TOKEN="your_oauth_token"
export STORYBLOK_SPACE_ID="your_space_id"
export STORYBLOK_REGION="eu"  # Optional: eu, us, ap, ca, cn

storyblok-restore space-restore --backup-path ./backup
```

### Command Options

| Option | Description | Required |
|--------|-------------|----------|
| `--backup-path` | Path to the backup folder | ✅ |
| `--token` | Storyblok OAuth token | ✅* |
| `--space` | Storyblok space ID | ✅* |
| `--region` | Region (eu, us, ap, ca, cn) | ❌ |
| `--resource-types` | Comma-separated list of resource types | ❌ |
| `--verbose` | Enable detailed logging | ❌ |

*Required unless set via environment variables

## Examples

### Complete Space Restoration
```bash
# Restore all resources from backup
storyblok-restore space-restore \
  --backup-path ./my-backup \
  --token $STORYBLOK_OAUTH_TOKEN \
  --space $STORYBLOK_SPACE_ID \
  --verbose
```

### Selective Resource Restoration
```bash
# Restore only specific resource types
storyblok-restore space-restore \
  --backup-path ./my-backup \
  --token $STORYBLOK_OAUTH_TOKEN \
  --space $STORYBLOK_SPACE_ID \
  --resource-types "stories,components,assets"
```

### Multi-Region Restoration
```bash
# Restore to US region space
storyblok-restore space-restore \
  --backup-path ./my-backup \
  --token $STORYBLOK_OAUTH_TOKEN \
  --space $STORYBLOK_SPACE_ID \
  --region us
```

## Supported Resource Types

The tool can restore the following Storyblok resource types:

- **`webhooks`** - Webhook configurations (secrets must be manually re-added)
- **`access-tokens`** - API access tokens
- **`collaborators`** - Space collaborators and permissions
- **`component-groups`** - Component organization groups
- **`components`** - Reusable content components
- **`datasources`** - External data sources
- **`datasource-entries`** - Data source entries and content
- **`asset-folders`** - Asset organization folders
- **`assets`** - Media assets and files
- **`stories`** - Content pages and entries

## Expected Backup Structure

The tool expects backup folders created by [storyblok-backup](https://github.com/webflorist/storyblok-backup) with this structure:

```
backup/
├── space-{space_id}.json         # Space configuration
├── webhooks/                     # Webhook configurations
│   └── *.json
├── access-tokens/                # API access tokens
│   └── *.json
├── collaborators/                # Space collaborators
│   └── *.json
├── component-groups/             # Component groups
│   └── *.json
├── components/                   # Content components
│   └── *.json
├── datasources/                  # Data sources
│   └── *.json
├── datasource-entries/           # Data source entries
│   └── *.json
├── asset-folders/                # Asset folders
│   └── *.json
├── assets/                       # Asset metadata
│   └── *.json
├── asset-files/                  # Actual asset files
│   └── *.*
└── stories/                      # Content stories
    └── *.json
```

## How It Works

1. **Backup Analysis** - Scans the backup folder structure and validates resources
2. **Dependency Resolution** - Determines the correct restoration order based on resource dependencies
3. **Smart Restoration** - Uses intelligent upsert logic:
   - Attempts to create new resources (fast path for 99.9% of cases)
   - Detects conflicts and automatically switches to update mode
   - Finds existing resources and updates them with new data
4. **Reference Fixing** - Updates cross-resource references and ID mappings
5. **Asset Handling** - Uploads asset files and links them to asset metadata
6. **Progress Tracking** - Provides detailed logging and error reporting

## Configuration

### Using .env File
Create a `.env` file in your project root:

```env
STORYBLOK_OAUTH_TOKEN=your_oauth_token_here
STORYBLOK_SPACE_ID=123456
STORYBLOK_REGION=eu
```

## Troubleshooting


### Getting Help

- Use the `--verbose` flag for detailed logging
- Check that your backup structure matches the expected format
- Ensure all required dependencies are included in the backup

## Acknowledgments

This tool is designed to work with backups created by [storyblok-backup](https://github.com/webflorist/storyblok-backup) by [@webflorist](https://github.com/webflorist). Special thanks for creating the comprehensive backup solution that makes this restoration tool possible.

## License

This project is licensed under the [MIT License](LICENSE).

## Contributing

Contributions are welcome! Please see [CONTRIBUTING.md](docs/CONTRIBUTING.md) for development setup and guidelines.
