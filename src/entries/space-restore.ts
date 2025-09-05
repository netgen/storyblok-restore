import StoryblokClient from "storyblok-js-client";
import type { ResourceType } from "@core/types/types";
import type { Context } from "@core/types/context";
import { SpaceRestoreService } from "@core/services/SpaceRestoreService";
import { ResourceCollectionRestoreServiceFactory } from "@core/factories/ResourceCollectionRestoreServiceFactory";

type SpaceRestoreOptions = {
  oauthToken: string;
  region: string;
  spaceId: string;
  backupPath: string;
  resourceTypes?: ResourceType[];
};

export async function spaceRestore({
  oauthToken,
  region,
  backupPath,
  spaceId,
  resourceTypes,
}: SpaceRestoreOptions) {
  const apiClient = new StoryblokClient({ oauthToken, region });

  const context: Context = {
    apiClient,
  };

  const resourceCollectionRestoreServiceFactory =
    await ResourceCollectionRestoreServiceFactory.create();

  const spaceRestoreService = new SpaceRestoreService(
    resourceCollectionRestoreServiceFactory,
    context,
    resourceTypes
  );

  try {
    await spaceRestoreService.restore({
      backupPath,
      spaceId,
    });
  } catch (error) {
    console.error("Space restore failed:", error);
    throw error;
  }

  console.log("Space restore complete!");
}
