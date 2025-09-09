import type { ResourceIntegrationTestConfig } from "src/tests/resource-integration.test";
import ComponentGroupResourceCollectionRestoreService from "../services/ComponentGroupResourceCollectionRestoreService";
import { ResourceType } from "@core/types/types";

const config: ResourceIntegrationTestConfig = {
  name: "Nested Component Groups",
  description:
    "Test component groups with parent-child relationships and ID mapping",
  ServiceClass: ComponentGroupResourceCollectionRestoreService,
  resources: [
    {
      input: {
        name: "parent-group",
        id: 100001,
        uuid: "parent-uuid-1234-5678-9abc-def012345678",
        parent_id: null,
        parent_uuid: null,
      },
      expectedApiCall: {
        endpointSuffix: "component_groups",
        body: {
          component_group: {
            name: "parent-group",
            id: 100001,
            uuid: "parent-uuid-1234-5678-9abc-def012345678",
            parent_id: null,
            parent_uuid: null,
          },
          publish: 1,
        },
      },
      mockResponse: {
        data: {
          component_group: {
            name: "blocks",
            id: 200001, // New ID after restoration
            uuid: "1d2e904e-ec74-4007-a3f8-dbb6a785d0d3",
            parent_id: null,
            parent_uuid: null,
          },
        },
      },
    },
    {
      input: {
        name: "child-group-1",
        id: 100002,
        uuid: "child-uuid-1234-5678-9abc-def012345678",
        parent_id: 100001, // References parent group
        parent_uuid: "parent-uuid-1234-5678-9abc-def012345678",
      },
      expectedApiCall: {
        endpointSuffix: "component_groups",
        body: {
          component_group: {
            name: "child-group-1",
            id: 100002,
            uuid: "child-uuid-1234-5678-9abc-def012345678",
            parent_id: 200001, // Should be replaced with mapped parent ID
            parent_uuid: "parent-uuid-1234-5678-9abc-def012345678",
          },
          publish: 1,
        },
      },
      mockResponse: {
        data: {
          component_group: {
            name: "child-group-1",
            id: 200002, // New ID after restoration
            uuid: "child-uuid-1234-5678-9abc-def012345678",
            parent_id: 200001, // Mapped parent ID
            parent_uuid: "parent-uuid-1234-5678-9abc-def012345678",
          },
        },
      },
    },
    {
      input: {
        name: "child-group-2",
        id: 100003,
        uuid: "child-uuid-2345-6789-abcd-ef0123456789",
        parent_id: 100001, // References same parent group
        parent_uuid: "parent-uuid-1234-5678-9abc-def012345678",
      },
      expectedApiCall: {
        endpointSuffix: "component_groups",
        body: {
          component_group: {
            name: "child-group-2",
            id: 100003,
            uuid: "child-uuid-2345-6789-abcd-ef0123456789",
            parent_id: 200001, // Should be replaced with mapped parent ID
            parent_uuid: "parent-uuid-1234-5678-9abc-def012345678",
          },
          publish: 1,
        },
      },
      mockResponse: {
        data: {
          component_group: {
            name: "child-group-2",
            id: 200003, // New ID after restoration
            uuid: "child-uuid-2345-6789-abcd-ef0123456789",
            parent_id: 200001, // Mapped parent ID
            parent_uuid: "parent-uuid-1234-5678-9abc-def012345678",
          },
        },
      },
    },
  ],
  expectedFinalMappingRegistry: {
    [ResourceType.COMPONENT_GROUPS]: {
      oldIdToNewIdMap: {
        100001: 200001, // Parent group mapping
        100002: 200002, // First child mapping
        100003: 200003, // Second child mapping
      },
      oldUuidToNewUuidMap: {
        "parent-uuid-1234-5678-9abc-def012345678":
          "1d2e904e-ec74-4007-a3f8-dbb6a785d0d3",
        "child-uuid-1234-5678-9abc-def012345678":
          "child-uuid-1234-5678-9abc-def012345678",
        "child-uuid-2345-6789-abcd-ef0123456789":
          "child-uuid-2345-6789-abcd-ef0123456789",
      },
    },
  },
};

export default config;
