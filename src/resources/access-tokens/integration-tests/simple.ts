import type { ResourceIntegrationTestConfig } from "src/tests/resource-integration.test";
import AccessTokenResourceCollectionRestoreService from "../services/AccessTokenResourceCollectionRestoreService";

const config: ResourceIntegrationTestConfig = {
  name: "Simple Access Token",
  description: "Test the simple access token",
  ServiceClass: AccessTokenResourceCollectionRestoreService,
  resources: [
    {
      input: {
        id: 1,
        access: "private",
        branch_id: null,
        name: null,
        space_id: 1,
        token: "abc",
        story_ids: [],
        min_cache: 0,
        release_ids: [],
      },
      expectedApiCall: {
        endpointSuffix: "api_keys",
        body: {
          api_key: {
            id: 1,
            access: "private",
            branch_id: null,
            name: null,
            space_id: 1,
            token: "abc",
            story_ids: [],
            min_cache: 0,
            release_ids: [],
          },
          publish: 1,
        },
      },
      mockResponse: {
        data: {
          api_key: {
            id: 2,
            access: "private",
            branch_id: null,
            name: null,
            space_id: 1,
            token: "abc",
            story_ids: [],
            min_cache: 0,
            release_ids: [],
          },
        },
      },
    },
  ],
};

export default config;
