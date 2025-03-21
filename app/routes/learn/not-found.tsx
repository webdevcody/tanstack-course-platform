import { createFileRoute, Link } from "@tanstack/react-router";

export const Route = createFileRoute("/learn/not-found")({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <h1 className="text-4xl font-bold">Not found</h1>
      <p className="text-lg">The segment you are looking for does not exist.</p>
      <Link to="/">Start learning</Link>
    </div>
  );
}
