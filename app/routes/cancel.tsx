import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/cancel")({ component: RouteComponent });

function RouteComponent() {
  return (
    <div className="container mx-auto p-4">
      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md text-center">
        <h1 className="text-2xl font-bold mb-4">Purchase Cancelled</h1>
        <p className="mb-4">
          Your purchase was cancelled. No charges were made.
        </p>
        <div className="mt-6">
          <a
            href="/purchase"
            className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded"
          >
            Return to Purchase Page
          </a>
        </div>
      </div>
    </div>
  );
}
