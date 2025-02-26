import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import {
  bookmarkCourseUseCase,
  isBookmarkedUseCase,
  unbookmarkCourseUseCase,
} from "~/use-cases/courses";
import { validateRequest } from "~/utils/auth";
import { useEffect, useState } from "react";

const toggleBookmarkFn = createServerFn()
  .validator(
    z.object({
      courseId: z.number(),
      isBookmarked: z.boolean(),
    })
  )
  .handler(async ({ data }) => {
    const { user } = await validateRequest();
    if (!user) throw new Error("Not authenticated");

    if (data.isBookmarked) {
      await unbookmarkCourseUseCase(user.id, data.courseId);
    } else {
      await bookmarkCourseUseCase(user.id, data.courseId);
    }
    return !data.isBookmarked;
  });

const getIsBookmarkedFn = createServerFn()
  .validator(
    z.object({
      courseId: z.number(),
    })
  )
  .handler(async ({ data }) => {
    const { user } = await validateRequest();
    if (!user) return false;
    return isBookmarkedUseCase(user.id, data.courseId);
  });

export function useCourseBookmark(courseId: number) {
  const [isBookmarked, setIsBookmarked] = useState(false);

  useEffect(() => {
    getIsBookmarkedFn({ data: { courseId } }).then(setIsBookmarked);
  }, [courseId]);

  const handleBookmarkToggle = async () => {
    try {
      const newIsBookmarked = await toggleBookmarkFn({
        data: { courseId, isBookmarked },
      });
      setIsBookmarked(newIsBookmarked);
    } catch (error) {
      // TODO: Show login modal or redirect to login
      console.error("Failed to toggle bookmark:", error);
    }
  };

  return {
    isBookmarked,
    toggleBookmark: handleBookmarkToggle,
  };
}
