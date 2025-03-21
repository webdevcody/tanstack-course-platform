import { createFileRoute, Link } from "@tanstack/react-router";
import { createServerFn } from "@tanstack/start";
import { z } from "zod";
import { getSegmentsUseCase } from "~/use-cases/segments";
import { Button } from "~/components/ui/button";
import React from "react";
import { ChevronRight, Plus } from "lucide-react";
import { Title } from "~/components/title";
import { Container } from "./-components/container";

const loaderFn = createServerFn()
  .validator(z.object({}))
  .handler(async () => {
    const segments = await getSegmentsUseCase();
    return { segments };
  });

export const Route = createFileRoute("/learn/")({
  component: RouteComponent,
  loader: async () => {
    return loaderFn({ data: {} });
  },
});

function RouteComponent() {
  const { segments } = Route.useLoaderData();

  return (
    <Container>
      <Title title="Learning Content" />

      {/* Segments List */}
      <div className="mt-8">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-semibold">Content</h2>
          <Link to="/learn/add">
            <Button>
              <Plus className="h-5 w-5 mr-2" />
              Add Content
            </Button>
          </Link>
        </div>

        {segments.length === 0 ? (
          <div className="text-center py-12 border rounded-lg bg-muted/10">
            <h3 className="text-lg font-medium text-muted-foreground mb-2">
              No content yet
            </h3>
            <p className="text-sm text-muted-foreground mb-4">
              Get started by adding your first learning content
            </p>
            <Link to="/learn/add">
              <Button variant="secondary">
                <Plus className="h-4 w-4 mr-2" />
                Add Your First Content
              </Button>
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {segments.map((segment, index) => (
              <Link
                key={segment.id}
                to="/learn/$segmentId"
                params={{ segmentId: segment.id.toString() }}
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
