import type { ResourceIntegrationTestConfig } from "src/tests/resource-integration.test";
import ComponentResourceCollectionRestoreService from "../services/ComponentResourceCollectionRestoreService";
import { ResourceType } from "@core/types/types";

const config: ResourceIntegrationTestConfig = {
  name: "Mixed Components",
  description:
    "Test mixed components with and without component group dependencies",
  ServiceClass: ComponentResourceCollectionRestoreService,
  initialMappingRegistry: {
    [ResourceType.COMPONENT_GROUPS]: {
      oldIdToNewIdMap: {},
      oldUuidToNewUuidMap: {
        "68e0ad27-ac84-4041-bc4b-0173a2bacea8":
          "new-hero-group-uuid-1234-5678-9abc-def012345678",
        "fe758bc2-137a-4a2e-bc4a-dfcf977a9b52":
          "new-content-group-uuid-1234-5678-9abc-def012345678",
      },
    },
  },
  resources: [
    {
      input: {
        name: "page",
        display_name: null,
        description: null,
        created_at: "2025-02-28T13:37:13.704Z",
        updated_at: "2025-04-09T08:53:17.236Z",
        id: 100001,
        schema: {
          body: {
            type: "bloks",
            id: "8pDN_pOCQ1yOr-V32iiVSw",
            pos: 0,
          },
        },
        image: null,
        preview_field: null,
        is_root: true,
        preview_tmpl: null,
        is_nestable: false,
        all_presets: [],
        preset_id: null,
        real_name: "page",
        component_group_uuid: null, // No group dependency
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
            name: "page",
            display_name: null,
            description: null,
            created_at: "2025-02-28T13:37:13.704Z",
            updated_at: "2025-04-09T08:53:17.236Z",
            id: 100001,
            schema: {
              body: {
                type: "bloks",
                id: "8pDN_pOCQ1yOr-V32iiVSw",
                pos: 0,
              },
            },
            image: null,
            preview_field: null,
            is_root: true,
            preview_tmpl: null,
            is_nestable: false,
            all_presets: [],
            preset_id: null,
            real_name: "page",
            component_group_uuid: null, // Should remain null
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
            name: "page",
            display_name: null,
            description: null,
            created_at: "2025-02-28T13:37:13.704Z",
            updated_at: "2025-04-09T08:53:17.236Z",
            id: 200001, // New ID after restoration
            schema: {
              body: {
                type: "bloks",
                id: "8pDN_pOCQ1yOr-V32iiVSw",
                pos: 0,
              },
            },
            image: null,
            preview_field: null,
            is_root: true,
            preview_tmpl: null,
            is_nestable: false,
            all_presets: [],
            preset_id: null,
            real_name: "page",
            component_group_uuid: null,
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
        name: "hero",
        display_name: null,
        description: "",
        created_at: "2025-04-02T13:16:21.098Z",
        updated_at: "2025-04-07T11:23:16.579Z",
        id: 100002,
        schema: {
          title: {
            type: "text",
            pos: 0,
            id: "WBBaRcLySgqKyxn1kbm_HA",
          },
        },
        image: null,
        preview_field: null,
        is_root: true,
        preview_tmpl: null,
        is_nestable: true,
        all_presets: [],
        preset_id: null,
        real_name: "hero",
        component_group_uuid: "68e0ad27-ac84-4041-bc4b-0173a2bacea8", // Has group dependency
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
            name: "hero",
            display_name: null,
            description: "",
            created_at: "2025-04-02T13:16:21.098Z",
            updated_at: "2025-04-07T11:23:16.579Z",
            id: 100002,
            schema: {
              title: {
                type: "text",
                pos: 0,
                id: "WBBaRcLySgqKyxn1kbm_HA",
              },
            },
            image: null,
            preview_field: null,
            is_root: true,
            preview_tmpl: null,
            is_nestable: true,
            all_presets: [],
            preset_id: null,
            real_name: "hero",
            component_group_uuid:
              "new-hero-group-uuid-1234-5678-9abc-def012345678", // Should be replaced
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
            name: "hero",
            display_name: null,
            description: "",
            created_at: "2025-04-02T13:16:21.098Z",
            updated_at: "2025-04-07T11:23:16.579Z",
            id: 200002, // New ID after restoration
            schema: {
              title: {
                type: "text",
                pos: 0,
                id: "WBBaRcLySgqKyxn1kbm_HA",
              },
            },
            image: null,
            preview_field: null,
            is_root: true,
            preview_tmpl: null,
            is_nestable: true,
            all_presets: [],
            preset_id: null,
            real_name: "hero",
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
        name: "article",
        display_name: null,
        description: "",
        created_at: "2025-03-01T09:24:48.448Z",
        updated_at: "2025-03-01T09:25:01.671Z",
        id: 100003,
        schema: {
          title: {
            type: "text",
            pos: 0,
            required: true,
            id: "article-title-field",
          },
          content: {
            type: "richtext",
            pos: 1,
            id: "article-content-field",
          },
        },
        image: null,
        preview_field: null,
        is_root: false,
        preview_tmpl: null,
        is_nestable: true,
        all_presets: [],
        preset_id: null,
        real_name: "article",
        component_group_uuid: "fe758bc2-137a-4a2e-bc4a-dfcf977a9b52", // Has different group dependency
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
            name: "article",
            display_name: null,
            description: "",
            created_at: "2025-03-01T09:24:48.448Z",
            updated_at: "2025-03-01T09:25:01.671Z",
            id: 100003,
            schema: {
              title: {
                type: "text",
                pos: 0,
                required: true,
                id: "article-title-field",
              },
              content: {
                type: "richtext",
                pos: 1,
                id: "article-content-field",
              },
            },
            image: null,
            preview_field: null,
            is_root: false,
            preview_tmpl: null,
            is_nestable: true,
            all_presets: [],
            preset_id: null,
            real_name: "article",
            component_group_uuid:
              "new-content-group-uuid-1234-5678-9abc-def012345678", // Should be replaced
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
            name: "article",
            display_name: null,
            description: "",
            created_at: "2025-03-01T09:24:48.448Z",
            updated_at: "2025-03-01T09:25:01.671Z",
            id: 200003, // New ID after restoration
            schema: {
              title: {
                type: "text",
                pos: 0,
                required: true,
                id: "article-title-field",
              },
              content: {
                type: "richtext",
                pos: 1,
                id: "article-content-field",
              },
            },
            image: null,
            preview_field: null,
            is_root: false,
            preview_tmpl: null,
            is_nestable: true,
            all_presets: [],
            preset_id: null,
            real_name: "article",
            component_group_uuid:
              "new-content-group-uuid-1234-5678-9abc-def012345678",
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
        "68e0ad27-ac84-4041-bc4b-0173a2bacea8":
          "new-hero-group-uuid-1234-5678-9abc-def012345678",
        "fe758bc2-137a-4a2e-bc4a-dfcf977a9b52":
          "new-content-group-uuid-1234-5678-9abc-def012345678",
      },
    },
    [ResourceType.COMPONENTS]: {
      oldIdToNewIdMap: {
        100001: 200001, // Page component mapping (no group)
        100002: 200002, // Hero component mapping (with group)
        100003: 200003, // Article component mapping (with different group)
      },
      oldUuidToNewUuidMap: {},
    },
  },
};

export default config;
