import type { ResourceIntegrationTestConfig } from "src/tests/resource-integration.test";
import AssetFolderResourceCollectionRestoreService from "../services/AssetFolderResourceCollectionRestoreService";
import { ResourceType } from "@core/types/types";

const config: ResourceIntegrationTestConfig = {
  name: "Asset Folder with parent",
  description: "Test the asset folder with parent",
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
    {
      input: {
        id: 2,
        name: "F2",
        parent_id: 1,
        uuid: "folder-2",
        parent_uuid: "folder-1",
      },
      expectedApiCall: {
        endpointSuffix: "asset_folders",
        body: {
          asset_folder: {
            id: 2,
            name: "F2",
            parent_id: 11,
            uuid: "folder-2",
            parent_uuid: "folder-1",
          },
          publish: 1,
        },
      },
      mockResponse: {
        data: {
          asset_folder: {
            id: 12,
            name: "F2",
            parent_id: 11,
            uuid: "folder-12",
            parent_uuid: "folder-1",
          },
        },
      },
    },
  ],
  expectedFinalMappingRegistry: {
    [ResourceType.ASSET_FOLDERS]: {
      oldIdToNewIdMap: {
        1: 11,
        2: 12,
      },
      oldUuidToNewUuidMap: {
        "folder-1": "folder-11",
        "folder-2": "folder-12",
      },
    },
  },
};

export default config;
