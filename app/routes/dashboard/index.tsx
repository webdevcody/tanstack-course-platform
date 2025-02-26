import { createFileRoute, Link } from "@tanstack/react-router";
import { createServerFn } from "@tanstack/react-start";
import { authenticatedMiddleware } from "~/lib/auth";
import { Button } from "~/components/ui/button";
import { ChevronRight, GraduationCap } from "lucide-react";
import { cn } from "~/lib/utils";
import { assertAuthenticatedFn } from "~/fn/auth";
import { getBookmarkedCoursesUseCase } from "~/use-cases/courses";

const getBookmarkedCoursesFn = createServerFn()
  .middleware([authenticatedMiddleware])
  .handler(async ({ context }) => {
    const enrolledCourses = await getBookmarkedCoursesUseCase(context.userId);
    return enrolledCourses;
  });

export const Route = createFileRoute("/dashboard/")({
  component: RouteComponent,
  beforeLoad: () => assertAuthenticatedFn(),
  loader: async () => {
    const courses = await getBookmarkedCoursesFn();
    return { courses };
  },
});

function RouteComponent() {
  const { courses } = Route.useLoaderData();

  if (courses.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center flex-1 p-8 text-center">
        <GraduationCap className="h-16 w-16 text-muted-foreground mb-4" />
        <h2 className="text-2xl font-semibold mb-2">No Enrolled Courses</h2>
        <p className="text-muted-foreground mb-4">
          You haven't enrolled in any courses yet. Start your learning journey
          today!
        </p>
        <Link to="/courses">
          <Button>Browse Courses</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="flex-grow p-8">
      <h1 className="text-2xl font-bold mb-6">Your Courses</h1>

      <div className="grid gap-6">
        {courses.map((enrollment) => {
          const completedCount = 0; // TODO: hard coded for now
          const progress =
            enrollment.totalSegments === 0
              ? 100
              : Math.round(
                  (completedCount / enrollment.totalSegments ?? 1) * 100
                );

          return (
            <Link
              key={enrollment.courseId}
              to="/courses/$courseId"
              params={{ courseId: enrollment.courseId.toString() }}
            >
              <div
                className={cn(
                  "p-6 border rounded-lg hover:bg-accent transition-colors",
                  "flex flex-col gap-4"
                )}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-xl font-semibold">
                      {enrollment.course.title}
                    </h2>
                    <p className="text-sm text-muted-foreground">
                      {enrollment.course.category}
                    </p>
                  </div>
                  <ChevronRight className="h-5 w-5 text-muted-foreground" />
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Progress</span>
                    <span>{progress}%</span>
                  </div>
                  <div className="h-2 w-full bg-secondary rounded-full overflow-hidden">
                    <div
                      className="h-full bg-primary transition-all"
                      style={{ width: `${progress}%` }}
                    />
                  </div>
                </div>

                <div className="flex justify-between text-sm text-muted-foreground">
                  <span>
                    {completedCount} of {enrollment.totalSegments} segments
                    completed
                  </span>
                  <span>
                    Enrolled on{" "}
                    {new Date(enrollment.createdAt).toLocaleDateString()}
                  </span>
                </div>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
