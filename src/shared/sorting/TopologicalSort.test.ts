import { beforeEach, describe, expect, it } from "vitest";
import { TopologicalSortStrategy } from "./TopologicalSort";
import type { StoryblokResource } from "@core/types/types";

interface TestResource extends StoryblokResource {
  name: string;
}

describe("TopologicalSortStrategy", () => {
  let strategy: TopologicalSortStrategy<TestResource>;

  beforeEach(() => {
    strategy = new TopologicalSortStrategy<TestResource>();
  });

  describe("High Priority Tests", () => {
    it("should sort resources with parent-child relationships correctly", () => {
      const resources: TestResource[] = [
        { id: 2, parent_id: 1, uuid: "child-uuid", name: "Child" },
        { id: 1, parent_id: null, uuid: "parent-uuid", name: "Parent" },
        { id: 3, parent_id: 2, uuid: "grandchild-uuid", name: "Grandchild" },
      ];

      const sorted = strategy.sort(resources);

      // Parents should come before children
      expect(sorted[0]?.id).toBe(1); // Parent first
      expect(sorted[1]?.id).toBe(2); // Child second
      expect(sorted[2]?.id).toBe(3); // Grandchild last
    });

    it("should handle resources without parents (root resources)", () => {
      const resources: TestResource[] = [
        { id: 1, parent_id: null, uuid: "root1-uuid", name: "Root 1" },
        { id: 2, parent_id: null, uuid: "root2-uuid", name: "Root 2" },
        { id: 3, parent_id: null, uuid: "root3-uuid", name: "Root 3" },
      ];

      const sorted = strategy.sort(resources);

      // All resources should be present (order doesn't matter for roots)
      expect(sorted).toHaveLength(3);
      expect(sorted.map((r: TestResource) => r.id)).toContain(1);
      expect(sorted.map((r: TestResource) => r.id)).toContain(2);
      expect(sorted.map((r: TestResource) => r.id)).toContain(3);
    });

    it("should handle empty resource array", () => {
      const resources: TestResource[] = [];

      const sorted = strategy.sort(resources);

      expect(sorted).toEqual([]);
    });

    it("should handle single resource", () => {
      const resources: TestResource[] = [
        {
          id: 1,
          parent_id: null,
          uuid: "single-uuid",
          name: "Single Resource",
        },
      ];

      const sorted = strategy.sort(resources);

      expect(sorted).toHaveLength(1);
      expect(sorted[0]?.id).toBe(1);
      expect(sorted[0]?.name).toBe("Single Resource");
    });

    it("should preserve all input resources in output", () => {
      const resources: TestResource[] = [
        { id: 1, parent_id: null, uuid: "root-uuid", name: "Root" },
        { id: 2, parent_id: 1, uuid: "child1-uuid", name: "Child 1" },
        { id: 3, parent_id: 1, uuid: "child2-uuid", name: "Child 2" },
        { id: 4, parent_id: 2, uuid: "grandchild-uuid", name: "Grandchild" },
      ];

      const sorted = strategy.sort(resources);

      // All resources should be present
      expect(sorted).toHaveLength(4);
      expect(sorted.map((r: TestResource) => r.id).sort()).toEqual([
        1, 2, 3, 4,
      ]);

      // Verify all original properties are preserved
      const originalIds = resources.map((r) => r.id).sort();
      const sortedIds = sorted.map((r: TestResource) => r.id).sort();
      expect(sortedIds).toEqual(originalIds);
    });

    it("should handle multiple levels of nesting correctly", () => {
      const resources: TestResource[] = [
        { id: 4, parent_id: 3, uuid: "level3-uuid", name: "Level 3" },
        { id: 1, parent_id: null, uuid: "level0-uuid", name: "Level 0" },
        { id: 2, parent_id: 1, uuid: "level1-uuid", name: "Level 1" },
        { id: 3, parent_id: 2, uuid: "level2-uuid", name: "Level 2" },
      ];

      const sorted = strategy.sort(resources);

      // Verify correct hierarchical order
      expect(sorted[0]?.id).toBe(1); // Level 0 first
      expect(sorted[1]?.id).toBe(2); // Level 1 second
      expect(sorted[2]?.id).toBe(3); // Level 2 third
      expect(sorted[3]?.id).toBe(4); // Level 3 last
    });
  });
});
