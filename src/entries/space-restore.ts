import { ResourceCollectionRestoreServiceFactory } from "@core/factories/ResourceCollectionRestoreServiceFactory";
import { SpaceRestoreService } from "@core/services/SpaceRestoreService";
import type { Context } from "@core/types/context";
import type { ResourceType } from "@core/types/types";
import StoryblokClient from "storyblok-js-client";

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
    throw error;
  }
}
