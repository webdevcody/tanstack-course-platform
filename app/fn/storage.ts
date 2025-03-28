import { createServerFn } from "@tanstack/start";
import { adminMiddleware, authenticatedMiddleware } from "~/lib/auth";
import { createPresignedPost } from "@aws-sdk/s3-presigned-post";
import { env } from "~/utils/env";
import { z } from "zod";
import { s3Client } from "~/lib/s3";
import { generateRandomUUID } from "~/utils/uuid";
import { saveFile } from "~/utils/disk-storage";

export const getPresignedPostUrlFn = createServerFn()
  .middleware([authenticatedMiddleware])
  .validator(z.object({ key: z.string(), contentType: z.string() }))
  .handler(async ({ data }) => {
    const { url, fields } = await createPresignedPost(s3Client, {
      Bucket: env.STORAGE_BUCKET_NAME,
      Key: data.key,
      Conditions: [
        ["content-length-range", 0, 100 * 1024 * 1024], // up to 100MB
        ["eq", "$Content-Type", data.contentType],
      ],
      Fields: { "Content-Type": data.contentType },
      Expires: 600, // 10 minutes
    });

    return { url, fields };
  });

export const uploadVideoFn = createServerFn({ method: "POST" })
  .middleware([adminMiddleware])
  .validator(z.instanceof(FormData))
  .handler(async ({ data: formData }) => {
    const videoKey = `${generateRandomUUID()}.mp4`;
    const file = formData.get("file") as File;
    if (!(file instanceof File)) throw new Error("[file] not found");
    const buffer = Buffer.from(await file.arrayBuffer());
    await saveFile(videoKey, buffer);
    return { videoKey };
  });
