import { createServerFileRoute } from "@tanstack/react-start/server";
import { AuthenticationError } from "~/use-cases/errors";
import { getSegmentByIdUseCase } from "~/use-cases/segments";
import { getAuthenticatedUser } from "~/utils/auth";
import { stat } from "fs/promises";
import { createReadStream, type ReadStream } from "fs";
import { getStorage } from "~/utils/storage";

function logMemoryUsage(label: string) {
  const used = process.memoryUsage();
  console.log(`=== Memory Usage [${label}] ===`);
  console.log(`Heap Used: ${Math.round(used.heapUsed / 1024 / 1024)}MB`);
  console.log(`Heap Total: ${Math.round(used.heapTotal / 1024 / 1024)}MB`);
  console.log(`RSS: ${Math.round(used.rss / 1024 / 1024)}MB`);
}

function createWebStreamFromNodeStream(nodeStream: ReadStream) {
  logMemoryUsage(`Stream Start`);

  let isDestroyed = false;
  let controller: ReadableStreamDefaultController;

  // Create cleanup function
  const cleanup = () => {
    if (!isDestroyed) {
      isDestroyed = true;
      nodeStream.destroy();
      // Remove all listeners to prevent memory leaks
      nodeStream.removeAllListeners();
    }
  };

  return new ReadableStream({
    start(c) {
      controller = c;

      nodeStream.on("data", async chunk => {
        if (isDestroyed) return;

        try {
          nodeStream.pause(); // Pause immediately after receiving chunk
          await controller.enqueue(chunk);
        } catch (error) {
          console.error("Chunk processing error:", error);
          cleanup();
          controller.error(error);
        }
      });

      nodeStream.on("end", () => {
        cleanup();
        controller.close();
      });

      nodeStream.on("error", err => {
        console.error("Stream error:", err);
        cleanup();
        controller.error(err);
      });
    },

    pull() {
      if (!isDestroyed && nodeStream.isPaused()) {
        nodeStream.resume();
      }
    },

    cancel() {
      cleanup();
    },
  });
}

export const ServerRoute = createServerFileRoute(
  "/api/segments/$segmentId/video"
).methods({
  GET: async ({ request, params }) => {
    // Validate access
    const user = await getAuthenticatedUser();

    const segmentId = Number(params.segmentId);
    if (isNaN(segmentId)) throw new Error("Invalid segment ID");

    const segment = await getSegmentByIdUseCase(segmentId);
    if (!segment) throw new Error("Segment not found");
    if (!segment.videoKey) throw new Error("Video not attached to segment");

    if (segment.isPremium) {
      if (!user) throw new AuthenticationError();
      if (!user.isPremium && !user.isAdmin) {
        throw new Error("You don't have permission to access this video");
      }
    }

    const storage = getStorage();

    const rangeHeader = request.headers.get("range");
    const startRange = rangeHeader?.replace(/bytes=/, "").split("-")[0];
    const endRange = rangeHeader?.replace(/bytes=/, "").split("-")[1];
    const range = rangeHeader
      ? {
          start: startRange ? Number(startRange) : undefined,
          end: endRange ? Number(endRange) : undefined,
        }
      : undefined;

    const { stream, contentLength, contentType, contentRange } =
      await storage.getStream(segment.videoKey, range);

    return new Response(stream, {
      headers: {
        "Content-Type": contentType,
        "Content-Length": contentLength.toString(),
        "Accept-Ranges": "bytes",
        "Cache-Control": "public, max-age=31536000, immutable",
        ...(contentRange ? { "Content-Range": contentRange } : {}),
      },
    });
  },
});
