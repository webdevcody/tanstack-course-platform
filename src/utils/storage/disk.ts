import type {
  IStorage,
  StreamFileRange,
  StreamFileResponse,
} from "./storage.interface";

import path from "node:path";
import fs, { type ReadStream } from "node:fs";

export class DiskStorage implements IStorage {
  private readonly uploadDir: string;

  constructor() {
    const uploadDir = process.env.UPLOAD_DIR;
    if (!uploadDir) {
      throw new Error("UPLOAD_DIR is not set");
    }

    this.uploadDir = uploadDir;
  }

  private getPath(key: string) {
    return path.join(this.uploadDir, key);
  }

  async upload(key: string, data: Buffer) {
    await fs.promises.mkdir(this.uploadDir, { recursive: true });
    await fs.promises.writeFile(this.getPath(key), data);
  }

  async delete(key: string) {
    try {
      await fs.promises.unlink(this.getPath(key));
    } catch {}
  }

  async getStream(
    key: string,
    rangeHeader: string | null
  ): Promise<StreamFileResponse> {
    // Range handling
    const startRange = rangeHeader?.replace(/bytes=/, "").split("-")[0];
    const endRange = rangeHeader?.replace(/bytes=/, "").split("-")[1];
    const range = rangeHeader
      ? {
          start: startRange ? Number(startRange) : undefined,
          end: endRange ? Number(endRange) : undefined,
        }
      : undefined;

    const filePath = this.getPath(key);
    const stats = await fs.promises.stat(filePath);
    const contentLength = stats.size;

    const nodeStream = fs.createReadStream(filePath, range);
    const webStream = createWebStreamFromNodeStream(nodeStream);

    return {
      stream: webStream,
      contentLength,
      contentType: "video/mp4",
      contentRange: range
        ? `bytes ${range.start}-${range.end}/${contentLength}`
        : undefined,
    };
  }

  async getPresignedUrl(_key: string): Promise<string> {
    throw new Error("getPresignedUrl is not supported for disk storage");
  }

  async combineChunks(finalKey: string, partKeys: string[]) {
    const buffers = await Promise.all(
      partKeys.map(async key => fs.promises.readFile(this.getPath(key)))
    );
    await this.upload(finalKey, Buffer.concat(buffers));

    // Cleanup
    for (const key of partKeys) {
      await this.delete(key);
    }
  }
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
          controller.enqueue(chunk);
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

function logMemoryUsage(label: string) {
  const used = process.memoryUsage();
  console.log(`=== Memory Usage [${label}] ===`);
  console.log(`Heap Used: ${Math.round(used.heapUsed / 1024 / 1024)}MB`);
  console.log(`Heap Total: ${Math.round(used.heapTotal / 1024 / 1024)}MB`);
  console.log(`RSS: ${Math.round(used.rss / 1024 / 1024)}MB`);
}
