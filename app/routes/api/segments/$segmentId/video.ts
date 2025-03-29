import { createAPIFileRoute } from "@tanstack/start/api";
import { AuthenticationError } from "~/use-cases/errors";
import { getSegmentByIdUseCase } from "~/use-cases/segments";
import { getAuthenticatedUser } from "~/utils/auth";
import { getFile } from "~/utils/disk-storage";
import { stat } from "fs/promises";

export const APIRoute = createAPIFileRoute("/api/segments/$segmentId/video")({
  GET: async ({ request, params }) => {
    const { segmentId } = params;
    console.time("getAuthenticatedUser");
    const user = await getAuthenticatedUser();
    if (!user) {
      throw new AuthenticationError();
    }
    console.timeEnd("getAuthenticatedUser");

    if (isNaN(Number(segmentId))) {
      throw new Error("Invalid segment ID");
    }

    const segment = await getSegmentByIdUseCase(Number(segmentId));

    if (!segment) {
      throw new Error("Segment not found");
    }

    if (!segment.videoKey) {
      throw new Error("Video not attached to segment");
    }

    if (segment.isPremium && !user.isPremium) {
      throw new Error("You don't have permission to access this video");
    }

    const videoStream = await getFile(segment.videoKey);

    if (!videoStream) {
      throw new Error("Video not found");
    }

    // Get file stats for content length
    const uploadDir = process.env.UPLOAD_DIR;
    if (!uploadDir) {
      throw new Error("UPLOAD_DIR environment variable is not set");
    }
    const filePath = `${uploadDir}/${segment.videoKey}`;
    const stats = await stat(filePath);

    const headers = new Headers({
      "Content-Type": "video/mp4",
      "Content-Length": stats.size.toString(),
      "Cache-Control": "public, max-age=31536000, immutable",
      ETag: `"${stats.mtimeMs}"`,
    });

    // Convert Node.js stream to Web stream
    const webStream = new ReadableStream({
      start(controller) {
        videoStream.on("data", (chunk) => {
          controller.enqueue(chunk);
        });
        videoStream.on("end", () => {
          controller.close();
        });
        videoStream.on("error", (err) => {
          controller.error(err);
        });
      },
      cancel() {
        videoStream.destroy();
      },
    });

    return new Response(webStream, { headers });
  },
});
