import type { ResourceIntegrationTestConfig } from "src/tests/resource-integration.test";
import WebhookResourceCollectionRestoreService from "../services/WebhookResourceCollectionRestoreService";
import { ResourceType } from "@core/types/types";

const config: ResourceIntegrationTestConfig = {
  name: "Simple Webhooks",
  description: "Test basic webhook restoration with different configurations",
  ServiceClass: WebhookResourceCollectionRestoreService,
  initialMappingRegistry: {},
  resources: [
    {
      input: {
        id: 100001,
        name: "test-webhook-1",
        description: "Test webhook for cache purging",
        endpoint: "https://test.example.com/api/purge?secret=test-secret-1",
        space_id: 100001,
        secret: "test-secret-1",
        actions: ["story.published", "story.unpublished", "story.deleted"],
        activated: true,
        deleted_at: null,
        created_at: "2025-01-01T00:00:00.000Z",
        updated_at: "2025-01-01T00:00:00.000Z",
      },
      expectedApiCall: {
        endpointSuffix: "webhook_endpoints",
        body: {
          webhook_endpoint: {
            id: 100001,
            name: "test-webhook-1",
            description: "Test webhook for cache purging",
            endpoint: "https://test.example.com/api/purge?secret=test-secret-1",
            space_id: 100001,
            actions: ["story.published", "story.unpublished", "story.deleted"],
            activated: true,
            deleted_at: null,
            created_at: "2025-01-01T00:00:00.000Z",
            updated_at: "2025-01-01T00:00:00.000Z",
            // secret field should be stripped
          },
          publish: 1,
        },
      },
      mockResponse: {
        data: {
          webhook_endpoint: {
            id: 200001, // New ID after restoration
            name: "test-webhook-1",
            description: "Test webhook for cache purging",
            endpoint: "https://test.example.com/api/purge?secret=test-secret-1",
            space_id: 100001,
            secret: "", // Secret is empty in response
            actions: ["story.published", "story.unpublished", "story.deleted"],
            activated: true,
            deleted_at: null,
            created_at: "2025-01-01T00:00:00.000Z",
            updated_at: "2025-01-01T00:00:00.000Z",
          },
        },
      },
    },
    {
      input: {
        id: 100002,
        name: "test-webhook-2",
        description: "Test webhook for asset processing",
        endpoint:
          "https://test.example.com/api/process-assets?secret=test-secret-2",
        space_id: 100001,
        secret: "test-secret-2",
        actions: ["asset.replaced", "asset.created"],
        activated: false,
        deleted_at: null,
        created_at: "2025-01-01T00:00:00.000Z",
        updated_at: "2025-01-01T00:00:00.000Z",
      },
      expectedApiCall: {
        endpointSuffix: "webhook_endpoints",
        body: {
          webhook_endpoint: {
            id: 100002,
            name: "test-webhook-2",
            description: "Test webhook for asset processing",
            endpoint:
              "https://test.example.com/api/process-assets?secret=test-secret-2",
            space_id: 100001,
            actions: ["asset.replaced", "asset.created"],
            activated: false,
            deleted_at: null,
            created_at: "2025-01-01T00:00:00.000Z",
            updated_at: "2025-01-01T00:00:00.000Z",
            // secret field should be stripped
          },
          publish: 1,
        },
      },
      mockResponse: {
        data: {
          webhook_endpoint: {
            id: 200002, // New ID after restoration
            name: "test-webhook-2",
            description: "Test webhook for asset processing",
            endpoint:
              "https://test.example.com/api/process-assets?secret=test-secret-2",
            space_id: 100001,
            secret: "", // Secret is empty in response
            actions: ["asset.replaced", "asset.created"],
            activated: false,
            deleted_at: null,
            created_at: "2025-01-01T00:00:00.000Z",
            updated_at: "2025-01-01T00:00:00.000Z",
          },
        },
      },
    },
  ],
  expectedFinalMappingRegistry: {
    [ResourceType.WEBHOOKS]: {
      oldIdToNewIdMap: {
        100001: 200001, // First webhook mapping
        100002: 200002, // Second webhook mapping
      },
      oldUuidToNewUuidMap: {},
    },
  },
};

export default config;
