import { useState } from "react";
import { useNavigate } from "@tanstack/react-router";
import { createSegmentFn } from "./server-functions";
import { type SegmentFormValues } from "../segment-form";
import {
  uploadVideoWithPresignedUrl,
  type UploadProgress,
} from "~/utils/storage/helpers";
import { generateRandomUUID } from "~/utils/uuid";

export function useAddSegment() {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [uploadProgress, setUploadProgress] = useState<UploadProgress | null>(
    null
  );

  const onSubmit = async (values: SegmentFormValues) => {
    try {
      setIsSubmitting(true);
      let videoKey;
      let videoDuration;

      if (values.video) {
        videoKey = `${generateRandomUUID()}.mp4`;
        const uploadResult = await uploadVideoWithPresignedUrl(
          videoKey,
          values.video,
          progress => setUploadProgress(progress)
        );
        videoDuration = uploadResult.duration;
      }

      const segment = await createSegmentFn({
        data: {
          title: values.title,
          content: values.content,
          slug: values.title.toLowerCase().replace(/ /g, "-"),
          moduleTitle: values.moduleTitle,
          length: videoDuration,
          videoKey,
          isPremium: values.isPremium,
        },
      });

      // Navigate to the new segment
      navigate({ to: "/learn/$slug", params: { slug: segment.slug } });
    } catch (error) {
      console.error("Failed to create segment:", error);
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
