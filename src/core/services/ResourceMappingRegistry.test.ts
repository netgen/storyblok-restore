import { describe, it, expect, beforeEach } from "vitest";
import {
  ResourceMappingRegistry,
  type ResourceMappingData,
} from "./ResourceMappingRegistry";
import { ResourceType } from "../types/types";

describe("ResourceMappingRegistry", () => {
  let registry: ResourceMappingRegistry;

  beforeEach(() => {
    registry = new ResourceMappingRegistry();
  });

  describe("init()", () => {
    it("should initialize a new resource type with empty maps", () => {
      registry.init(ResourceType.STORIES);

      const result = registry.get(ResourceType.STORIES);

      expect(result).toEqual({
        oldIdToNewIdMap: new Map(),
        oldUuidToNewUuidMap: new Map(),
      });
    });

    it("should initialize multiple resource types independently", () => {
      registry.init(ResourceType.STORIES);
      registry.init(ResourceType.ASSETS);

      const storiesData = registry.get(ResourceType.STORIES);
      const assetsData = registry.get(ResourceType.ASSETS);

      expect(storiesData).toEqual({
        oldIdToNewIdMap: new Map(),
        oldUuidToNewUuidMap: new Map(),
      });

      expect(assetsData).toEqual({
        oldIdToNewIdMap: new Map(),
        oldUuidToNewUuidMap: new Map(),
      });

      // Ensure they are separate instances
      expect(storiesData).not.toBe(assetsData);
    });
  });

  describe("get()", () => {
    it("should auto-initialize when resource type doesn't exist", () => {
      // Call get() on a non-existent resource type
      const result = registry.get(ResourceType.STORIES);

      expect(result).toEqual({
        oldIdToNewIdMap: new Map(),
        oldUuidToNewUuidMap: new Map(),
      });

      // Verify it was actually stored
      expect(registry.has(ResourceType.STORIES)).toBe(true);
    });

    it("should return existing data when resource type already exists", () => {
      // Initialize first
      registry.init(ResourceType.STORIES);
      const firstResult = registry.get(ResourceType.STORIES);

      // Get again
      const secondResult = registry.get(ResourceType.STORIES);

      // Should return the same instance
      expect(firstResult).toBe(secondResult);
    });

    it("should auto-initialize multiple resource types", () => {
      const storiesData = registry.get(ResourceType.STORIES);
      const assetsData = registry.get(ResourceType.ASSETS);

      expect(storiesData).toEqual({
        oldIdToNewIdMap: new Map(),
        oldUuidToNewUuidMap: new Map(),
      });

      expect(assetsData).toEqual({
        oldIdToNewIdMap: new Map(),
        oldUuidToNewUuidMap: new Map(),
      });

      // Verify both were stored
      expect(registry.has(ResourceType.STORIES)).toBe(true);
      expect(registry.has(ResourceType.ASSETS)).toBe(true);
    });
  });
});
