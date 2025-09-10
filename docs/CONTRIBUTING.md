# Contributing to Storyblok Backup and Restore

# Core concepts & vocabulary

## Vocabulary
- Resource - Storyblok "entities" that can be backed up and restored (eg. story, component, asset etc)
- Resource collection - multiple resources of the same resource type

## Project Structure

This project follows a layered architecture with clear separation of concerns. Understanding the structure is essential for contributing effectively.

### Directory Overview

```
src/
├── cli/                      # Command-line interface
├── entries/                  # Application entry points
├── core/                     # Core abstractions and definitions
├── shared/                   # Reusable implementations
├── resources/                # Resource-specific implementations
```

### Detailed Structure

#### `src/cli/` - Command-Line Interface
Contains all CLI-related code for user interaction.

```
cli/
├── index.ts                  # Main CLI program setup
└── *-cli.ts                  # Command implementations
```

**Purpose**: Handles command parsing, argument validation, and user interaction.

#### `src/entries/` - Application Entry Points
Main functions that orchestrate the restoration process.

```
entries/
└── *-restore.ts              # Restoration orchestration functions
```

**Purpose**: Composition roots that wire together services and factories to perform restoration operations.

#### `src/core/` - Core Abstractions
Abstract definitions, interfaces, and base classes used throughout the application.

```
core/
├── factories/                # Service creation and configuration
├── processors/               # Interfaces for data transformation
├── services/                 # Core business logic and orchestration
├── sorting/                  # Resource ordering strategies
└── types/                    # Core type definitions and runtime context
```

**Purpose**: Provides abstractions and base functionality that other layers build upon.

#### `src/shared/` - Reusable Implementations
Concrete implementations that can be used across multiple resource types.

```
shared/
├── processors/               # Generic preprocessing/postprocessing implementations
├── sorting/                  # Concrete sorting strategy implementations
└── utils/                    # Common utility functions
```

**Purpose**: Contains reusable logic that doesn't belong to a specific resource type.

#### `src/resources/` - Resource-Specific Implementations
Implementation details for each Storyblok resource type.

```
resources/
├── access-tokens/
├── asset-folders/
├── assets/
├── collaborators/
├── component-groups/
├── components/
├── datasources/
├── datasource-entries/
├── stories/
└── ...
```

Each resource type follows a consistent structure:
- **services/**: Bulk and single restore services
- **processors/**: Resource-specific preprocessing/postprocessing
- **factories/**: Service creation (when needed)

**Purpose**: Contains resource-specific restoration logic, preprocessing, and postprocessing.

### Naming Conventions

#### Files and Folders
- **Folders**: kebab-case plural (`asset-folders/`, `component-groups/`)
- **Files**: kebab-case for folders, PascalCase for classes (`StoryBulkRestoreService.ts`)
- **Functions**: camelCase (`spaceRestore`, `createBulkRestoreServiceFactory`)

#### Classes and Interfaces
- **Classes**: PascalCase (`SpaceRestoreService`, `ResourceMappingRegistry`)
- **Interfaces**: PascalCase (`ResourcePreprocessor`, `SortingStrategy`)
- **Types**: PascalCase (`ResourceType`, `Context`)

#### Constants and Enums
- **Constants**: SCREAMING_SNAKE_CASE (`RESOURCE_ORDER`)
- **Enums**: PascalCase (`ResourceType`)

### Architecture Principles

#### 1. Layered Architecture
- **CLI Layer**: User interaction and command parsing
- **Entry Layer**: Application composition and orchestration
- **Core Layer**: Abstractions and base functionality
- **Shared Layer**: Reusable implementations
- **Resource Layer**: Resource-specific implementations

#### 2. Dependency Flow
```
CLI → Entries → Core → Shared → Resources
```

Dependencies flow downward, with each layer depending only on layers below it.

#### 3. Separation of Concerns
- **Services**: Business logic and orchestration
- **Processors**: Data transformation and validation
- **Factories**: Object creation and configuration
- **Sorting**: Resource ordering and dependency resolution

#### 4. Resource Organization
Each resource type follows a consistent structure:
- `services/`: Bulk and single restore services
- `processors/`: Resource-specific preprocessing/postprocessing
- `factories/`: Service creation (when needed)

### Adding New Resource Types

1. **Create resource folder**: `src/resources/{resource-name}/`
2. **Update types**: Add the resource type to the `ResourceType` enum
3. **Add service classes**: Implement `BulkRestoreService` and `ResourceRestoreService`
4. **Add processors**: Create any resource-specific preprocessing/postprocessing

### Adding New Shared Functionality

1. **Determine location**: 
   - Core abstractions → `src/core/`
   - Reusable implementations → `src/shared/`
2. **Follow naming conventions**: Use kebab-case for folders, PascalCase for classes
3. **Update imports**: Ensure all dependent files import the new functionality
4. **Add tests**: Create appropriate test files

### Testing Structure (TODO)

### Development Workflow

1. **Understand the layer**: Determine which layer your changes affect
2. **Follow conventions**: Use the established naming and structure patterns
3. **Maintain separation**: Keep concerns separated between layers
4. **Update documentation**: Update this file if you change the structure
5. **Add tests**: Ensure new functionality is properly tested

### Common Patterns

#### Service Factory Pattern
Services are created through factories to ensure proper configuration and dependency injection.

#### Processor Chain Pattern
Preprocessors and postprocessors can be chained together for complex data transformations.

#### Registry Pattern
The `ResourceMappingRegistry` manages cross-resource dependencies and ID mappings.

#### Strategy Pattern
Sorting strategies allow different resource ordering approaches (topological, alphabetical, etc.).

#### Upsert Pattern
Resources are restored using an upsert approach (create-first, update-on-conflict) to handle existing resources gracefully.

### Resource Restoration Logic

#### Upsert Implementation
The restoration process follows a robust upsert pattern to handle resource conflicts:

1. **Create First**: Attempt to create the resource via POST request (fast path for 99.9% of cases)
2. **Conflict Detection**: If a conflict error is detected, automatically switch to update mode
3. **Find Existing**: Call `findExistingResource()` to locate the existing resource
4. **Update**: If found, update the existing resource via PUT with new resource data
5. **Error Handling**: Proper error propagation if update fails or resource not found

#### Conflict Detection
The system detects various conflict error patterns from API responses:
- "already taken", "been taken", "already exists"
- "duplicate", "conflict", "name taken", "slug taken"
- Handles both string and array error message formats

---

For questions about the project structure, please open an issue or reach out to the maintainers.
