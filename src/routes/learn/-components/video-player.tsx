import { useQuery } from "@tanstack/react-query";
import { createServerFn, useServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { AuthenticationError } from "~/use-cases/errors";
import { getSegmentByIdUseCase } from "~/use-cases/segments";
import { getAuthenticatedUser } from "~/utils/auth";
import { getStorage } from "~/utils/storage";

interface VideoPlayerProps {
  segmentId: number;
}

export function VideoPlayer({ segmentId }: VideoPlayerProps) {
  const getVideoUrl = useServerFn(getVideoUrlFn);
  const { data, isLoading } = useQuery({
    queryKey: ["video-url", segmentId],
    queryFn: () => getVideoUrl({ data: { segmentId } }),
    refetchOnWindowFocus: false,
    retry: false,
    staleTime: 1000 * 60 * 55, // 55 minutes
    gcTime: 1000 * 60 * 60, // 1 hour
  });

  return (
    <div className="mb-6">
      {isLoading && <div>Loading video...</div>}
      {data && (
        <video src={data.videoUrl} controls className="w-full mx-auto">
          Your browser does not support the video tag.
        </video>
      )}
    </div>
  );
}

export const getVideoUrlFn = createServerFn({ method: "GET" })
  .validator(z.object({ segmentId: z.number() }))
  .handler(async ({ data }) => {
    const { storage, type } = getStorage();

    if (type !== "r2") {
      return { videoUrl: `/api/segments/${data.segmentId}/video` };
    }

    const user = await getAuthenticatedUser();

    const segment = await getSegmentByIdUseCase(data.segmentId);
    if (!segment) throw new Error("Segment not found");
    if (!segment.videoKey) throw new Error("Video not attached to segment");

    if (segment.isPremium) {
      if (!user) throw new AuthenticationError();
      if (!user.isPremium && !user.isAdmin) {
        throw new Error("You don't have permission to access this video");
      }
    }

    const url = await storage.getPresignedUrl(segment.videoKey);
    return { videoUrl: url };
  });
