import fs from "fs";
import type { ISbStoriesParams } from "storyblok-js-client";
import type { RestoreOptions } from "@core/types/types";
import type { ResourceRestoreService } from "@core/services/ResourceRestoreService";
import type { StoryblokResource } from "@core/types/types";
import path from "path";
import type { ResourceMappingRegistry } from "@core/services/ResourceMappingRegistry";
import type { Context } from "@core/types/context";
import { logger } from "@shared/logging";

type UploadAssetProps = {
  filename: string;
  signed_response_object: SignatureResponse;
  filePath: string;
  onSuccess?: () => void;
  onError?: (error: unknown) => void;
};

type SignatureResponse = {
  id: number;
  fields: {
    [key: string]: string;
  };
  post_url: string;
};

interface AssetResource extends StoryblokResource {
  filename: string;
  short_filename: string;
}

/**
 * Resource restore service for Storyblok assets.
 * Implements URL and parameter construction for assets.
 */
export class AssetRestoreService
  implements ResourceRestoreService<AssetResource>
{
  constructor(private context: Context) {}

  canHandle(type: string) {
    return type === "asset";
  }

  async restore(
    resource: AssetResource,
    options: RestoreOptions,
    _resourceMappingRegistry: ResourceMappingRegistry
  ): Promise<AssetResource> {
    logger.info(
      `\n\n\nStarting asset restoration for ${resource.filename} (ID: ${resource.id})`
    );
    logger.debug(`Asset details:`, {
      id: resource.id,
      uuid: resource.uuid,
      filename: resource.filename,
      short_filename: resource.short_filename,
    });

    const { id, ...assetWithoutId } = resource;

    // Request signature
    logger.debug(`Requesting upload signature for asset ${resource.id}`);
    let signatureData: SignatureResponse;
    try {
      const signatureResponse = (await this.context.apiClient.post(
        `spaces/${options.spaceId}/assets`,
        { ...assetWithoutId, validate_upload: 1 } as ISbStoriesParams
      )) as unknown as { data: SignatureResponse };
      signatureData = signatureResponse.data;
      logger.debug(`Upload signature received for asset ${resource.id}:`, {
        signatureId: signatureData.id,
        postUrl: signatureData.post_url,
        fieldsCount: Object.keys(signatureData.fields).length,
      });
    } catch (error) {
      logger.error(
        `Failed to request upload signature for asset ${resource.id}`
      );
      throw new Error(
        `Failed to request upload signature for asset ${resource.id}: ${error instanceof Error ? error.message : String(error)}`
      );
    }

    // Validate file exists
    const fileExtension = resource.filename.split(".").pop();
    const filePath = path.join(
      options.backupPath,
      "asset-files",
      `${resource.id.toString()}.${fileExtension ?? ""}`
    );

    logger.debug(`Checking for asset file at: ${filePath}`);
    if (!fs.existsSync(filePath)) {
      logger.error(`Asset file not found: ${filePath}`);
      throw new Error(`Asset file not found: ${filePath}`);
    }

    const fileStats = fs.statSync(filePath);
    logger.debug(`Asset file found:`, {
      path: filePath,
      size: fileStats.size,
      extension: fileExtension,
    });

    // Upload file
    logger.info(
      `Uploading asset file ${resource.filename} (${fileStats.size} bytes)`
    );
    try {
      await this.uploadAsset({
        filename: resource.short_filename,
        signed_response_object: signatureData,
        filePath,
      });
      logger.debug(`Asset file upload completed for ${resource.filename}`);
    } catch (error) {
      logger.error(`Failed to upload asset file ${resource.filename}`);
      throw new Error(
        `Failed to upload asset file ${resource.filename}: ${error instanceof Error ? error.message : String(error)}`
      );
    }

    // Finish upload
    logger.debug(`Finishing upload for asset ${resource.id}`);
    let finishUploadResponse;
    try {
      finishUploadResponse = await this.context.apiClient.get(
        `spaces/${options.spaceId}/assets/${signatureData.id}/finish_upload`
      );
      logger.debug(`Upload finished for asset ${resource.id}:`, {
        newId: (finishUploadResponse as any)?.id,
        newUuid: (finishUploadResponse as any)?.uuid,
      });
    } catch (error) {
      logger.error(`Failed to finish asset upload for ${resource.id}`);
      throw new Error(
        `Failed to finish asset upload for ${resource.id}: ${error instanceof Error ? error.message : String(error)}`
      );
    }

    logger.info(`Asset restoration completed for ${resource.filename}`);
    return finishUploadResponse as unknown as AssetResource;
  }

  private uploadAsset = async ({
    filename,
    signed_response_object,
    filePath,
    onSuccess,
    onError,
  }: UploadAssetProps): Promise<void> => {
    try {
      logger.debug(
        `Preparing upload for ${filename} to ${signed_response_object.post_url}`
      );

      const form = new FormData();

      for (let key in signed_response_object.fields) {
        form.append(key, signed_response_object.fields[key]!);
      }

      const fileBuffer = fs.readFileSync(filePath);
      form.append("file", new Blob([fileBuffer]), filename);

      logger.debug(
        `Uploading ${filename} (${fileBuffer.length} bytes) with ${Object.keys(signed_response_object.fields).length} form fields`
      );

      const response = await fetch(signed_response_object.post_url, {
        method: "POST",
        body: form,
      });

      if (!response.ok) {
        logger.error(
          `Upload failed for ${filename}: ${response.status} ${response.statusText}`
        );
        throw new Error(
          `Upload failed: ${response.status} ${response.statusText}`
        );
      }

      logger.debug(`Upload successful for ${filename}`);
      onSuccess?.();
    } catch (error) {
      logger.error(`Upload error for ${filename}:`, error);
      onError?.(error);
      throw error;
    }
  };
}
