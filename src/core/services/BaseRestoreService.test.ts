import { beforeEach, describe, expect, it, vi } from "vitest";
import type { Context } from "../types/context";
import type { RestoreOptions, StoryblokResource } from "../types/types";
import { BaseResourceRestoreService } from "./BaseRestoreService";
import { ResourceMappingRegistry } from "./ResourceMappingRegistry";

// Mock resource type for testing
interface TestResource extends StoryblokResource {
  name: string;
  content: {
    title?: string;
    description?: string;
  };
}

// Concrete implementation for testing
class TestResourceRestoreService extends BaseResourceRestoreService<TestResource> {
  constructor(context: Context) {
    super(context);
  }

  canHandle(type: string): boolean {
    return type === "test-resource";
  }

  getCreateUrl(_resource: TestResource, options: RestoreOptions): string {
    return `spaces/${options.spaceId}/test_resources`;
  }

  getParams(resource: TestResource): any & { publish?: number } {
    return {
      test_resource: {
        name: resource.name,
        content: resource.content,
      },
    };
  }

  getResponseData(response: any): TestResource {
    return response.data.test_resource;
  }

  handleError(error: unknown): never {
    throw new Error(
      `Test resource restoration failed: ${error instanceof Error ? error.message : String(error)}`
    );
  }
}

describe("BaseResourceRestoreService", () => {
  let service: TestResourceRestoreService;
  let mockContext: Context;
  let mockMappingRegistry: ResourceMappingRegistry;
  let mockApiClient: any;

  beforeEach(() => {
    mockApiClient = {
      post: vi.fn(),
    };

    mockContext = {
      apiClient: mockApiClient,
    };

    mockMappingRegistry = new ResourceMappingRegistry();

    service = new TestResourceRestoreService(mockContext);
  });

  describe("restore()", () => {
    const testResource: TestResource = {
      id: 123,
      uuid: "test-uuid",
      name: "Test Resource",
      content: { title: "Test Title" },
    };

    const testOptions: RestoreOptions = {
      spaceId: "test-space-id",
      backupPath: "/test/backup",
    };

    it("should call API with correct URL and parameters", async () => {
      const mockResponse = {
        data: {
          test_resource: {
            id: 456,
            uuid: "new-uuid",
            name: "Test Resource",
            content: { title: "Test Title" },
          },
        },
      };

      mockApiClient.post.mockResolvedValue(mockResponse);

      await service.restore(testResource, testOptions, mockMappingRegistry);

      expect(mockApiClient.post).toHaveBeenCalledWith(
        "spaces/test-space-id/test_resources",
        {
          test_resource: {
            name: "Test Resource",
            content: { title: "Test Title" },
          },
          publish: 1,
        }
      );
    });

    it("should handle API errors", async () => {
      const apiError = new Error("API Error");
      mockApiClient.post.mockRejectedValue(apiError);

      await expect(
        service.restore(testResource, testOptions, mockMappingRegistry)
      ).rejects.toThrow("API Error");
    });

    it("should return the correct resource data from API response", async () => {
      const mockResponse = {
        data: {
          test_resource: {
            id: 456,
            uuid: "new-uuid",
            name: "Test Resource",
            content: { title: "Test Title" },
          },
        },
      };

      mockApiClient.post.mockResolvedValue(mockResponse);

      const result = await service.restore(
        testResource,
        testOptions,
        mockMappingRegistry
      );

      expect(result).toEqual({
        id: 456,
        uuid: "new-uuid",
        name: "Test Resource",
        content: { title: "Test Title" },
      });
    });
  });
});
