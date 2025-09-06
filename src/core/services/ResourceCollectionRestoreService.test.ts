import { describe, it, expect, vi, beforeEach } from "vitest";
import { ResourceCollectionRestoreService } from "./ResourceCollectionRestoreService";
import type {
  ResourceType,
  RestoreOptions,
  StoryblokResource,
} from "../types/types";
import type { ResourceMappingRegistry } from "./ResourceMappingRegistry";
import type { ResourceRestoreService } from "./ResourceRestoreService";
import type { SortingStrategy } from "../sort/SortingStrategy";
import type { ResourcePreprocessor } from "../processors/ResourcePreproceossor";
import type { ResourceCollectionPostprocessor } from "../processors/ResourceCollectionPostprocessor";
import { ResourceMappingRegistry as ResourceMappingRegistryClass } from "./ResourceMappingRegistry";
import { ResourceType as ResourceTypeEnum } from "../types/types";

// Mock resource type for testing
interface TestResource extends StoryblokResource {
  name: string;
  content: any;
}

// Mock implementations that properly implement the interfaces
class MockResourceRestoreService
  implements ResourceRestoreService<TestResource>
{
  canHandle = vi.fn().mockReturnValue(true);
  restore = vi.fn();
}

class MockSortingStrategy implements SortingStrategy<TestResource> {
  sort = vi.fn();
}

class MockPreprocessor implements ResourcePreprocessor<TestResource> {
  preprocess = vi.fn();
}

class MockPostProcessor
  implements ResourceCollectionPostprocessor<TestResource>
{
  postProcess = vi.fn();
}

// Concrete implementation for testing
class TestResourceCollectionRestoreService extends ResourceCollectionRestoreService<TestResource> {
  constructor(
    resourceType: ResourceType,
    restoreService: ResourceRestoreService<TestResource>,
    sortingStrategy?: SortingStrategy<TestResource>,
    resourcePreprocessor?:
      | ResourcePreprocessor<TestResource>
      | ResourcePreprocessor<TestResource>[],
    resourceCollectionPostProcessor?: ResourceCollectionPostprocessor<TestResource>
  ) {
    super(
      resourceType,
      restoreService,
      sortingStrategy,
      resourcePreprocessor,
      resourceCollectionPostProcessor
    );
  }
}

describe("ResourceCollectionRestoreService", () => {
  let service: TestResourceCollectionRestoreService;
  let mockRestoreService: ResourceRestoreService<TestResource>;
  let mockSortingStrategy: SortingStrategy<TestResource>;
  let mockPreprocessor: ResourcePreprocessor<TestResource>;
  let mockPostProcessor: ResourceCollectionPostprocessor<TestResource>;
  let mockMappingRegistry: ResourceMappingRegistry;
  let testOptions: RestoreOptions;

  beforeEach(() => {
    mockRestoreService = new MockResourceRestoreService();
    mockSortingStrategy = new MockSortingStrategy();
    mockPreprocessor = new MockPreprocessor();
    mockPostProcessor = new MockPostProcessor();

    mockMappingRegistry = new ResourceMappingRegistryClass();
    testOptions = {
      spaceId: "test-space-id",
      backupPath: "/test/backup",
    };

    service = new TestResourceCollectionRestoreService(
      ResourceTypeEnum.STORIES,
      mockRestoreService,
      mockSortingStrategy,
      mockPreprocessor,
      mockPostProcessor
    );
  });

  describe("High Priority Tests", () => {
    it("should restore all resources successfully", async () => {
      const resources: TestResource[] = [
        {
          id: 1,
          uuid: "uuid-1",
          name: "Resource 1",
          content: { title: "Title 1" },
        },
        {
          id: 2,
          uuid: "uuid-2",
          name: "Resource 2",
          content: { title: "Title 2" },
        },
      ];

      vi.mocked(mockPreprocessor.preprocess).mockImplementation(
        (resource) => resource
      );
      vi.mocked(mockRestoreService.restore)
        .mockResolvedValueOnce({
          id: 101,
          uuid: "new-uuid-1",
          name: "Resource 1",
          content: { title: "Title 1" },
        })
        .mockResolvedValueOnce({
          id: 102,
          uuid: "new-uuid-2",
          name: "Resource 2",
          content: { title: "Title 2" },
        });

      await service.restore(resources, testOptions, mockMappingRegistry);

      // Verify all resources were restored
      expect(vi.mocked(mockRestoreService.restore)).toHaveBeenCalledTimes(2);
      expect(vi.mocked(mockRestoreService.restore)).toHaveBeenCalledWith(
        resources[0],
        testOptions,
        mockMappingRegistry
      );
      expect(vi.mocked(mockRestoreService.restore)).toHaveBeenCalledWith(
        resources[1],
        testOptions,
        mockMappingRegistry
      );
    });

    it("should handle individual resource failures gracefully", async () => {
      const resources: TestResource[] = [
        {
          id: 1,
          uuid: "uuid-1",
          name: "Resource 1",
          content: { title: "Title 1" },
        },
        {
          id: 2,
          uuid: "uuid-2",
          name: "Resource 2",
          content: { title: "Title 2" },
        },
        {
          id: 3,
          uuid: "uuid-3",
          name: "Resource 3",
          content: { title: "Title 3" },
        },
      ];

      // First succeeds, second fails, third succeeds
      vi.mocked(mockPreprocessor.preprocess).mockImplementation(
        (resource) => resource
      );
      vi.mocked(mockRestoreService.restore)
        .mockResolvedValueOnce({
          id: 101,
          uuid: "new-uuid-1",
          name: "Resource 1",
          content: { title: "Title 1" },
        })
        .mockRejectedValueOnce(new Error("Restore failed"))
        .mockResolvedValueOnce({
          id: 103,
          uuid: "new-uuid-3",
          name: "Resource 3",
          content: { title: "Title 3" },
        });

      await service.restore(resources, testOptions, mockMappingRegistry);

      // Verify all resources were attempted
      expect(vi.mocked(mockRestoreService.restore)).toHaveBeenCalledTimes(3);

      // Verify mappings were only created for successful restores
      const mappingData = mockMappingRegistry.get(ResourceTypeEnum.STORIES);
      expect(mappingData.oldIdToNewIdMap.get(1)).toBe(101);
      expect(mappingData.oldIdToNewIdMap.get(2)).toBeUndefined(); // Failed restore
      expect(mappingData.oldIdToNewIdMap.get(3)).toBe(103);
    });

    it("should update ID and UUID mappings for successful restores", async () => {
      const resources: TestResource[] = [
        {
          id: 1,
          uuid: "uuid-1",
          name: "Resource 1",
          content: { title: "Title 1" },
        },
        {
          id: 2,
          uuid: "uuid-2",
          name: "Resource 2",
          content: { title: "Title 2" },
        },
      ];

      vi.mocked(mockPreprocessor.preprocess).mockImplementation(
        (resource) => resource
      );
      vi.mocked(mockRestoreService.restore)
        .mockResolvedValueOnce({
          id: 101,
          uuid: "new-uuid-1",
          name: "Resource 1",
          content: { title: "Title 1" },
        })
        .mockResolvedValueOnce({
          id: 102,
          uuid: "new-uuid-2",
          name: "Resource 2",
          content: { title: "Title 2" },
        });

      await service.restore(resources, testOptions, mockMappingRegistry);

      // Verify ID mappings
      const mappingData = mockMappingRegistry.get(ResourceTypeEnum.STORIES);
      expect(mappingData.oldIdToNewIdMap.get(1)).toBe(101);
      expect(mappingData.oldIdToNewIdMap.get(2)).toBe(102);

      // Verify UUID mappings
      expect(mappingData.oldUuidToNewUuidMap.get("uuid-1")).toBe("new-uuid-1");
      expect(mappingData.oldUuidToNewUuidMap.get("uuid-2")).toBe("new-uuid-2");
    });

    it("should continue processing after failures", async () => {
      const resources: TestResource[] = [
        {
          id: 1,
          uuid: "uuid-1",
          name: "Resource 1",
          content: { title: "Title 1" },
        },
        {
          id: 2,
          uuid: "uuid-2",
          name: "Resource 2",
          content: { title: "Title 2" },
        },
        {
          id: 3,
          uuid: "uuid-3",
          name: "Resource 3",
          content: { title: "Title 3" },
        },
      ];

      // First fails, second and third succeed
      vi.mocked(mockPreprocessor.preprocess).mockImplementation(
        (resource) => resource
      );
      vi.mocked(mockRestoreService.restore)
        .mockRejectedValueOnce(new Error("First restore failed"))
        .mockResolvedValueOnce({
          id: 102,
          uuid: "new-uuid-2",
          name: "Resource 2",
          content: { title: "Title 2" },
        })
        .mockResolvedValueOnce({
          id: 103,
          uuid: "new-uuid-3",
          name: "Resource 3",
          content: { title: "Title 3" },
        });

      await service.restore(resources, testOptions, mockMappingRegistry);

      // Verify all resources were attempted despite first failure
      expect(vi.mocked(mockRestoreService.restore)).toHaveBeenCalledTimes(3);

      // Verify mappings were created for successful restores
      const mappingData = mockMappingRegistry.get(ResourceTypeEnum.STORIES);
      expect(mappingData.oldIdToNewIdMap.get(2)).toBe(102);
      expect(mappingData.oldIdToNewIdMap.get(3)).toBe(103);
    });
  });

  describe("Medium Priority Tests", () => {
    it("should sort resources when sorting strategy is provided", async () => {
      const resources: TestResource[] = [
        {
          id: 1,
          uuid: "uuid-1",
          name: "Resource 1",
          content: { title: "Title 1" },
        },
        {
          id: 2,
          uuid: "uuid-2",
          name: "Resource 2",
          content: { title: "Title 2" },
        },
      ];

      const sortedResources: TestResource[] = [
        {
          id: 2,
          uuid: "uuid-2",
          name: "Resource 2",
          content: { title: "Title 2" },
        },
        {
          id: 1,
          uuid: "uuid-1",
          name: "Resource 1",
          content: { title: "Title 1" },
        },
      ];

      vi.mocked(mockSortingStrategy.sort).mockReturnValue(sortedResources);
      vi.mocked(mockPreprocessor.preprocess).mockImplementation(
        (resource) => resource
      );
      vi.mocked(mockRestoreService.restore)
        .mockResolvedValueOnce({
          id: 102,
          uuid: "new-uuid-2",
          name: "Resource 2",
          content: { title: "Title 2" },
        })
        .mockResolvedValueOnce({
          id: 101,
          uuid: "new-uuid-1",
          name: "Resource 1",
          content: { title: "Title 1" },
        });

      await service.restore(resources, testOptions, mockMappingRegistry);

      // Verify sorting was applied
      expect(vi.mocked(mockSortingStrategy.sort)).toHaveBeenCalledWith(
        resources
      );

      // Verify resources were processed in sorted order
      expect(vi.mocked(mockRestoreService.restore)).toHaveBeenNthCalledWith(
        1,
        sortedResources[0],
        testOptions,
        mockMappingRegistry
      );
      expect(vi.mocked(mockRestoreService.restore)).toHaveBeenNthCalledWith(
        2,
        sortedResources[1],
        testOptions,
        mockMappingRegistry
      );
    });

    it("should preprocess resources when preprocessor is provided", async () => {
      const resources: TestResource[] = [
        {
          id: 1,
          uuid: "uuid-1",
          name: "Resource 1",
          content: { title: "Title 1" },
        },
      ];

      const preprocessedResource: TestResource = {
        id: 1,
        uuid: "uuid-1",
        name: "Preprocessed Resource 1",
        content: { title: "Preprocessed Title 1" },
      };

      const restoredResource: TestResource = {
        id: 101,
        uuid: "new-uuid-1",
        name: "Preprocessed Resource 1",
        content: { title: "Preprocessed Title 1" },
      };

      vi.mocked(mockPreprocessor.preprocess).mockReturnValue(
        preprocessedResource
      );
      vi.mocked(mockRestoreService.restore).mockResolvedValue(restoredResource);

      await service.restore(resources, testOptions, mockMappingRegistry);

      // Verify preprocessing was applied
      expect(vi.mocked(mockPreprocessor.preprocess)).toHaveBeenCalledWith(
        resources[0],
        mockMappingRegistry
      );

      // Verify preprocessed resource was restored
      expect(vi.mocked(mockRestoreService.restore)).toHaveBeenCalledWith(
        preprocessedResource,
        testOptions,
        mockMappingRegistry
      );
    });

    it("should post-process after completion when post-processor is provided", async () => {
      const resources: TestResource[] = [
        {
          id: 1,
          uuid: "uuid-1",
          name: "Resource 1",
          content: { title: "Title 1" },
        },
      ];

      const restoredResource: TestResource = {
        id: 101,
        uuid: "new-uuid-1",
        name: "Resource 1",
        content: { title: "Title 1" },
      };

      vi.mocked(mockRestoreService.restore).mockResolvedValue(restoredResource);
      vi.mocked(mockPostProcessor.postProcess).mockResolvedValue(undefined);

      await service.restore(resources, testOptions, mockMappingRegistry);

      // Verify post-processing was called
      expect(vi.mocked(mockPostProcessor.postProcess)).toHaveBeenCalledWith(
        resources,
        testOptions,
        mockMappingRegistry
      );
    });

    it("should work without optional components", async () => {
      // Create service without optional components
      const minimalService = new TestResourceCollectionRestoreService(
        ResourceTypeEnum.STORIES,
        mockRestoreService
      );

      const resources: TestResource[] = [
        {
          id: 1,
          uuid: "uuid-1",
          name: "Resource 1",
          content: { title: "Title 1" },
        },
      ];

      const restoredResource: TestResource = {
        id: 101,
        uuid: "new-uuid-1",
        name: "Resource 1",
        content: { title: "Title 1" },
      };

      vi.mocked(mockRestoreService.restore).mockResolvedValue(restoredResource);

      await minimalService.restore(resources, testOptions, mockMappingRegistry);

      // Verify resource was restored
      expect(vi.mocked(mockRestoreService.restore)).toHaveBeenCalledWith(
        resources[0],
        testOptions,
        mockMappingRegistry
      );

      // Verify mapping was created
      const mappingData = mockMappingRegistry.get(ResourceTypeEnum.STORIES);
      expect(mappingData.oldIdToNewIdMap.get(1)).toBe(101);
    });
  });
});
