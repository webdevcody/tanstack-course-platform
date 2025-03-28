import { createServerFn } from "@tanstack/start";
import { adminMiddleware } from "~/lib/auth";
import { z } from "zod";
import { generateRandomUUID } from "~/utils/uuid";
import { saveFile } from "~/utils/disk-storage";

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
