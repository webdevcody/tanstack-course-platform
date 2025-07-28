import { getPresignedUploadUrlFn } from "~/fn/storage";

export async function uploadVideoWithPresignedUrl(
  key: string,
  file: File
): Promise<string> {
  // Get presigned URL from server
  const { presignedUrl } = await getPresignedUploadUrlFn({
    data: { videoKey: key },
  });

  // Upload directly to R2 using presigned URL
  const response = await fetch(presignedUrl, {
    method: "PUT",
    body: file,
    headers: {
      "Content-Type": "video/mp4",
    },
  });

  if (!response.ok) {
    throw new Error(`Upload failed: ${response.statusText}`);
  }

  return key;
}
