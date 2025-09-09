import type { ResourceIntegrationTestConfig } from "src/tests/resource-integration.test";
import CollaboratorResourceCollectionRestoreService from "../services/CollaboratorResourceCollectionRestoreService";

const config: ResourceIntegrationTestConfig = {
  name: "Complex Collaborators",
  description:
    "Test collaborators with different roles, permissions, and configurations",
  ServiceClass: CollaboratorResourceCollectionRestoreService,
  resources: [
    {
      input: {
        user: {
          id: 100002,
          firstname: "Jane",
          lastname: "Doe",
          alt_email: null,
          disabled: false,
          avatar: null,
          userid: "jane.doe@example.com",
          friendly_name: "Jane Doe",
        },
        role: "editor",
        user_id: 100002,
        permissions: [],
        allowed_path: "",
        field_permissions: "",
        id: 200003,
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
              id: 100002,
              firstname: "Jane",
              lastname: "Doe",
              alt_email: null,
              disabled: false,
              avatar: null,
              userid: "jane.doe@example.com",
              friendly_name: "Jane Doe",
            },
            role: "editor",
            user_id: 100002,
            permissions: [],
            allowed_path: "",
            field_permissions: "",
            id: 200003,
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
              id: 100002,
              firstname: "Jane",
              lastname: "Doe",
              alt_email: null,
              disabled: false,
              avatar: null,
              userid: "jane.doe@example.com",
              friendly_name: "Jane Doe",
            },
            role: "editor",
            user_id: 100002,
            permissions: [],
            allowed_path: "",
            field_permissions: "",
            id: 200004, // New ID after restoration
            space_role_id: null,
            invitation: null,
            space_role_ids: [],
            space_id: 999999,
          },
        },
      },
    },
    {
      input: {
        user: {
          id: 100003,
          firstname: "John",
          lastname: "Smith",
          alt_email: "john.alt@example.com",
          disabled: false,
          avatar: "avatars/100003/custom-avatar.jpg",
          userid: "john.smith@example.com",
          friendly_name: "John Smith",
        },
        role: "admin",
        user_id: 100003,
        permissions: [
          "can_subscribe",
          "can_manage_content",
          "can_manage_users",
        ],
        allowed_path: "/content/blog",
        field_permissions: "title,content",
        id: 200005,
        space_role_id: 123,
        invitation: {
          id: 456,
          email: "john.smith@example.com",
          status: "accepted",
        },
        space_role_ids: [123, 456],
        space_id: 999999,
      },
      expectedApiCall: {
        endpointSuffix: "collaborators",
        body: {
          collaborator: {
            user: {
              id: 100003,
              firstname: "John",
              lastname: "Smith",
              alt_email: "john.alt@example.com",
              disabled: false,
              avatar: "avatars/100003/custom-avatar.jpg",
              userid: "john.smith@example.com",
              friendly_name: "John Smith",
            },
            role: "admin",
            user_id: 100003,
            permissions: [
              "can_subscribe",
              "can_manage_content",
              "can_manage_users",
            ],
            allowed_path: "/content/blog",
            field_permissions: "title,content",
            id: 200005,
            space_role_id: 123,
            invitation: {
              id: 456,
              email: "john.smith@example.com",
              status: "accepted",
            },
            space_role_ids: [123, 456],
            space_id: 999999,
          },
          publish: 1,
        },
      },
      mockResponse: {
        data: {
          collaborator: {
            user: {
              id: 100003,
              firstname: "John",
              lastname: "Smith",
              alt_email: "john.alt@example.com",
              disabled: false,
              avatar: "avatars/100003/custom-avatar.jpg",
              userid: "john.smith@example.com",
              friendly_name: "John Smith",
            },
            role: "admin",
            user_id: 100003,
            permissions: [
              "can_subscribe",
              "can_manage_content",
              "can_manage_users",
            ],
            allowed_path: "/content/blog",
            field_permissions: "title,content",
            id: 200006, // New ID after restoration
            space_role_id: 123,
            invitation: {
              id: 456,
              email: "john.smith@example.com",
              status: "accepted",
            },
            space_role_ids: [123, 456],
            space_id: 999999,
          },
        },
      },
    },
  ],
};

export default config;
