import { Link } from "@tanstack/react-router";
import { Bookmark, GraduationCap } from "lucide-react";
import { Button } from "~/components/ui/button";
import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import { Course } from "~/db/schema";
import { cn } from "~/lib/utils";
import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { validateRequest } from "~/utils/auth";
import React from "react";
import {
  bookmarkCourseUseCase,
  isBookmarkedUseCase,
  unbookmarkCourseUseCase,
} from "~/use-cases/bookmarks";

const toggleEnrollmentFn = createServerFn()
  .validator(
    z.object({
      courseId: z.number(),
      isEnrolled: z.boolean(),
    })
  )
  .handler(async ({ data }) => {
    const { user } = await validateRequest();
    if (!user) throw new Error("Not authenticated");

    if (data.isEnrolled) {
      await unbookmarkCourseUseCase(user.id, data.courseId);
    } else {
      await bookmarkCourseUseCase(user.id, data.courseId);
    }
    return !data.isEnrolled;
  });

const getIsEnrolledFn = createServerFn()
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

export function CourseCard({ course }: { course: Course }) {
  const [isEnrolled, setIsEnrolled] = React.useState(false);

  React.useEffect(() => {
    getIsEnrolledFn({ data: { courseId: course.id } }).then(setIsEnrolled);
  }, [course.id]);

  const handleEnrollmentToggle = async () => {
    try {
      const newIsEnrolled = await toggleEnrollmentFn({
        data: { courseId: course.id, isEnrolled },
      });
      setIsEnrolled(newIsEnrolled);
    } catch (error) {
      // TODO: Show login modal or redirect to login
      console.error("Failed to toggle enrollment:", error);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex justify-between items-center">
          <span>{course.title}</span>
          <Button
            variant="ghost"
            size="icon"
            onClick={handleEnrollmentToggle}
            className="flex-shrink-0"
          >
            <Bookmark
              className={cn(
                "h-5 w-5",
                isEnrolled ? "fill-current" : "fill-none"
              )}
            />
            <span className="sr-only">
              {isEnrolled ? "Unenroll from course" : "Enroll in course"}
            </span>
          </Button>
        </CardTitle>
        <CardDescription>{course.category}</CardDescription>
      </CardHeader>
      {/* <CardContent>
        <p>{exercise.reps} reps</p>
        <p>{exercise.sets} sets</p>
      </CardContent> */}
      <CardFooter>
        <Link
          to="/courses/$courseId"
          params={{ courseId: course.id.toString() }}
        >
          <Button>View</Button>
        </Link>
      </CardFooter>
    </Card>
  );
}
