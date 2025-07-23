import type {
  IStorage,
  StreamFileRange,
  StreamFileResponse,
} from "./storage.interface";

import type { Readable } from "node:stream";

import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import {
  DeleteObjectCommand,
  GetObjectCommand,
  HeadObjectCommand,
  PutObjectCommand,
  S3Client,
} from "@aws-sdk/client-s3";
import { Upload } from "@aws-sdk/lib-storage";

export class R2Storage implements IStorage {
  private readonly client: S3Client;
  private readonly bucket: string;

  constructor() {
    const endpoint = process.env.R2_ENDPOINT;
    const accessKeyId = process.env.R2_ACCESS_KEY_ID;
    const secretAccessKey = process.env.R2_SECRET_ACCESS_KEY;
    const bucket = process.env.R2_BUCKET;

    if (!endpoint || !accessKeyId || !secretAccessKey || !bucket) {
      throw new Error(
        "R2_ENDPOINT, R2_ACCESS_KEY_ID, R2_SECRET_ACCESS_KEY, and R2_BUCKET must be set"
      );
    }

    this.bucket = bucket;
    this.client = new S3Client({
      region: "auto",
      endpoint,
      credentials: {
        accessKeyId,
        secretAccessKey,
      },
    });
  }

  async upload(
    key: string,
    data: Buffer,
    onProgress?: (progress: number) => void
  ) {
    const command = new PutObjectCommand({
      Bucket: this.bucket,
      Key: key,
      Body: data,
      ContentType: "video/mp4",
    });

    if (onProgress) {
      // For now, we'll simulate progress since S3/R2 doesn't provide real-time progress
      // We could implement multipart uploads for better progress tracking
      onProgress(50); // Simulate 50% progress
      await this.client.send(command);
      onProgress(100); // Complete
    } else {
      await this.client.send(command);
    }
  }

  async uploadWithProgress(
    key: string,
    data: Buffer,
    onProgress?: (progress: {
      loaded: number;
      total: number;
      percentage: number;
    }) => void
  ) {
    const totalSize = data.length;

    // Use the Upload class from @aws-sdk/lib-storage for proper multipart uploads
    const upload = new Upload({
      client: this.client,
      params: {
        Bucket: this.bucket,
        Key: key,
        Body: data,
        ContentType: "video/mp4",
      },
      // Configure multipart upload settings
      partSize: 5 * 1024 * 1024, // 5MB parts (minimum for S3)
      queueSize: 4, // Number of parts to upload concurrently
    });

    // Listen to upload progress events
    upload.on("httpUploadProgress", (progress) => {
      if (
        onProgress &&
        progress.loaded !== undefined &&
        progress.total !== undefined
      ) {
        const percentage = Math.round((progress.loaded / progress.total) * 100);
        onProgress({
          loaded: progress.loaded,
          total: progress.total,
          percentage,
        });
      }
    });

    // Execute the upload
    await upload.done();
  }

  async delete(key: string) {
    await this.client.send(
      new DeleteObjectCommand({
        Bucket: this.bucket,
        Key: key,
      })
    );
  }

  async exists(key: string): Promise<boolean> {
    try {
      await this.client.send(
        new HeadObjectCommand({
          Bucket: this.bucket,
          Key: key,
        })
      );
      return true;
    } catch (error: any) {
      if (
        error.name === "NotFound" ||
        error.$metadata?.httpStatusCode === 404
      ) {
        return false;
      }
      throw error;
    }
  }

  async getStream(
    _key: string,
    _rangeHeader: string | null
  ): Promise<StreamFileResponse> {
    throw new Error(
      "getStream is not supported for R2. Use getPresignedUrl instead."
    );
  }

  async getPresignedUrl(key: string) {
    return await getSignedUrl(
      this.client,
      new GetObjectCommand({
        Bucket: this.bucket,
        Key: key,
      }),
      { expiresIn: 60 * 60 } // 1 hour
    );
  }

  async combineChunks(finalKey: string, partKeys: string[]) {
    const buffers: Buffer[] = [];

    for (const key of partKeys) {
      const res = await this.client.send(
        new GetObjectCommand({
          Bucket: this.bucket,
          Key: key,
        })
      );

      const bodyStream = res.Body as Readable;
      const chunks: Buffer[] = [];

      for await (const chunk of bodyStream) {
        chunks.push(Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk));
      }

      buffers.push(Buffer.concat(chunks));
    }

    await this.upload(finalKey, Buffer.concat(buffers));

    for (const key of partKeys) {
      await this.delete(key);
    }
  }
}
