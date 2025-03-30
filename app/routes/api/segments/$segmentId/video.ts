import { createAPIFileRoute } from "@tanstack/start/api";
import { AuthenticationError } from "~/use-cases/errors";
import { getSegmentByIdUseCase } from "~/use-cases/segments";
import { getAuthenticatedUser } from "~/utils/auth";
import { stat } from "fs/promises";
import { createReadStream, type ReadStream } from "fs";

function logMemoryUsage(label: string) {
  const used = process.memoryUsage();
  console.log(`=== Memory Usage [${label}] ===`);
  console.log(`Heap Used: ${Math.round(used.heapUsed / 1024 / 1024)}MB`);
  console.log(`Heap Total: ${Math.round(used.heapTotal / 1024 / 1024)}MB`);
  console.log(`RSS: ${Math.round(used.rss / 1024 / 1024)}MB`);
}

let activeStreams = 0;

function createWebStreamFromNodeStream(nodeStream: ReadStream) {
  activeStreams++;
  logMemoryUsage(`Stream Start #${activeStreams}`);

  let isDestroyed = false;
  let bytesTransferred = 0;

  // Set a smaller highWaterMark on the nodeStream
  nodeStream.pause();
  nodeStream.setMaxListeners(1);

  return new ReadableStream({
    start(controller) {
      // Set up data handling
      nodeStream.on("data", async (chunk) => {
        try {
          if (isDestroyed) return;

          bytesTransferred += chunk.length;
          nodeStream.pause(); // Ensure stream is paused before processing

          try {
            await controller.enqueue(chunk);
          } catch (error) {
            console.error("Failed to enqueue chunk:", error);
            isDestroyed = true;
            nodeStream.destroy();
            controller.error(error);
            return;
          }

          if (bytesTransferred % (10 * 1024 * 1024) === 0) {
            logMemoryUsage(`Transferred ${bytesTransferred / 1024 / 1024}MB`);
          }
        } catch (err) {
          console.error("Error in data handler:", err);
          isDestroyed = true;
          activeStreams--;
          nodeStream.destroy();
          controller.error(err);
        }
      });

      nodeStream.on("end", () => {
        if (isDestroyed) return;
        isDestroyed = true;
        activeStreams--;
        logMemoryUsage(
          `Stream End (${bytesTransferred / 1024 / 1024}MB transferred)`
        );
        controller.close();
      });

      nodeStream.on("error", (err) => {
        console.error("Stream error:", err);
        if (isDestroyed) return;
        isDestroyed = true;
        activeStreams--;
        nodeStream.destroy();
        controller.error(err);
      });
    },

    pull() {
      if (!isDestroyed && nodeStream.isPaused()) {
        nodeStream.resume();
      }
    },

    cancel() {
      console.log("Stream cancelled");
      if (!isDestroyed) {
        isDestroyed = true;
        activeStreams--;
        nodeStream.destroy();
      }
    },
  });
}

export const APIRoute = createAPIFileRoute("/api/segments/$segmentId/video")({
  GET: async ({ request, params }) => {
    // Validate access
    const user = await getAuthenticatedUser();
    if (!user) throw new AuthenticationError();

    const segmentId = Number(params.segmentId);
    if (isNaN(segmentId)) throw new Error("Invalid segment ID");

    const segment = await getSegmentByIdUseCase(segmentId);
    if (!segment) throw new Error("Segment not found");
    if (!segment.videoKey) throw new Error("Video not attached to segment");
    if (segment.isPremium && !user.isPremium && !user.isAdmin) {
      throw new Error("You don't have permission to access this video");
    }

    // Get file info
    const uploadDir = process.env.UPLOAD_DIR;
    if (!uploadDir)
      throw new Error("UPLOAD_DIR environment variable is not set");
    const filePath = `${uploadDir}/${segment.videoKey}`;
    const stats = await stat(filePath);

    // Handle range request
    const range = request.headers.get("range");
    if (range) {
      const parts = range.replace(/bytes=/, "").split("-");
      const start = parseInt(parts[0], 10);
      const end = parts[1] ? parseInt(parts[1], 10) : stats.size - 1;
      const chunksize = end - start + 1;

      const stream = createReadStream(filePath, {
        start,
        end,
        highWaterMark: 64 * 1024, // Reduce buffer size to 64KB
        autoClose: true,
      });
      const webStream = createWebStreamFromNodeStream(stream);

      return new Response(webStream, {
        status: 206,
        headers: {
          "Content-Range": `bytes ${start}-${end}/${stats.size}`,
          "Accept-Ranges": "bytes",
          "Content-Length": chunksize.toString(),
          "Content-Type": "video/mp4",
        },
      });
    }

    console.log("Starting full file request");
    // Handle full file request
    const stream = createReadStream(filePath, {
      highWaterMark: 64 * 1024, // Reduce buffer size to 64KB
      autoClose: true,
    });
    const webStream = createWebStreamFromNodeStream(stream);

    return new Response(webStream, {
      headers: {
        "Content-Type": "video/mp4",
        "Content-Length": stats.size.toString(),
        "Accept-Ranges": "bytes",
        "Cache-Control": "public, max-age=31536000, immutable",
        ETag: `"${stats.mtimeMs}"`,
      },
    });
  },
});
