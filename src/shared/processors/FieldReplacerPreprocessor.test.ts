import { beforeEach, describe, expect, it, vi } from "vitest";
import { FieldReplacerPreprocessor } from "./FieldReplacerPreprocessor";
import type { ResourceMappingRegistry } from "../../core/services/ResourceMappingRegistry";
import { ResourceType, type StoryblokResource } from "../../core/types/types";

// Test resource interface
interface TestResource extends StoryblokResource {
  parent_id: number;
  author_id: string;
  category_id: number;
  optional_field?: string;
}

describe("FieldReplacerPreprocessor", () => {
  let mockRegistry: ResourceMappingRegistry;
  let testResource: TestResource;

  beforeEach(() => {
    // Reset all mocks
    vi.clearAllMocks();

    // Create test resource
    testResource = {
      id: 1,
      uuid: "test-uuid",
      parent_id: 1,
      author_id: "author-uuid",
      category_id: 2,
      optional_field: "optional-value",
    };

    // Mock mapping registry
    mockRegistry = {
      get: vi.fn().mockReturnValue({
        oldIdToNewIdMap: new Map([
          [1, 101],
          [2, 102],
          [3, 103],
        ]),
        oldUuidToNewUuidMap: new Map([
          ["author-uuid", "new-author-uuid"],
          ["old-uuid", "new-uuid"],
        ]),
      }),
    } as any;
  });

  describe("High Priority Tests", () => {
    it("should update field when mapping exists", () => {
      const preprocessor = new FieldReplacerPreprocessor<
        "parent_id",
        TestResource
      >({
        contextStore: ResourceType.STORIES,
        resourceField: "parent_id",
        contextStoreItem: "oldIdToNewIdMap",
      });

      const result = preprocessor.preprocess(testResource, mockRegistry);

      expect(result.parent_id).toBe(101);
      expect(result).not.toBe(testResource); // Should return new object
      expect(result.id).toBe(testResource.id); // Other fields unchanged
      expect(result.uuid).toBe(testResource.uuid);
      expect(result.author_id).toBe(testResource.author_id);
    });

    it("should return unchanged resource when no mapping exists", () => {
      const preprocessor = new FieldReplacerPreprocessor<
        "parent_id",
        TestResource
      >({
        contextStore: ResourceType.STORIES,
        resourceField: "parent_id",
        contextStoreItem: "oldIdToNewIdMap",
      });

      // Create resource with ID that doesn't exist in mapping
      const resourceWithUnknownId = {
        ...testResource,
        parent_id: 999, // Not in mapping
      };

      const result = preprocessor.preprocess(
        resourceWithUnknownId,
        mockRegistry
      );

      expect(result).toEqual(resourceWithUnknownId);
      expect(result.parent_id).toBe(999);
    });

    it("should handle missing field in resource", () => {
      const preprocessor = new FieldReplacerPreprocessor({
        contextStore: ResourceType.STORIES,
        resourceField: "non_existent_field" as any,
        contextStoreItem: "oldIdToNewIdMap",
      });

      const result = preprocessor.preprocess(testResource as any, mockRegistry);

      expect(result).toEqual(testResource);
      expect(result).toBe(testResource); // Should return same object
    });

    it("should handle null/undefined field values", () => {
      const preprocessor = new FieldReplacerPreprocessor({
        contextStore: ResourceType.STORIES,
        resourceField: "optional_field",
        contextStoreItem: "oldIdToNewIdMap",
      });

      // Test with undefined field
      const resourceWithUndefinedField = {
        ...testResource,
        optional_field: undefined,
      };

      const result1 = preprocessor.preprocess(
        resourceWithUndefinedField,
        mockRegistry
      );
      expect(result1).toEqual(resourceWithUndefinedField);

      // Test with null field
      const resourceWithNullField = {
        ...testResource,
        optional_field: null as any,
      };

      const result2 = preprocessor.preprocess(
        resourceWithNullField,
        mockRegistry
      );
      expect(result2).toEqual(resourceWithNullField);
    });

    it("should handle empty mapping registry", () => {
      const emptyRegistry = {
        get: vi.fn().mockReturnValue({
          oldIdToNewIdMap: new Map(),
          oldUuidToNewUuidMap: new Map(),
        }),
      } as any;

      const preprocessor = new FieldReplacerPreprocessor({
        contextStore: ResourceType.STORIES,
        resourceField: "parent_id",
        contextStoreItem: "oldIdToNewIdMap",
      });

      const result = preprocessor.preprocess(testResource, emptyRegistry);

      expect(result).toEqual(testResource);
      expect(result.parent_id).toBe(1); // Unchanged
    });

    it("should use correct mapping store (ID vs UUID)", () => {
      // Test ID mapping
      const idPreprocessor = new FieldReplacerPreprocessor({
        contextStore: ResourceType.STORIES,
        resourceField: "parent_id",
        contextStoreItem: "oldIdToNewIdMap",
      });

      const idResult = idPreprocessor.preprocess(testResource, mockRegistry);
      expect(idResult.parent_id).toBe(101);

      // Test UUID mapping
      const uuidPreprocessor = new FieldReplacerPreprocessor({
        contextStore: ResourceType.COLLABORATORS,
        resourceField: "author_id",
        contextStoreItem: "oldUuidToNewUuidMap",
      });

      const uuidResult = uuidPreprocessor.preprocess(
        testResource,
        mockRegistry
      );
      expect(uuidResult.author_id).toBe("new-author-uuid");
    });
  });

  describe("Medium Priority Tests", () => {
    it("should work with string field replacement", () => {
      const preprocessor = new FieldReplacerPreprocessor({
        contextStore: ResourceType.COLLABORATORS,
        resourceField: "author_id",
        contextStoreItem: "oldUuidToNewUuidMap",
      });

      const result = preprocessor.preprocess(testResource, mockRegistry);

      expect(result.author_id).toBe("new-author-uuid");
      expect(result.parent_id).toBe(testResource.parent_id); // Other fields unchanged
    });

    it("should work with number field replacement", () => {
      const preprocessor = new FieldReplacerPreprocessor({
        contextStore: ResourceType.STORIES,
        resourceField: "category_id",
        contextStoreItem: "oldIdToNewIdMap",
      });

      const result = preprocessor.preprocess(testResource, mockRegistry);

      expect(result.category_id).toBe(102);
      expect(result.parent_id).toBe(testResource.parent_id); // Other fields unchanged
    });

    it("should use correct resource type context", () => {
      const storiesRegistry = {
        get: vi.fn().mockImplementation((resourceType: ResourceType) => {
          if (resourceType === ResourceType.STORIES) {
            return {
              oldIdToNewIdMap: new Map([[1, 101]]),
              oldUuidToNewUuidMap: new Map(),
            };
          }
          return {
            oldIdToNewIdMap: new Map(),
            oldUuidToNewUuidMap: new Map(),
          };
        }),
      } as any;

      const preprocessor = new FieldReplacerPreprocessor({
        contextStore: ResourceType.STORIES,
        resourceField: "parent_id",
        contextStoreItem: "oldIdToNewIdMap",
      });

      const result = preprocessor.preprocess(testResource, storiesRegistry);

      expect(result.parent_id).toBe(101);
      expect(storiesRegistry.get).toHaveBeenCalledWith(ResourceType.STORIES);
    });

    it("should throw error when context store is missing", () => {
      const registryWithMissingContext = {
        get: vi.fn().mockReturnValue(undefined),
      } as any;

      const preprocessor = new FieldReplacerPreprocessor({
        contextStore: ResourceType.STORIES,
        resourceField: "parent_id",
        contextStoreItem: "oldIdToNewIdMap",
      });

      // Should throw error when trying to access undefined context store
      expect(() => {
        preprocessor.preprocess(testResource, registryWithMissingContext);
      }).toThrow("Cannot read properties of undefined");
    });

    it("should preserve all other resource properties", () => {
      const preprocessor = new FieldReplacerPreprocessor<
        "parent_id",
        TestResource
      >({
        contextStore: ResourceType.STORIES,
        resourceField: "parent_id",
        contextStoreItem: "oldIdToNewIdMap",
      });

      const result = preprocessor.preprocess(testResource, mockRegistry);

      // Verify all original properties are preserved
      expect(result.id).toBe(testResource.id);
      expect(result.uuid).toBe(testResource.uuid);
      expect(result.author_id).toBe(testResource.author_id);
      expect(result.category_id).toBe(testResource.category_id);
      expect(result.optional_field).toBe(testResource.optional_field);

      // Only the target field should be changed
      expect(result.parent_id).toBe(101);
    });

    it("should work with different resource types", () => {
      const preprocessor = new FieldReplacerPreprocessor({
        contextStore: ResourceType.ASSETS,
        resourceField: "parent_id",
        contextStoreItem: "oldIdToNewIdMap",
      });

      const result = preprocessor.preprocess(testResource, mockRegistry);

      // Should work regardless of resource type
      expect(result.parent_id).toBe(101);
      expect(mockRegistry.get).toHaveBeenCalledWith(ResourceType.ASSETS);
    });

    it("should handle multiple field replacements in sequence", () => {
      const parentIdPreprocessor = new FieldReplacerPreprocessor<
        "parent_id",
        TestResource
      >({
        contextStore: ResourceType.STORIES,
        resourceField: "parent_id",
        contextStoreItem: "oldIdToNewIdMap",
      });

      const authorIdPreprocessor = new FieldReplacerPreprocessor<
        "author_id",
        TestResource
      >({
        contextStore: ResourceType.COLLABORATORS,
        resourceField: "author_id",
        contextStoreItem: "oldUuidToNewUuidMap",
      });

      // Apply first preprocessor
      const result1 = parentIdPreprocessor.preprocess(
        testResource,
        mockRegistry
      );
      expect(result1.parent_id).toBe(101);
      expect(result1.author_id).toBe(testResource.author_id);

      // Apply second preprocessor
      const result2 = authorIdPreprocessor.preprocess(result1, mockRegistry);
      expect(result2.parent_id).toBe(101); // Still updated
      expect(result2.author_id).toBe("new-author-uuid"); // Now updated
    });
  });
});
