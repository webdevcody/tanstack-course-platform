import { createFileRoute, Link } from "@tanstack/react-router";
import { createServerFn } from "@tanstack/start";
import { unauthenticatedMiddleware } from "~/lib/auth";
import { isAdminUseCase } from "~/use-cases/users";
import { getSegments } from "~/data-access/segments";
import { Button } from "~/components/ui/button";

const loaderFn = createServerFn()
  .middleware([unauthenticatedMiddleware])
  .handler(async () => {
    const isAdmin = await isAdminUseCase();
    const segments = await getSegments();
    return { isAdmin, segments };
  });

export const Route = createFileRoute("/learn/")({
  component: RouteComponent,
  loader: () => loaderFn(),
});

function RouteComponent() {
  const { isAdmin, segments } = Route.useLoaderData();

  if (segments.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen p-4">
        <h1 className="text-4xl font-bold mb-4">
          No Learning Content Available
        </h1>
        <p className="text-lg text-center max-w-2xl mb-8">
          {isAdmin
            ? "You have not added any learning content yet. Get started by creating your first module!"
            : "The course is still under development. Please check back later."}
        </p>
        {isAdmin ? (
          <Button asChild>
            <Link to="/learn/add">Create a Module</Link>
          </Button>
        ) : (
          <Button variant="outline" asChild>
            <Link to="/">Back to Home</Link>
          </Button>
        )}
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4">
      <h1 className="text-4xl font-bold mb-4">Welcome to the Course</h1>
      <p className="text-lg text-center max-w-2xl mb-8">
        Ready to start learning? Click below to begin with the first lesson.
      </p>
      <Button asChild>
        <Link to={`/learn/$slug`} params={{ slug: segments[0].slug }}>
          Start Learning
        </Link>
      </Button>
    </div>
  );
}
