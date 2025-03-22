import { useState, useEffect } from "react";
import { useFirstSegment } from "./use-first-segment";
import { getLastWatchedSegment } from "~/utils/local-storage";

export function useCourseLink() {
  const [courseLink, setCourseLink] = useState("");
  const firstSegment = useFirstSegment();

  useEffect(() => {
    const initializeCourseLink = async () => {
      const lastWatched = getLastWatchedSegment();
      if (lastWatched) {
        setCourseLink(`/learn/${lastWatched}`);
      } else if (firstSegment.data) {
        setCourseLink(`/learn/${firstSegment.data.slug}`);
      }
    };

    initializeCourseLink();
  }, [firstSegment.data]);

  return courseLink;
}
