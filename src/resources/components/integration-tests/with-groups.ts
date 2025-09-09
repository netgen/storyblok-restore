import type { ResourceIntegrationTestConfig } from "src/tests/resource-integration.test";
import ComponentResourceCollectionRestoreService from "../services/ComponentResourceCollectionRestoreService";
import { ResourceType } from "@core/types/types";

const config: ResourceIntegrationTestConfig = {
  name: "Components with Groups",
  description:
    "Test components with component_group_uuid dependencies and UUID mapping",
  ServiceClass: ComponentResourceCollectionRestoreService,
  initialMappingRegistry: {
    [ResourceType.COMPONENT_GROUPS]: {
      oldIdToNewIdMap: {},
      oldUuidToNewUuidMap: {
        "test-group-uuid-1": "new-group-uuid-1",
        "test-group-uuid-2": "new-group-uuid-2",
        "test-group-uuid-3": "new-group-uuid-3",
      },
    },
  },
  resources: [
    {
      input: {
        name: "test-hero",
        display_name: null,
        description: "",
        created_at: "2025-01-01T00:00:00.000Z",
        updated_at: "2025-01-01T00:00:00.000Z",
        id: 100001,
        schema: {
          title: {
            type: "text",
            pos: 0,
            id: "test-field-id-3",
          },
          description: {
            type: "richtext",
            pos: 1,
            id: "test-field-id-4",
          },
        },
        image: null,
        preview_field: null,
        is_root: true,
        preview_tmpl: null,
        is_nestable: true,
        all_presets: [],
        preset_id: null,
        real_name: "test-hero",
        component_group_uuid: "test-group-uuid-1",
        color: null,
        icon: null,
        internal_tags_list: [],
        internal_tag_ids: [],
        content_type_asset_preview: null,
        metadata: {},
      },
      expectedApiCall: {
        endpointSuffix: "components",
        body: {
          component: {
            name: "test-hero",
            display_name: null,
            description: "",
            created_at: "2025-01-01T00:00:00.000Z",
            updated_at: "2025-01-01T00:00:00.000Z",
            id: 100001,
            schema: {
              title: {
                type: "text",
                pos: 0,
                id: "test-field-id-3",
              },
              description: {
                type: "richtext",
                pos: 1,
                id: "test-field-id-4",
              },
            },
            image: null,
            preview_field: null,
            is_root: true,
            preview_tmpl: null,
            is_nestable: true,
            all_presets: [],
            preset_id: null,
            real_name: "test-hero",
            component_group_uuid: "new-group-uuid-1", // Should be replaced
            color: null,
            icon: null,
            internal_tags_list: [],
            internal_tag_ids: [],
            content_type_asset_preview: null,
            metadata: {},
          },
          publish: 1,
        },
      },
      mockResponse: {
        data: {
          component: {
            name: "test-hero",
            display_name: null,
            description: "",
            created_at: "2025-01-01T00:00:00.000Z",
            updated_at: "2025-01-01T00:00:00.000Z",
            id: 200001, // New ID after restoration
            schema: {
              title: {
                type: "text",
                pos: 0,
                id: "test-field-id-3",
              },
              description: {
                type: "richtext",
                pos: 1,
                id: "test-field-id-4",
              },
            },
            image: null,
            preview_field: null,
            is_root: true,
            preview_tmpl: null,
            is_nestable: true,
            all_presets: [],
            preset_id: null,
            real_name: "test-hero",
            component_group_uuid:
              "new-hero-group-uuid-1234-5678-9abc-def012345678",
            color: null,
            icon: null,
            internal_tags_list: [],
            internal_tag_ids: [],
            content_type_asset_preview: null,
            metadata: {},
          },
        },
      },
    },
    {
      input: {
        name: "test-text",
        display_name: null,
        description: "",
        created_at: "2025-01-01T00:00:00.000Z",
        updated_at: "2025-01-01T00:00:00.000Z",
        id: 100002,
        schema: {
          text: {
            type: "text",
            pos: 0,
            required: true,
            id: "test-field-id-5",
          },
        },
        image: null,
        preview_field: null,
        is_root: false,
        preview_tmpl: null,
        is_nestable: true,
        all_presets: [],
        preset_id: null,
        real_name: "test-text",
        component_group_uuid: "test-group-uuid-2",
        color: null,
        icon: null,
        internal_tags_list: [],
        internal_tag_ids: [],
        content_type_asset_preview: null,
        metadata: {},
      },
      expectedApiCall: {
        endpointSuffix: "components",
        body: {
          component: {
            name: "test-text",
            display_name: null,
            description: "",
            created_at: "2025-01-01T00:00:00.000Z",
            updated_at: "2025-01-01T00:00:00.000Z",
            id: 100002,
            schema: {
              text: {
                type: "text",
                pos: 0,
                required: true,
                id: "test-field-id-5",
              },
            },
            image: null,
            preview_field: null,
            is_root: false,
            preview_tmpl: null,
            is_nestable: true,
            all_presets: [],
            preset_id: null,
            real_name: "test-text",
            component_group_uuid: "new-group-uuid-2", // Should be replaced
            color: null,
            icon: null,
            internal_tags_list: [],
            internal_tag_ids: [],
            content_type_asset_preview: null,
            metadata: {},
          },
          publish: 1,
        },
      },
      mockResponse: {
        data: {
          component: {
            name: "test-text",
            display_name: null,
            description: "",
            created_at: "2025-01-01T00:00:00.000Z",
            updated_at: "2025-01-01T00:00:00.000Z",
            id: 200002, // New ID after restoration
            schema: {
              text: {
                type: "text",
                pos: 0,
                required: true,
                id: "test-field-id-5",
              },
            },
            image: null,
            preview_field: null,
            is_root: false,
            preview_tmpl: null,
            is_nestable: true,
            all_presets: [],
            preset_id: null,
            real_name: "test-text",
            component_group_uuid:
              "new-blocks-group-uuid-1234-5678-9abc-def012345678",
            color: null,
            icon: null,
            internal_tags_list: [],
            internal_tag_ids: [],
            content_type_asset_preview: null,
            metadata: {},
          },
        },
      },
    },
  ],
  expectedFinalMappingRegistry: {
    [ResourceType.COMPONENT_GROUPS]: {
      oldIdToNewIdMap: {},
      oldUuidToNewUuidMap: {
        "test-group-uuid-1": "new-group-uuid-1",
        "test-group-uuid-2": "new-group-uuid-2",
        "test-group-uuid-3": "new-group-uuid-3",
      },
    },
    [ResourceType.COMPONENTS]: {
      oldIdToNewIdMap: {
        100001: 200001, // Hero component mapping
        100002: 200002, // Text component mapping
      },
      oldUuidToNewUuidMap: {},
    },
  },
};

export default config;
