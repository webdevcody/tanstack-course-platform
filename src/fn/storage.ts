import { createServerFn } from "@tanstack/react-start";
import { adminMiddleware } from "~/lib/auth";
import { z } from "zod";
import { getStorage } from "~/utils/storage";

// Unused old upload server function
// export const uploadVideoFn = createServerFn({ method: "POST" })
//   .middleware([adminMiddleware])
//   .validator(z.instanceof(FormData))
//   .handler(async ({ data: formData }) => {
//     const videoKey = `${generateRandomUUID()}.mp4`;
//     const file = formData.get("file") as File;
//     if (!(file instanceof File)) throw new Error("[file] not found");
//     const buffer = Buffer.from(await file.arrayBuffer());
//     await saveFile(videoKey, buffer);
//     return { videoKey };
//   });

export const uploadVideoChunkFn = createServerFn({ method: "POST" })
  .middleware([adminMiddleware])
  .validator(z.instanceof(FormData))
  .handler(async ({ data: formData }) => {
    const { storage } = getStorage();
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
    await storage.upload(chunkPath, chunkBuffer);

    // If this is the last chunk, combine all chunks and delete the chunks
    if (chunkIndex === totalChunks - 1) {
      await storage.combineChunks(
        videoKey,
        Array.from({ length: totalChunks }, (_, i) => `${videoKey}.part${i}`)
      );
    }

    return { videoKey };
  });
