import { beforeEach, describe, expect, it, vi } from "vitest";
import type { Context } from "../types/context";
import type { RestoreOptions, StoryblokResource } from "../types/types";
import { BaseResourceRestoreService } from "./BaseRestoreService";

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

  getCreateUrl(_resource: TestResource, options: RestoreOptions): string {
    return `spaces/${options.spaceId}/test_resources`;
  }

  getUpdateUrl(resource: TestResource, options: RestoreOptions): string {
    return `spaces/${options.spaceId}/test_resources/${resource.id}`;
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

  getResourceType(): string {
    return "Test Resource";
  }

  handleError(error: unknown): never {
    throw new Error(
      `Test resource restoration failed: ${error instanceof Error ? error.message : String(error)}`
    );
  }

  // Override protected methods for testing
  async findExistingResource(
    resource: TestResource,
    options: RestoreOptions
  ): Promise<TestResource | null> {
    return super.findExistingResource(resource, options);
  }

  isConflictError(error: unknown): boolean {
    return super.isConflictError(error);
  }

  getResourceIdentifier(resource: TestResource): string {
    return super.getResourceIdentifier(resource);
  }
}

describe("BaseResourceRestoreService", () => {
  let service: TestResourceRestoreService;
  let mockContext: Context;

  let mockApiClient: any;

  beforeEach(() => {
    mockApiClient = {
      post: vi.fn(),
      put: vi.fn(),
    };

    mockContext = {
      apiClient: mockApiClient,
    };

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

      await service.restore(testResource, testOptions);

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

      await expect(service.restore(testResource, testOptions)).rejects.toThrow(
        "API Error"
      );
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

      const result = await service.restore(testResource, testOptions);

      expect(result).toEqual({
        id: 456,
        uuid: "new-uuid",
        name: "Test Resource",
        content: { title: "Test Title" },
      });
    });

    it("should handle conflict error and attempt update", async () => {
      const conflictError = {
        message: ["Name has already been taken"],
      };

      const existingResource: TestResource = {
        id: 999,
        uuid: "existing-uuid",
        name: "Test Resource",
        content: { title: "Existing Title" },
      };

      const updatedResponse = {
        data: {
          test_resource: {
            id: 999,
            uuid: "existing-uuid",
            name: "Test Resource",
            content: { title: "Test Title" },
          },
        },
      };

      // Mock the conflict error on create
      mockApiClient.post.mockRejectedValueOnce(conflictError);

      // Mock the findExistingResource method to return existing resource
      vi.spyOn(service, "findExistingResource").mockResolvedValue(
        existingResource
      );

      // Mock successful update
      mockApiClient.put.mockResolvedValue(updatedResponse);

      const result = await service.restore(testResource, testOptions);

      expect(mockApiClient.post).toHaveBeenCalledTimes(1);
      expect(mockApiClient.put).toHaveBeenCalledWith(
        "spaces/test-space-id/test_resources/999",
        {
          test_resource: {
            name: "Test Resource",
            content: { title: "Test Title" },
          },
          publish: 1,
        }
      );
      expect(result).toEqual({
        id: 999,
        uuid: "existing-uuid",
        name: "Test Resource",
        content: { title: "Test Title" },
      });
    });

    it("should throw error if conflict detected but no existing resource found", async () => {
      const conflictError = new Error("Name has already been taken");

      // Mock the conflict error on create
      mockApiClient.post.mockRejectedValueOnce(conflictError);

      // Mock findExistingResource to return null
      vi.spyOn(service, "findExistingResource").mockResolvedValue(null);

      await expect(service.restore(testResource, testOptions)).rejects.toThrow(
        "Test resource restoration failed: Name has already been taken"
      );
    });

    it("should throw error if update fails after conflict", async () => {
      const conflictError = {
        message: ["Name has already been taken"],
      };

      const existingResource: TestResource = {
        id: 999,
        uuid: "existing-uuid",
        name: "Test Resource",
        content: { title: "Existing Title" },
      };

      const updateError = new Error("Update failed");

      // Mock the conflict error on create
      mockApiClient.post.mockRejectedValueOnce(conflictError);

      // Mock findExistingResource to return existing resource
      vi.spyOn(service, "findExistingResource").mockResolvedValue(
        existingResource
      );

      // Mock failed update
      mockApiClient.put.mockRejectedValueOnce(updateError);

      await expect(service.restore(testResource, testOptions)).rejects.toThrow(
        "Test resource restoration failed: Update failed"
      );
    });
  });

  describe("isConflictError()", () => {
    it("should detect conflict errors with 'already taken' message", () => {
      const error = { message: ["Name has already been taken"] };
      expect(service.isConflictError(error)).toBe(true);
    });

    it("should detect conflict errors with 'been taken' message", () => {
      const error = { message: "Name has been taken" };
      expect(service.isConflictError(error)).toBe(true);
    });

    it("should detect conflict errors with 'already exists' message", () => {
      const error = { message: "Resource already exists" };
      expect(service.isConflictError(error)).toBe(true);
    });

    it("should detect conflict errors with 'duplicate' message", () => {
      const error = { message: "Duplicate entry" };
      expect(service.isConflictError(error)).toBe(true);
    });

    it("should detect conflict errors with 'conflict' message", () => {
      const error = { message: "Conflict detected" };
      expect(service.isConflictError(error)).toBe(true);
    });

    it("should detect conflict errors with 'name taken' message", () => {
      const error = { message: "Name taken" };
      expect(service.isConflictError(error)).toBe(true);
    });

    it("should detect conflict errors with 'slug taken' message", () => {
      const error = { message: "Slug taken" };
      expect(service.isConflictError(error)).toBe(true);
    });

    it("should not detect non-conflict errors", () => {
      const error = { message: "Server error" };
      expect(service.isConflictError(error)).toBe(false);
    });

    it("should handle errors without message property", () => {
      const error = { code: 500 };
      expect(service.isConflictError(error)).toBe(false);
    });

    it("should handle null/undefined errors", () => {
      expect(service.isConflictError(null)).toBe(false);
      expect(service.isConflictError(undefined)).toBe(false);
    });
  });

  describe("getResourceIdentifier()", () => {
    it("should return resource id as string", () => {
      const resource: TestResource = {
        id: 123,
        uuid: "test-uuid",
        name: "Test Resource",
        content: { title: "Test Title" },
      };

      expect(service.getResourceIdentifier(resource)).toBe("123");
    });
  });

  describe("getResourceType()", () => {
    it("should return the resource type name", () => {
      expect(service.getResourceType()).toBe("Test Resource");
    });
  });
});
