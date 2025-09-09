import type { ResourceIntegrationTestConfig } from "src/tests/resource-integration.test";
import CollaboratorResourceCollectionRestoreService from "../services/CollaboratorResourceCollectionRestoreService";

const config: ResourceIntegrationTestConfig = {
  name: "Simple Collaborator",
  description: "Test the simple collaborator restoration",
  ServiceClass: CollaboratorResourceCollectionRestoreService,
  resources: [
    {
      input: {
        user: {
          id: 100001,
          firstname: "Test",
          lastname: "User",
          alt_email: null,
          disabled: false,
          avatar: "avatars/100001/test-avatar.png",
          userid: "testuser",
          friendly_name: "Test User",
        },
        role: "editor",
        user_id: 100001,
        permissions: ["can_subscribe"],
        allowed_path: "",
        field_permissions: "",
        id: 200001,
        space_role_id: null,
        invitation: null,
        space_role_ids: [],
        space_id: 999999,
      },
      expectedApiCall: {
        endpointSuffix: "collaborators",
        body: {
          collaborator: {
            user: {
              id: 100001,
              firstname: "Test",
              lastname: "User",
              alt_email: null,
              disabled: false,
              avatar: "avatars/100001/test-avatar.png",
              userid: "testuser",
              friendly_name: "Test User",
            },
            role: "editor",
            user_id: 100001,
            permissions: ["can_subscribe"],
            allowed_path: "",
            field_permissions: "",
            id: 200001,
            space_role_id: null,
            invitation: null,
            space_role_ids: [],
            space_id: 999999,
          },
          publish: 1,
        },
      },
      mockResponse: {
        data: {
          collaborator: {
            user: {
              id: 100001,
              firstname: "Test",
              lastname: "User",
              alt_email: null,
              disabled: false,
              avatar: "avatars/100001/test-avatar.png",
              userid: "testuser",
              friendly_name: "Test User",
            },
            role: "editor",
            user_id: 100001,
            permissions: ["can_subscribe"],
            allowed_path: "",
            field_permissions: "",
            id: 200002, // New ID after restoration
            space_role_id: null,
            invitation: null,
            space_role_ids: [],
            space_id: 999999,
          },
        },
      },
    },
  ],
};

export default config;
