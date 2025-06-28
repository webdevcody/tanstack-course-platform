import { createFileRoute, Link } from "@tanstack/react-router";
import { isAdminFn } from "~/fn/auth";

export const Route = createFileRoute("/learn/no-segments")({
  component: RouteComponent,
  loader: async () => {
    const isAdmin = await isAdminFn();
    return { isAdmin };
  },
});

function RouteComponent() {
  const { isAdmin } = Route.useLoaderData();
  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <h1 className="text-4xl font-bold">No Learning Content Available</h1>
      <p className="text-lg text-center max-w-2xl">
        {isAdmin
          ? "You have not added any learning content yet."
          : "The course owner has not added any learning content yet. Please check back later."}
      </p>
      {isAdmin ? (
        <Link
          to="/learn/add"
          className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Create a Module
        </Link>
      ) : (
        <Link
          to="/"
          className="mt-4 px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
        >
          Back to Home
        </Link>
      )}
    </div>
  );
}
