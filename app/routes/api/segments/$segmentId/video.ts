import { createAPIFileRoute } from "@tanstack/start/api";
import { AuthenticationError } from "~/use-cases/errors";
import { getSegmentByIdUseCase } from "~/use-cases/segments";
import { getAuthenticatedUser } from "~/utils/auth";
import { getFile } from "~/utils/disk-storage";
import { stat } from "fs/promises";
import { createReadStream } from "fs";

export const APIRoute = createAPIFileRoute("/api/segments/$segmentId/video")({
  GET: async ({ request, params }) => {
    const { segmentId } = params;

    const user = await getAuthenticatedUser();
    if (!user) {
      throw new AuthenticationError();
    }

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

    if (segment.isPremium && !user.isPremium && !user.isAdmin) {
      throw new Error("You don't have permission to access this video");
    }

    const uploadDir = process.env.UPLOAD_DIR;
    if (!uploadDir) {
      throw new Error("UPLOAD_DIR environment variable is not set");
    }
    const filePath = `${uploadDir}/${segment.videoKey}`;
    const stats = await stat(filePath);

    // Get the range header from the request
    const range = request.headers.get("range");
    if (range) {
      const parts = range.replace(/bytes=/, "").split("-");
      const start = parseInt(parts[0], 10);
      const end = parts[1] ? parseInt(parts[1], 10) : stats.size - 1;
      const chunksize = end - start + 1;
      const file = createReadStream(filePath, { start, end });
      const head = {
        "Content-Range": `bytes ${start}-${end}/${stats.size}`,
        "Accept-Ranges": "bytes",
        "Content-Length": chunksize.toString(),
        "Content-Type": "video/mp4",
      };
      return new Response(file as any, { status: 206, headers: head });
    }

    // If no range requested, send the whole file
    const headers = new Headers({
      "Content-Type": "video/mp4",
      "Content-Length": stats.size.toString(),
      "Accept-Ranges": "bytes",
      "Cache-Control": "public, max-age=31536000, immutable",
      ETag: `"${stats.mtimeMs}"`,
    });

    const videoStream = await getFile(segment.videoKey);

    if (!videoStream) {
      throw new Error("Video not found");
    }

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
