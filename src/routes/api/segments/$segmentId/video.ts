import { json } from "@tanstack/react-start";
import { createServerFileRoute } from "@tanstack/react-start/server";
import { AuthenticationError } from "~/use-cases/errors";
import { getSegmentByIdUseCase } from "~/use-cases/segments";
import { getAuthenticatedUser } from "~/utils/auth";
import { getStorage } from "~/utils/storage";

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

    const { storage } = getStorage();

    const rangeHeader = request.headers.get("range");

    const { stream, contentLength, contentType, contentRange } =
      await storage.getStream(segment.videoKey, rangeHeader);

    console.log({
      contentLength,
      contentType,
      contentRange,
    });

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
