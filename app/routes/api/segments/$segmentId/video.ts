import { createAPIFileRoute } from "@tanstack/start/api";
import { AuthenticationError } from "~/use-cases/errors";
import { getSegmentByIdUseCase } from "~/use-cases/segments";
import { getAuthenticatedUser } from "~/utils/auth";
import { getFile } from "~/utils/disk-storage";

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

    if (segment.isPremium && !user.isPremium) {
      throw new Error("You don't have permission to access this video");
    }

    const video = await getFile(segment.videoKey);

    if (!video) {
      throw new Error("Video not found");
    }

    const headers = new Headers({
      "Content-Type": "video/mp4",
      "Content-Length": video.length.toString(),
      "Cache-Control": "no-cache, no-store, must-revalidate",
      Pragma: "no-cache",
      Expires: "0",
    });

    return new Response(video, { headers });
  },
});
