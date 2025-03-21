"use server";

import { S3Client, DeleteObjectCommand } from "@aws-sdk/client-s3";
import { logError } from "@/lib/utils";

export async function deleteImageAction(imageUrl: string): Promise<void> {
  if (!imageUrl) {
    throw new Error("No file provided");
  }

  const s3Client = new S3Client({
    endpoint: process.env.DO_SPACES_ENDPOINT,
    region: process.env.DO_SPACES_REGION,
    credentials: {
      accessKeyId: process.env.DO_SPACES_KEY || "",
      secretAccessKey: process.env.DO_SPACES_SECRET || "",
    },
    forcePathStyle: true,
  });

  try {
    const key = imageUrl.split(".com/")[1];
    const response = await s3Client.send(
      new DeleteObjectCommand({
        Bucket: process.env.DO_SPACES_BUCKET,
        Key: key,
      })
    );

    if (!response.$metadata.httpStatusCode || response.$metadata.httpStatusCode !== 204) {
      throw new Error("Delete operation did not return expected status code");
    }
  } catch (error) {
    logError("Error deleting image", error);
    throw new Error("Failed to delete image");
  }
}
