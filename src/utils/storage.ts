import { Segment } from "~/db/schema";
import { uploadVideoChunkFn } from "~/fn/storage";
import { generateRandomUUID } from "./uuid";

export function getStorageUrl(segmentId: Segment["id"]) {
  return `/api/segments/${segmentId}/video`;
}

export async function uploadVideoChunk(key: string, file: File) {
  const CHUNK_SIZE = 50 * 1024 * 1024; // 50MB chunks
  const totalChunks = Math.ceil(file.size / CHUNK_SIZE);

  for (let chunkIndex = 0; chunkIndex < totalChunks; chunkIndex++) {
    const start = chunkIndex * CHUNK_SIZE;
    const end = Math.min(start + CHUNK_SIZE, file.size);
    const chunk = file.slice(start, end);

    // Create FormData and append all necessary data
    const formData = new FormData();
    formData.append("chunkIndex", chunkIndex.toString());
    formData.append("totalChunks", totalChunks.toString());
    formData.append("videoKey", key);
    formData.append("chunk", new File([chunk], file.name, { type: file.type }));

    await uploadVideoChunkFn({ data: formData });
  }

  return key;
}
