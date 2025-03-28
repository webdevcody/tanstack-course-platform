import { Segment } from "~/db/schema";
import { getPresignedPostUrlFn } from "~/fn/storage";

export function getStorageUrl(segmentId: Segment["id"]) {
  return `/api/segments/${segmentId}/video`;
}

export async function uploadFile(key: string, file: File) {
  const presignedPost = await getPresignedPostUrlFn({
    data: { key, contentType: file.type },
  });

  const formData = new FormData();
  Object.entries(presignedPost.fields).forEach(([key, value]) => {
    formData.append(key, value);
  });
  formData.append("file", file);

  const uploadResponse = await fetch(presignedPost.url, {
    method: "POST",
    body: formData,
  });

  if (!uploadResponse.ok) {
    throw new Error("Failed to upload video");
  }
}
