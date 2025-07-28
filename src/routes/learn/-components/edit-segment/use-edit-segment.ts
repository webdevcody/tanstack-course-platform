import { useState } from "react";
import { useNavigate, useParams } from "@tanstack/react-router";
import { updateSegmentFn } from "./server-functions";
import { type SegmentFormValues } from "../segment-form";
import {
  uploadVideoWithPresignedUrl,
  type UploadProgress,
} from "~/utils/storage/helpers";
import { generateRandomUUID } from "~/utils/uuid";

export function useEditSegment(segment: any) {
  const navigate = useNavigate();
  const params = useParams({ from: "/learn/$slug/edit" });
  const slug = params.slug;
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [uploadProgress, setUploadProgress] = useState<UploadProgress | null>(
    null
  );

  const onSubmit = async (values: SegmentFormValues) => {
    try {
      setIsSubmitting(true);
      let videoKey = undefined;
      let videoDuration = segment.length || undefined; // Keep existing length if no new video

      if (values.video) {
        videoKey = `${generateRandomUUID()}.mp4`;
        const uploadResult = await uploadVideoWithPresignedUrl(
          videoKey,
          values.video,
          progress => setUploadProgress(progress)
        );
        videoDuration = uploadResult.duration;
      }

      await updateSegmentFn({
        data: {
          segmentId: segment.id,
          updates: {
            title: values.title,
            content: values.content,
            videoKey: videoKey,
            moduleTitle: values.moduleTitle,
            slug: values.slug,
            length: videoDuration,
            isPremium: values.isPremium,
          },
        },
      });

      // Navigate back to the segment
      navigate({ to: "/learn/$slug", params: { slug } });
    } catch (error) {
      console.error("Failed to update segment:", error);
      // TODO: Show error toast
    } finally {
      setIsSubmitting(false);
      setUploadProgress(null);
    }
  };

  return {
    onSubmit,
    isSubmitting,
    uploadProgress,
  };
}
