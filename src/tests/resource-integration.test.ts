import type { ResourceCollectionRestoreService } from "@core/services/ResourceCollectionRestoreService";
import {
  type ResourceMappingObject,
  ResourceMappingRegistry,
} from "@core/services/ResourceMappingRegistry";
import type { Context } from "@core/types/context";
import type { RestoreOptions, StoryblokResource } from "@core/types/types";
import { glob } from "glob";
import { beforeAll, beforeEach, describe, expect, it, vi } from "vitest";

// Test configuration types
export type ResourceIntegrationTestConfig<T extends StoryblokResource = any> = {
  ServiceClass: new (ctx: Context) => ResourceCollectionRestoreService<T>;
  name: string;
  description: string;
  resources: {
    input: T;
    expectedApiCall: {
      endpointSuffix: string;
      body: any;
    };
    mockResponse: any;
  }[];
  initialMappingRegistry?: ResourceMappingObject;
  expectedFinalMappingRegistry?: ResourceMappingObject;
};

type ResourceIntegrationTestRunner<
  TResource extends StoryblokResource,
  TService extends ResourceCollectionRestoreService<TResource>,
> = {
  service: TService; // ResourceCollectionRestoreService
  config: ResourceIntegrationTestConfig<TResource>;
};

// Mock API client for all tests
let mockApiClient: any;

// Create mock before any tests run
beforeAll(() => {
  mockApiClient = {
    post: vi.fn(),
  };
});

beforeEach(() => {
  vi.clearAllMocks();
  // Reset the mock but keep the same instance
  mockApiClient.post = vi.fn();
});

/**
 * Discovers and loads integration test configurations from resource folders
 */
async function discoverIntegrationTests(): Promise<
  ResourceIntegrationTestRunner<any, any>[]
> {
  // Find all integration test files in resource folders
  const testFiles = await glob("src/resources/**/integration-tests/*.ts");

  const testRunners: ResourceIntegrationTestRunner<any, any>[] = [];

  for (const testFile of testFiles) {
    try {
      // Load test configuration
      const testConfig: ResourceIntegrationTestConfig<any> = await import(
        testFile,
        {
          assert: { type: "ts" },
        }
      ).then((module) => module.default);

      const mockContext: Context = {
        apiClient: mockApiClient,
      };

      // Create service instance
      const service = new testConfig.ServiceClass(mockContext);

      testRunners.push({
        service,
        config: testConfig,
      });
    } catch (error) {
      console.warn(`Failed to load integration test ${testFile}:`, error);
    }
  }

  return testRunners;
}

/**
 * Runs a single integration test
 */
async function runIntegrationTest<
  T extends StoryblokResource,
  TService extends ResourceCollectionRestoreService<T>,
>(runner: ResourceIntegrationTestRunner<T, TService>): Promise<void> {
  const { config } = runner;

  // Create a fresh service instance with the current mock
  const mockContext: Context = {
    apiClient: mockApiClient,
  };

  const service = new config.ServiceClass(mockContext);

  // 1. Setup initial mapping registry
  const registry = new ResourceMappingRegistry();
  if (config.initialMappingRegistry) {
    registry.fromObject(config.initialMappingRegistry);
  }

  // 2. Setup API mocks in sequence
  config.resources.forEach((resource) => {
    mockApiClient.post.mockResolvedValueOnce(resource.mockResponse);
  });

  // 3. Prepare test options
  const options: RestoreOptions = {
    spaceId: "test-space-id",
    backupPath: "/test/backup",
  };

  // 4. Execute restore with all resources
  const inputResources = config.resources.map((r) => r.input);
  await service.restore(inputResources, options, registry);

  // 5. Verify API calls were made correctly
  expect(mockApiClient.post).toHaveBeenCalledTimes(config.resources.length);

  config.resources.forEach((resource, index) => {
    const expectedUrl = `spaces/${options.spaceId}/${resource.expectedApiCall.endpointSuffix}`;
    const expectedBody = resource.expectedApiCall.body;

    expect(mockApiClient.post).toHaveBeenNthCalledWith(
      index + 1,
      expectedUrl,
      expectedBody
    );
  });

  // 6. Verify final mapping registry state if specified
  if (config.expectedFinalMappingRegistry) {
    const finalStateObject = registry.toObject();

    expect(finalStateObject).toEqual(config.expectedFinalMappingRegistry);
  }
}

/**
 * Main test suite with organized separation
 * Each integration test runs as a separate sub-test with clear reporting
 */
describe("Resource Integration Tests", async () => {
  let testRunners: ResourceIntegrationTestRunner<any, any>[] =
    await discoverIntegrationTests();

  beforeAll(async () => {
    testRunners = await discoverIntegrationTests();
  });

  it("should have discovered integration tests", () => {
    expect(testRunners.length).toBeGreaterThan(0);
  });

  // Create individual test cases for each discovered integration test
  // This gives us separation while working within Vitest's constraints
  testRunners.forEach((runner, index) => {
    it(`${index + 1} - ${runner.config.name} - ${runner.config.description}`, async () => {
      await runIntegrationTest(runner);
    });
  });
});
