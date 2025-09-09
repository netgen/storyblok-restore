import { beforeEach, describe, expect, it, vi } from "vitest";
import type { Context } from "../types/context";
import { ResourceType, type RestoreOptions } from "../types/types";
import { ResourceMappingRegistry } from "./ResourceMappingRegistry";
import { SpaceRestoreService } from "./SpaceRestoreService";

// Mock fs and path modules
vi.mock("fs", () => ({
  default: {
    existsSync: vi.fn(),
    readdirSync: vi.fn(),
    readFileSync: vi.fn(),
  },
}));

vi.mock("path", () => ({
  default: {
    join: vi.fn(),
  },
}));

// Simple mock objects - no inheritance needed
const createMockRestoreService = () => ({
  restore: vi.fn(),
});

const createMockFactory = () => ({
  getServiceForType: vi.fn(),
});

describe("SpaceRestoreService", () => {
  let service: SpaceRestoreService;
  let mockFactory: any;
  let mockContext: Context;
  let mockRestoreService: any;
  let testOptions: RestoreOptions;

  beforeEach(() => {
    // Reset all mocks
    vi.clearAllMocks();

    mockRestoreService = createMockRestoreService();
    mockFactory = createMockFactory();
    mockContext = {
      apiClient: {
        put: vi.fn(),
      } as any,
    };
    testOptions = {
      spaceId: "test-space-id",
      backupPath: "/test/backup",
    };

    service = new SpaceRestoreService(mockFactory, mockContext);
  });

  describe("restore()", () => {
    it("should restore all resource types in correct order", async () => {
      const mockResources = [
        { id: 1, uuid: "uuid-1", name: "Resource 1" },
        { id: 2, uuid: "uuid-2", name: "Resource 2" },
      ];

      const fs = await import("fs");
      const path = await import("path");

      // Mock fs.existsSync to return true for all folders
      vi.mocked(fs.default.existsSync).mockReturnValue(true);

      // Mock fs.readdirSync to return JSON files
      vi.mocked(fs.default.readdirSync).mockReturnValue([
        "resource1.json",
        "resource2.json",
      ] as any);

      // Mock fs.readFileSync to return JSON content
      vi.mocked(fs.default.readFileSync).mockReturnValue(
        JSON.stringify(mockResources[0])
      );

      // Mock path.join to return folder paths
      vi.mocked(path.default.join).mockImplementation((...args) =>
        args.join("/")
      );

      // Mock factory to return restore service
      vi.mocked(mockFactory.getServiceForType).mockReturnValue(
        mockRestoreService
      );

      await service.restore(testOptions);

      // Verify all resource types were processed (1 for space settings + 10 for resource types)
      expect(vi.mocked(fs.default.existsSync)).toHaveBeenCalledTimes(
        Object.values(ResourceType).length + 1
      );

      // Verify factory was called for each resource type
      expect(vi.mocked(mockFactory.getServiceForType)).toHaveBeenCalledTimes(
        Object.values(ResourceType).length
      );

      // Verify restore service was called
      expect(vi.mocked(mockRestoreService.restore)).toHaveBeenCalled();
    });

    it("should skip missing backup folders", async () => {
      const fs = await import("fs");
      const path = await import("path");

      // Mock fs.existsSync to return false (folder doesn't exist)
      vi.mocked(fs.default.existsSync).mockReturnValue(false);

      // Mock path.join to return folder paths
      vi.mocked(path.default.join).mockImplementation((...args) =>
        args.join("/")
      );

      await service.restore(testOptions);

      // Verify fs.existsSync was called for each resource type (1 for space settings + 10 for resource types)
      expect(vi.mocked(fs.default.existsSync)).toHaveBeenCalledTimes(
        Object.values(ResourceType).length + 1
      );

      // Verify factory was never called (no folders exist)
      expect(vi.mocked(mockFactory.getServiceForType)).not.toHaveBeenCalled();

      // Verify restore service was never called
      expect(vi.mocked(mockRestoreService.restore)).not.toHaveBeenCalled();
    });

    it("should load resources from JSON files", async () => {
      const mockResources = [
        { id: 1, uuid: "uuid-1", name: "Resource 1" },
        { id: 2, uuid: "uuid-2", name: "Resource 2" },
      ];

      const fs = await import("fs");
      const path = await import("path");

      // Mock fs.existsSync to return true for space settings and first folder only
      vi.mocked(fs.default.existsSync)
        .mockReturnValueOnce(true) // space settings file exists
        .mockReturnValueOnce(true) // first resource folder exists
        .mockReturnValue(false); // other folders don't exist

      // Mock fs.readdirSync to return JSON files
      vi.mocked(fs.default.readdirSync).mockReturnValue([
        "resource1.json",
        "resource2.json",
      ] as any);

      // Mock fs.readFileSync to return JSON content
      vi.mocked(fs.default.readFileSync)
        .mockReturnValueOnce(JSON.stringify(mockResources[0]))
        .mockReturnValueOnce(JSON.stringify(mockResources[1]));

      // Mock path.join to return folder paths
      vi.mocked(path.default.join).mockImplementation((...args) =>
        args.join("/")
      );

      // Mock factory to return restore service
      vi.mocked(mockFactory.getServiceForType).mockReturnValue(
        mockRestoreService
      );

      await service.restore(testOptions);

      // Verify files were read (1 for space settings + 2 for resource files)
      expect(vi.mocked(fs.default.readFileSync)).toHaveBeenCalledTimes(3);

      // Verify JSON was parsed and passed to restore service
      expect(vi.mocked(mockRestoreService.restore)).toHaveBeenCalledWith(
        expect.arrayContaining([
          expect.objectContaining({
            id: 1,
            uuid: "uuid-1",
            name: "Resource 1",
          }),
          expect.objectContaining({
            id: 2,
            uuid: "uuid-2",
            name: "Resource 2",
          }),
        ]),
        testOptions,
        expect.any(ResourceMappingRegistry)
      );
    });

    it("should initialize mapping registry for each resource type", async () => {
      const fs = await import("fs");
      const path = await import("path");

      // Mock fs.existsSync to return true for space settings and first folder only
      vi.mocked(fs.default.existsSync)
        .mockReturnValueOnce(true) // space settings file exists
        .mockReturnValueOnce(true) // first resource folder exists
        .mockReturnValue(false); // other folders don't exist

      // Mock fs.readdirSync to return empty array (no files)
      vi.mocked(fs.default.readdirSync).mockReturnValue([] as any);

      // Mock path.join to return folder paths
      vi.mocked(path.default.join).mockImplementation((...args) =>
        args.join("/")
      );

      // Mock factory to return restore service
      vi.mocked(mockFactory.getServiceForType).mockReturnValue(
        mockRestoreService
      );

      await service.restore(testOptions);

      // Verify restore service was called with mapping registry
      expect(vi.mocked(mockRestoreService.restore)).toHaveBeenCalledWith(
        [],
        testOptions,
        expect.any(ResourceMappingRegistry)
      );
    });

    it("should call factory to get restore service", async () => {
      const fs = await import("fs");
      const path = await import("path");

      // Mock fs.existsSync to return true for space settings and first folder only
      vi.mocked(fs.default.existsSync)
        .mockReturnValueOnce(true) // space settings file exists
        .mockReturnValueOnce(true) // first resource folder exists
        .mockReturnValue(false); // other folders don't exist

      // Mock fs.readdirSync to return empty array
      vi.mocked(fs.default.readdirSync).mockReturnValue([] as any);

      // Mock path.join to return folder paths
      vi.mocked(path.default.join).mockImplementation((...args) =>
        args.join("/")
      );

      // Mock factory to return restore service
      vi.mocked(mockFactory.getServiceForType).mockReturnValue(
        mockRestoreService
      );

      await service.restore(testOptions);

      // Verify factory was called with correct parameters
      expect(vi.mocked(mockFactory.getServiceForType)).toHaveBeenCalledWith(
        mockContext,
        Object.values(ResourceType)[0] // First resource type
      );
    });

    it("should filter resource types when specified", async () => {
      const fs = await import("fs");
      const path = await import("path");

      // Create service with specific resource types
      const filteredService = new SpaceRestoreService(
        mockFactory,
        mockContext,
        [ResourceType.STORIES, ResourceType.ASSETS]
      );

      // Mock fs.existsSync to return true for all folders
      vi.mocked(fs.default.existsSync).mockReturnValue(true);

      // Mock fs.readdirSync to return empty array
      vi.mocked(fs.default.readdirSync).mockReturnValue([] as any);

      // Mock path.join to return folder paths
      vi.mocked(path.default.join).mockImplementation((...args) =>
        args.join("/")
      );

      // Mock factory to return restore service
      vi.mocked(mockFactory.getServiceForType).mockReturnValue(
        mockRestoreService
      );

      await filteredService.restore(testOptions);

      // Verify only specified resource types were processed (1 for space settings + 2 for resource types)
      expect(vi.mocked(fs.default.existsSync)).toHaveBeenCalledTimes(3); // Only STORIES and ASSETS
      expect(vi.mocked(mockFactory.getServiceForType)).toHaveBeenCalledTimes(2);
    });

    it("should restore all types when none specified", async () => {
      const fs = await import("fs");
      const path = await import("path");

      // Mock fs.existsSync to return true for all folders
      vi.mocked(fs.default.existsSync).mockReturnValue(true);

      // Mock fs.readdirSync to return empty array
      vi.mocked(fs.default.readdirSync).mockReturnValue([] as any);

      // Mock path.join to return folder paths
      vi.mocked(path.default.join).mockImplementation((...args) =>
        args.join("/")
      );

      // Mock factory to return restore service
      vi.mocked(mockFactory.getServiceForType).mockReturnValue(
        mockRestoreService
      );

      await service.restore(testOptions);

      // Verify all resource types were processed (1 for space settings + 10 for resource types)
      expect(vi.mocked(fs.default.existsSync)).toHaveBeenCalledTimes(
        Object.values(ResourceType).length + 1
      );
      expect(vi.mocked(mockFactory.getServiceForType)).toHaveBeenCalledTimes(
        Object.values(ResourceType).length
      );
    });

    it("should handle empty backup folders", async () => {
      const fs = await import("fs");
      const path = await import("path");

      // Mock fs.existsSync to return true for space settings and first folder only
      vi.mocked(fs.default.existsSync)
        .mockReturnValueOnce(true) // space settings file exists
        .mockReturnValueOnce(true) // first resource folder exists
        .mockReturnValue(false); // other folders don't exist

      // Mock fs.readdirSync to return empty array (no JSON files)
      vi.mocked(fs.default.readdirSync).mockReturnValue([] as any);

      // Mock path.join to return folder paths
      vi.mocked(path.default.join).mockImplementation((...args) =>
        args.join("/")
      );

      // Mock factory to return restore service
      vi.mocked(mockFactory.getServiceForType).mockReturnValue(
        mockRestoreService
      );

      await service.restore(testOptions);

      // Verify restore service was called with empty array
      expect(vi.mocked(mockRestoreService.restore)).toHaveBeenCalledWith(
        [],
        testOptions,
        expect.any(ResourceMappingRegistry)
      );
    });
  });
});
