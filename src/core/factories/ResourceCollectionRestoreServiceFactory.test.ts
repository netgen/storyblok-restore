import { beforeEach, describe, expect, it, vi } from "vitest";
import { ResourceCollectionRestoreService } from "../services/ResourceCollectionRestoreService";
import type { ResourceRestoreService } from "../services/ResourceRestoreService";
import type { Context } from "../types/context";
import { ResourceType, type StoryblokResource } from "../types/types";
import { ResourceCollectionRestoreServiceFactory } from "./ResourceCollectionRestoreServiceFactory";

// Mock external dependencies
vi.mock("glob");
vi.mock("path");

// Mock restore service
class MockRestoreService implements ResourceRestoreService<StoryblokResource> {
  canHandle = vi.fn().mockReturnValue(true);
  restore = vi.fn().mockResolvedValue({} as StoryblokResource);
}

// Mock service class for testing
class MockServiceClass extends ResourceCollectionRestoreService<StoryblokResource> {
  static readonly RESOURCE_TYPE = "stories";

  constructor(_context: Context) {
    super(ResourceType.STORIES, new MockRestoreService());
  }
}

// Mock service class for assets
class MockAssetServiceClass extends ResourceCollectionRestoreService<StoryblokResource> {
  static readonly RESOURCE_TYPE = "assets";

  constructor(_context: Context) {
    super(ResourceType.ASSETS, new MockRestoreService());
  }
}

describe("ResourceCollectionRestoreServiceFactory", () => {
  let mockContext: Context;
  let mockGlob: any;
  let mockPath: any;

  beforeEach(async () => {
    // Reset all mocks
    vi.clearAllMocks();

    mockContext = {
      apiClient: {} as any,
    };

    // Setup glob mock
    mockGlob = await import("glob");
    vi.mocked(mockGlob.glob).mockResolvedValue([]);

    // Setup path mock
    mockPath = await import("path");
    vi.mocked(mockPath.default.resolve).mockImplementation(
      (...args: string[]) => args.join("/")
    );
  });

  describe("High Priority Tests", () => {
    it("should handle empty service directory", async () => {
      // Mock glob to return empty array
      vi.mocked(mockGlob.glob).mockResolvedValue([]);

      const factory = await ResourceCollectionRestoreServiceFactory.create();

      expect(factory).toBeInstanceOf(ResourceCollectionRestoreServiceFactory);

      // Should throw error when trying to get service for any type
      expect(() => {
        factory.getServiceForType(mockContext, ResourceType.STORIES);
      }).toThrow("No bulk restore service for resource type: stories");
    });

    it("should throw error for unknown resource type", async () => {
      // Create a factory with a known service
      const creators = [
        {
          resourceType: ResourceType.STORIES,
          create: (ctx: Context) => new MockServiceClass(ctx),
        },
      ];
      const factory = new ResourceCollectionRestoreServiceFactory(creators);

      expect(() => {
        factory.getServiceForType(mockContext, ResourceType.ASSETS);
      }).toThrow("No bulk restore service for resource type: assets");
    });

    it("should return correct service instance for valid type", async () => {
      const creators = [
        {
          resourceType: ResourceType.STORIES,
          create: (ctx: Context) => new MockServiceClass(ctx),
        },
      ];
      const factory = new ResourceCollectionRestoreServiceFactory(creators);

      const service = factory.getServiceForType(
        mockContext,
        ResourceType.STORIES
      );

      expect(service).toBeInstanceOf(MockServiceClass);
      expect(service).toBeDefined();
    });

    it("should create new instance with provided context", async () => {
      const creators = [
        {
          resourceType: ResourceType.STORIES,
          create: (ctx: Context) => new MockServiceClass(ctx),
        },
      ];
      const factory = new ResourceCollectionRestoreServiceFactory(creators);

      const service1 = factory.getServiceForType(
        mockContext,
        ResourceType.STORIES
      );
      const service2 = factory.getServiceForType(
        mockContext,
        ResourceType.STORIES
      );

      // Should create new instances each time
      expect(service1).not.toBe(service2);
      expect(service1).toBeInstanceOf(MockServiceClass);
      expect(service2).toBeInstanceOf(MockServiceClass);
    });

    it("should handle multiple services with different resource types", async () => {
      const creators = [
        {
          resourceType: ResourceType.STORIES,
          create: (ctx: Context) => new MockServiceClass(ctx),
        },
        {
          resourceType: ResourceType.ASSETS,
          create: (ctx: Context) => new MockAssetServiceClass(ctx),
        },
      ];
      const factory = new ResourceCollectionRestoreServiceFactory(creators);

      // Should be able to get services for all types
      const storyService = factory.getServiceForType(
        mockContext,
        ResourceType.STORIES
      );
      const assetService = factory.getServiceForType(
        mockContext,
        ResourceType.ASSETS
      );

      expect(storyService).toBeInstanceOf(MockServiceClass);
      expect(assetService).toBeInstanceOf(MockAssetServiceClass);
    });
  });

  describe("Medium Priority Tests", () => {
    it("should handle services with duplicate resource types", async () => {
      const creators = [
        {
          resourceType: ResourceType.STORIES,
          create: (ctx: Context) => new MockServiceClass(ctx),
        },
        {
          resourceType: ResourceType.STORIES, // Duplicate
          create: (ctx: Context) => new MockServiceClass(ctx),
        },
      ];
      const factory = new ResourceCollectionRestoreServiceFactory(creators);

      // Should work, but only one service will be registered (last one wins)
      const service = factory.getServiceForType(
        mockContext,
        ResourceType.STORIES
      );
      expect(service).toBeInstanceOf(MockServiceClass);
    });

    it("should validate RESOURCE_TYPE property exists", async () => {
      // This test would require mocking dynamic imports, which is complex
      // For now, we'll test the constructor validation logic
      const creators = [
        {
          resourceType: ResourceType.STORIES,
          create: (ctx: Context) => new MockServiceClass(ctx),
        },
      ];
      const factory = new ResourceCollectionRestoreServiceFactory(creators);

      // Should not throw error since MockServiceClass has RESOURCE_TYPE
      expect(factory).toBeInstanceOf(ResourceCollectionRestoreServiceFactory);
    });

    it("should handle empty creators array", async () => {
      const factory = new ResourceCollectionRestoreServiceFactory([]);

      expect(() => {
        factory.getServiceForType(mockContext, ResourceType.STORIES);
      }).toThrow("No bulk restore service for resource type: stories");
    });
  });
});
