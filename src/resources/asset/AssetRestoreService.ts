import fs from "fs";
import type { ISbStoriesParams } from "storyblok-js-client";
import type { RestoreContext, RestoreOptions } from "../../shared/types";
import type { ResourceRestoreService } from "../../single/services/ResourceRestoreService";
import type { StoryblokResource } from "../../single/StoryblokResource";
import path from "path";

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
  canHandle(type: string) {
    return type === "asset";
  }

  async restore(
    resource: AssetResource,
    options: RestoreOptions,
    context: RestoreContext
  ): Promise<AssetResource> {
    const { id, ...assetWithoutId } = resource;

    console.log("Requesting signature...");
    const signatureResponse = (await context.apiClient.post(
      `spaces/${options.spaceId}/assets`,
      { ...assetWithoutId, validate_upload: 1 } as ISbStoriesParams
    )) as unknown as { data: SignatureResponse };
    const signatureData = signatureResponse.data;

    console.log("Signature received", signatureData);

    const fileExtension = resource.filename.split(".").pop();

    const filePath = path.join(
      options.backupPath,
      "asset-files",
      `${resource.id.toString()}.${fileExtension ?? ""}`
    );

    console.log("Checking if file exists", filePath);
    if (!fs.existsSync(filePath)) {
      throw new Error(`File not found: ${filePath}`);
    }

    console.log("Uploading file...", filePath);
    await uploadAsset({
      filename: resource.short_filename,
      signed_response_object: signatureData,
      filePath,
    });
    console.log("File uploaded");

    console.log("Finishing upload...");
    const finishUploadResponse = await context.apiClient.get(
      `spaces/${options.spaceId}/assets/${signatureData.id}/finish_upload`
    );
    console.log("Finish upload response", finishUploadResponse);

    console.log({ finishUploadResponse, signatureData });

    // Return the asset data from the signature response
    return finishUploadResponse as unknown as AssetResource;
  }
}
