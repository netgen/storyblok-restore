import type { ResourceIntegrationTestConfig } from "src/tests/resource-integration.test";
import DatasourceResourceCollectionRestoreService from "../services/DatasourceResourceCollectionRestoreService";

const config: ResourceIntegrationTestConfig = {
  name: "Simple Datasources",
  description: "Test simple datasources with basic fields and no dependencies",
  ServiceClass: DatasourceResourceCollectionRestoreService,
  resources: [
    {
      input: {
        id: 100001,
        name: "test-datasource-1",
        slug: "test-datasource-1",
        dimensions: [],
        created_at: "2025-01-01T00:00:00.000Z",
        updated_at: "2025-01-01T00:00:00.000Z",
      },
      expectedApiCall: {
        endpointSuffix: "datasources",
        body: {
          datasource: {
            id: 100001,
            name: "test-datasource-1",
            slug: "test-datasource-1",
            dimensions: [],
            created_at: "2025-01-01T00:00:00.000Z",
            updated_at: "2025-01-01T00:00:00.000Z",
          },
          publish: 1,
        },
      },
      mockResponse: {
        data: {
          datasource: {
            id: 200001, // New ID after restoration
            name: "test-datasource-1",
            slug: "test-datasource-1",
            dimensions: [],
            created_at: "2025-01-01T00:00:00.000Z",
            updated_at: "2025-01-01T00:00:00.000Z",
          },
        },
      },
    },
    {
      input: {
        id: 100002,
        name: "test-datasource-2",
        slug: "test-datasource-2",
        dimensions: [],
        created_at: "2025-01-01T00:00:00.000Z",
        updated_at: "2025-01-01T00:00:00.000Z",
      },
      expectedApiCall: {
        endpointSuffix: "datasources",
        body: {
          datasource: {
            id: 100002,
            name: "test-datasource-2",
            slug: "test-datasource-2",
            dimensions: [],
            created_at: "2025-01-01T00:00:00.000Z",
            updated_at: "2025-01-01T00:00:00.000Z",
          },
          publish: 1,
        },
      },
      mockResponse: {
        data: {
          datasource: {
            id: 200002, // New ID after restoration
            name: "test-datasource-2",
            slug: "test-datasource-2",
            dimensions: [],
            created_at: "2025-01-01T00:00:00.000Z",
            updated_at: "2025-01-01T00:00:00.000Z",
          },
        },
      },
    },
  ],
  expectedFinalMappingRegistry: {
    datasources: {
      oldIdToNewIdMap: {
        100001: 200001, // First datasource mapping
        100002: 200002, // Second datasource mapping
      },
      oldUuidToNewUuidMap: {},
    },
  },
};

export default config;
