"use server";

import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { Image } from "@/types/image";
import { logError } from "@/lib/utils";

export async function uploadImageAction(file: File): Promise<Image> {
  if (!file) {
    throw new Error("No file provided");
  }

  const timestamp = new Date().toISOString().replace(/[:.-]/g, "");
  const extension = file.name.split(".").pop() || "jpg";
  const filename = `${timestamp}.${extension}`;

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
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    const command = new PutObjectCommand({
      Bucket: process.env.DO_SPACES_BUCKET,
      Key: filename,
      Body: buffer,
      ACL: "public-read",
      ContentType: file.type,
    });

    await s3Client.send(command);

    const imageUrl = `https://${process.env.DO_SPACES_BUCKET}.${process.env.DO_SPACES_ENDPOINT?.replace("https://", "")}/${filename}`;

    return {
      id: new Date().getTime(),
      alt: file.name,
      url: imageUrl,
    };
  } catch (error) {
    logError("Error uploading image", error);
    throw new Error("Failed to upload image");
  }
}
