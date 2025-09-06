import fs from "fs";
import type { ISbStoriesParams } from "storyblok-js-client";
import type { RestoreOptions } from "@core/types/types";
import type { ResourceRestoreService } from "@core/services/ResourceRestoreService";
import type { StoryblokResource } from "@core/types/types";
import path from "path";
import type { ResourceMappingRegistry } from "@core/services/ResourceMappingRegistry";
import type { Context } from "@core/types/context";

type UploadAssetProps = {
  filename: string;
  signed_response_object: SignatureResponse;
  filePath: string;
  onSuccess?: () => void;
  onError?: (error: unknown) => void;
};

const uploadAsset = async ({
  filename,
  signed_response_object,
  filePath,
  onSuccess,
  onError,
}: UploadAssetProps): Promise<void> => {
  try {
    const form = new FormData();

    for (let key in signed_response_object.fields) {
      form.append(key, signed_response_object.fields[key]!);
    }

    const fileBuffer = fs.readFileSync(filePath);
    form.append("file", new Blob([fileBuffer]), filename);

    const response = await fetch(signed_response_object.post_url, {
      method: "POST",
      body: form,
    });

    if (!response.ok) {
      throw new Error(
        `Upload failed: ${response.status} ${response.statusText}`
      );
    }

    onSuccess?.();
  } catch (error) {
    onError?.(error);
    throw error;
  }
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
    const { id, ...assetWithoutId } = resource;

    // Request signature
    let signatureData: SignatureResponse;
    try {
      const signatureResponse = (await this.context.apiClient.post(
        `spaces/${options.spaceId}/assets`,
        { ...assetWithoutId, validate_upload: 1 } as ISbStoriesParams
      )) as unknown as { data: SignatureResponse };
      signatureData = signatureResponse.data;
    } catch (error) {
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

    if (!fs.existsSync(filePath)) {
      throw new Error(`Asset file not found: ${filePath}`);
    }

    // Upload file
    try {
      await uploadAsset({
        filename: resource.short_filename,
        signed_response_object: signatureData,
        filePath,
      });
    } catch (error) {
      throw new Error(
        `Failed to upload asset file ${resource.filename}: ${error instanceof Error ? error.message : String(error)}`
      );
    }

    // Finish upload
    let finishUploadResponse;
    try {
      finishUploadResponse = await this.context.apiClient.get(
        `spaces/${options.spaceId}/assets/${signatureData.id}/finish_upload`
      );
    } catch (error) {
      throw new Error(
        `Failed to finish asset upload for ${resource.id}: ${error instanceof Error ? error.message : String(error)}`
      );
    }

    return finishUploadResponse as unknown as AssetResource;
  }
}
