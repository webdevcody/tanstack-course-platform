import { createServerFn } from "@tanstack/start";
import { adminMiddleware } from "~/lib/auth";
import { z } from "zod";
import { generateRandomUUID } from "~/utils/uuid";
import { deleteFile, saveFile } from "~/utils/disk-storage";
import path from "path";
import fs from "fs/promises";

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

export const uploadVideoChunkFn = createServerFn({ method: "POST" })
  .middleware([adminMiddleware])
  .validator(z.instanceof(FormData))
  .handler(async ({ data: formData }) => {
    const chunkIndex = Number(formData.get("chunkIndex"));
    const totalChunks = Number(formData.get("totalChunks"));
    const videoKey = formData.get("videoKey") as string;
    const chunk = formData.get("chunk") as File;

    if (isNaN(chunkIndex) || isNaN(totalChunks)) {
      throw new Error("Invalid chunk metadata");
    }
    if (!videoKey || typeof videoKey !== "string") {
      throw new Error("Invalid videoKey");
    }
    if (!(chunk instanceof File)) {
      throw new Error("Invalid chunk data");
    }

    const chunkBuffer = Buffer.from(await chunk.arrayBuffer());

    // Save chunk with index in filename
    const chunkPath = `${videoKey}.part${chunkIndex}`;
    await saveFile(chunkPath, chunkBuffer);

    // If this is the last chunk, combine all chunks
    if (chunkIndex === totalChunks - 1) {
      const uploadDir = process.env.UPLOAD_DIR;
      if (!uploadDir)
        throw new Error("UPLOAD_DIR environment variable is not set");

      // Combine all chunks
      const chunks = [];
      for (let i = 0; i < totalChunks; i++) {
        const chunkPath = path.join(uploadDir, `${videoKey}.part${i}`);
        const chunkData = await fs.readFile(chunkPath);
        chunks.push(chunkData);
      }

      // Combine chunks and save final file
      const finalBuffer = Buffer.concat(chunks);
      await saveFile(videoKey, finalBuffer);

      // Delete all chunk files
      for (let i = 0; i < totalChunks; i++) {
        const chunkPath = path.join(uploadDir, `${videoKey}.part${i}`);
        await deleteFile(chunkPath);
      }
    }

    return { videoKey };
  });
