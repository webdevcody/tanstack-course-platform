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
  PutObjectCommand,
  S3Client,
} from "@aws-sdk/client-s3";

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

  async upload(key: string, data: Buffer) {
    await this.client.send(
      new PutObjectCommand({
        Bucket: this.bucket,
        Key: key,
        Body: data,
        ContentType: "video/mp4",
      })
    );
  }

  async delete(key: string) {
    await this.client.send(
      new DeleteObjectCommand({
        Bucket: this.bucket,
        Key: key,
      })
    );
  }

  async getStream(
    key: string,
    rangeHeader: string | null
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
