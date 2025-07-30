import { useState, useEffect } from "react";
import { useFirstSegment } from "./use-first-segment";
import { getLastWatchedSegment } from "~/utils/local-storage";

export function useContinueSlug() {
  const [courseLink, setCourseLink] = useState("");
  const firstSegment = useFirstSegment();

  useEffect(() => {
    const initializeCourseLink = async () => {
      const lastWatched = getLastWatchedSegment();
      if (lastWatched) {
        setCourseLink(lastWatched);
      } else if (firstSegment.data?.slug) {
        setCourseLink(firstSegment.data.slug);
      } else {
        // If no first segment is available, set to empty string
        // This will be handled by the header component
        setCourseLink("");
      }
    };

    initializeCourseLink();
  }, [firstSegment.data]);

  return courseLink;
}
