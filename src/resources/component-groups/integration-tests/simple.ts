import type { ResourceIntegrationTestConfig } from "src/tests/resource-integration.test";
import ComponentGroupResourceCollectionRestoreService from "../services/ComponentGroupResourceCollectionRestoreService";

const config: ResourceIntegrationTestConfig = {
  name: "Simple Component Groups",
  description:
    "Test simple component groups with no parent-child relationships",
  ServiceClass: ComponentGroupResourceCollectionRestoreService,
  resources: [
    {
      input: {
        name: "test-group-1",
        id: 100001,
        uuid: "test-uuid-1234-5678-9abc-def012345678",
        parent_id: null,
        parent_uuid: null,
      },
      expectedApiCall: {
        endpointSuffix: "component_groups",
        body: {
          component_group: {
            name: "test-group-1",
            id: 100001,
            uuid: "test-uuid-1234-5678-9abc-def012345678",
            parent_id: null,
            parent_uuid: null,
          },
          publish: 1,
        },
      },
      mockResponse: {
        data: {
          component_group: {
            name: "test-group-1",
            id: 200001, // New ID after restoration
            uuid: "test-uuid-1234-5678-9abc-def012345678",
            parent_id: null,
            parent_uuid: null,
          },
        },
      },
    },
    {
      input: {
        name: "test-group-2",
        id: 100002,
        uuid: "test-uuid-2345-6789-abcd-ef0123456789",
        parent_id: null,
        parent_uuid: null,
      },
      expectedApiCall: {
        endpointSuffix: "component_groups",
        body: {
          component_group: {
            name: "test-group-2",
            id: 100002,
            uuid: "test-uuid-2345-6789-abcd-ef0123456789",
            parent_id: null,
            parent_uuid: null,
          },
          publish: 1,
        },
      },
      mockResponse: {
        data: {
          component_group: {
            name: "test-group-2",
            id: 200002, // New ID after restoration
            uuid: "test-uuid-2345-6789-abcd-ef0123456789",
            parent_id: null,
            parent_uuid: null,
          },
        },
      },
    },
  ],
};

export default config;
