import type { ResourceIntegrationTestConfig } from "src/tests/resource-integration.test";
import AssetFolderResourceCollectionRestoreService from "../services/AssetFolderBulkRestoreService";

const config: ResourceIntegrationTestConfig = {
  name: "Simple Asset Folder",
  description: "Test the simple asset folder",
  ServiceClass: AssetFolderResourceCollectionRestoreService,
  resources: [
    {
      input: {
        id: 1,
        name: "F1",
        parent_id: 0,
        uuid: "folder-1",
        parent_uuid: null,
      },
      expectedApiCall: {
        endpointSuffix: "asset_folders",
        body: {
          asset_folder: {
            id: 1,
            name: "F1",
            parent_id: 0,
            uuid: "folder-1",
            parent_uuid: null,
          },
          publish: 1,
        },
      },
      mockResponse: {
        data: {
          asset_folder: {
            id: 11,
            name: "F1",
            parent_id: 0,
            uuid: "folder-11",
            parent_uuid: null,
          },
        },
      },
    },
  ],
};

export default config;
