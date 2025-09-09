import type { ResourceIntegrationTestConfig } from "src/tests/resource-integration.test";
import DatasourceEntryResourceCollectionRestoreService from "../services/DatasourceEntryResourceCollectionRestoreService";
import { ResourceType } from "@core/types/types";

const config: ResourceIntegrationTestConfig = {
  name: "Mixed Datasource Entries",
  description: "Test datasource entries with different datasource dependencies",
  ServiceClass: DatasourceEntryResourceCollectionRestoreService,
  initialMappingRegistry: {
    [ResourceType.DATASOURCES]: {
      oldIdToNewIdMap: {
        100001: 200001, // First datasource mapping
        100002: 200002, // Second datasource mapping
      },
      oldUuidToNewUuidMap: {},
    },
  },
  resources: [
    {
      input: {
        id: 100001,
        name: "test-entry-1",
        value: "test-value-1",
        dimension_value: "",
        datasource_id: 100001, // Should be replaced with first mapped ID
      },
      expectedApiCall: {
        endpointSuffix: "datasource_entries",
        body: {
          datasource_entry: {
            id: 100001,
            name: "test-entry-1",
            value: "test-value-1",
            dimension_value: "",
            datasource_id: 200001, // Should be replaced with first mapped ID
          },
          publish: 1,
        },
      },
      mockResponse: {
        data: {
          datasource_entry: {
            id: 200001, // New ID after restoration
            name: "test-entry-1",
            value: "test-value-1",
            dimension_value: "",
            datasource_id: 200001,
          },
        },
      },
    },
    {
      input: {
        id: 100002,
        name: "test-entry-2",
        value: "test-value-2",
        dimension_value: "",
        datasource_id: 100002, // Should be replaced with second mapped ID
      },
      expectedApiCall: {
        endpointSuffix: "datasource_entries",
        body: {
          datasource_entry: {
            id: 100002,
            name: "test-entry-2",
            value: "test-value-2",
            dimension_value: "",
            datasource_id: 200002, // Should be replaced with second mapped ID
          },
          publish: 1,
        },
      },
      mockResponse: {
        data: {
          datasource_entry: {
            id: 200002, // New ID after restoration
            name: "test-entry-2",
            value: "test-value-2",
            dimension_value: "",
            datasource_id: 200002,
          },
        },
      },
    },
    {
      input: {
        id: 100003,
        name: "test-entry-3",
        value: "test-value-3",
        dimension_value: "",
        datasource_id: 100001, // Should be replaced with first mapped ID again
      },
      expectedApiCall: {
        endpointSuffix: "datasource_entries",
        body: {
          datasource_entry: {
            id: 100003,
            name: "test-entry-3",
            value: "test-value-3",
            dimension_value: "",
            datasource_id: 200001, // Should be replaced with first mapped ID again
          },
          publish: 1,
        },
      },
      mockResponse: {
        data: {
          datasource_entry: {
            id: 200003, // New ID after restoration
            name: "test-entry-3",
            value: "test-value-3",
            dimension_value: "",
            datasource_id: 200001,
          },
        },
      },
    },
  ],
  expectedFinalMappingRegistry: {
    [ResourceType.DATASOURCES]: {
      oldIdToNewIdMap: {
        100001: 200001, // First datasource mapping
        100002: 200002, // Second datasource mapping
      },
      oldUuidToNewUuidMap: {},
    },
    [ResourceType.DATASOURCE_ENTRIES]: {
      oldIdToNewIdMap: {
        100001: 200001, // First entry mapping
        100002: 200002, // Second entry mapping
        100003: 200003, // Third entry mapping
      },
      oldUuidToNewUuidMap: {},
    },
  },
};

export default config;
