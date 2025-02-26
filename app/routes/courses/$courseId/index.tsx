import { createFileRoute, Link } from "@tanstack/react-router";
import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { getCourseUseCase, isCourseAdminUseCase } from "~/use-cases/courses";
import { VideoPlayer } from "./-components/video-player";
import { Button, buttonVariants } from "~/components/ui/button";
import React from "react";
import { getSegmentsUseCase } from "~/use-cases/segments";
import { Bookmark, ChevronRight, Edit, Lightbulb, Plus } from "lucide-react";
import { cn } from "~/lib/utils";
import { Container } from "../-components/container";
import { Title } from "~/components/title";
import {
  bookmarkCourseUseCase,
  isBookmarkedUseCase,
  unbookmarkCourseUseCase,
} from "~/use-cases/bookmarks";
import { authenticatedMiddleware, userIdMiddleware } from "~/lib/auth";
import ReactMarkdown from "react-markdown";
import { getStorageUrl } from "~/utils/storage";

const toggleBookmarkFn = createServerFn()
  .middleware([authenticatedMiddleware])
  .validator(
    z.object({
      courseId: z.number(),
      isBookmarked: z.boolean(),
    })
  )
  .handler(async ({ data, context }) => {
    data.isBookmarked
      ? await unbookmarkCourseUseCase(context.userId, data.courseId)
      : await bookmarkCourseUseCase(context.userId, data.courseId);
    return !data.isBookmarked;
  });

const loaderFn = createServerFn()
  .middleware([userIdMiddleware])
  .validator(
    z.object({
      courseId: z.number(),
    })
  )
  .handler(async ({ data, context }) => {
    const [course, segments, isBookmarked, isAdmin] = await Promise.all([
      getCourseUseCase(data.courseId),
      getSegmentsUseCase(data.courseId),
      context.userId
        ? isBookmarkedUseCase(context.userId, data.courseId)
        : false,
      context.userId
        ? isCourseAdminUseCase(context.userId, data.courseId)
        : false,
    ]);
    return { course, segments, isBookmarked, isAdmin, userId: context.userId };
  });

export const Route = createFileRoute("/courses/$courseId/")({
  component: RouteComponent,
  loader: async ({ params }) => {
    return loaderFn({
      data: { courseId: parseInt(params.courseId) },
    });
  },
});

function RouteComponent() {
  const {
    course,
    segments,
    isBookmarked: _isBookmarked,
    isAdmin,
    userId,
  } = Route.useLoaderData();

  const [isBookmarked, setIsBookmarked] = React.useState(_isBookmarked);
  const contentRef = React.useRef<HTMLDivElement>(null);

  const handleBookmarkToggle = async () => {
    try {
      const newIsBookmarked = await toggleBookmarkFn({
        data: { courseId: course.id, isBookmarked },
      });
      setIsBookmarked(newIsBookmarked);
    } catch (error) {
      // TODO: Show login modal or redirect to login
      console.error("Failed to toggle bookmark:", error);
    }
  };

  const scrollToContent = () => {
    contentRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <Container>
      {/* Course Header */}
      <Title
        title={course.title}
        actions={
          <div className="flex items-center gap-2">
            {isAdmin && (
              <Link
                to="/courses/$courseId/edit"
                params={{ courseId: course.id.toString() }}
                className={buttonVariants({ variant: "outline" })}
              >
                <Edit />
                Edit Course
              </Link>
            )}

            <Button onClick={scrollToContent} variant="default">
              <Lightbulb /> Start Learning
            </Button>

            <Button
              variant={isBookmarked ? "secondary" : "outline"}
              onClick={handleBookmarkToggle}
              className="flex-shrink-0 transition-colors"
              aria-pressed={isBookmarked}
            >
              <Bookmark
                className={cn(
                  "h-5 w-5 mr-2 transition-all",
                  isBookmarked ? "fill-current" : "fill-none"
                )}
              />
              {isBookmarked ? "Bookmarked" : "Bookmark"}
            </Button>
          </div>
        }
      />

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
        {/* Left Column - Course Info */}
        <div className="space-y-6">
          {/* Course Description */}
          <div className="prose max-w-none">
            <ReactMarkdown>{course.description}</ReactMarkdown>
          </div>
        </div>

        {/* Right Column - Video */}
        <div className="w-full">
          {course.videoKey && (
            <VideoPlayer url={getStorageUrl(course.videoKey)} />
          )}
        </div>
      </div>

      {/* Segments List */}
      <div className="mt-8" ref={contentRef}>
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-semibold">Course Content</h2>
          {isAdmin && (
            <Link
              to="/courses/$courseId/segments/$segmentId"
              params={{ courseId: course.id.toString(), segmentId: "add" }}
            >
              <Button>
                <Plus className="h-5 w-5 mr-2" />
                Add Segment
              </Button>
            </Link>
          )}
        </div>

        {segments.length === 0 ? (
          <div className="text-center py-12 border rounded-lg bg-muted/10">
            <h3 className="text-lg font-medium text-muted-foreground mb-2">
              No segments yet
            </h3>
            {isAdmin ? (
              <p className="text-sm text-muted-foreground mb-4">
                Get started by adding your first course segment
              </p>
            ) : (
              <p className="text-sm text-muted-foreground">
                The course content is being prepared. Check back soon!
              </p>
            )}
            {isAdmin && (
              <Link
                to="/courses/$courseId/segments/$segmentId"
                params={{ courseId: course.id.toString(), segmentId: "add" }}
              >
                <Button variant="secondary">
                  <Plus className="h-4 w-4 mr-2" />
                  Add Your First Segment
                </Button>
              </Link>
            )}
          </div>
        ) : (
          <div className="space-y-4">
            {segments.map((segment, index) => (
              <Link
                key={segment.id}
                to="/courses/$courseId/segments/$segmentId"
                params={{
                  courseId: course.id.toString(),
                  segmentId: segment.id.toString(),
                }}
              >
                <div className="p-4 border rounded-lg hover:bg-accent transition-colors">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-medium">
                        {index + 1}. {segment.title}
                      </h3>
                    </div>
                    <ChevronRight className="h-5 w-5 text-muted-foreground" />
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </Container>
  );
}
