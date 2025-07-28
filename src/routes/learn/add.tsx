import { createFileRoute } from "@tanstack/react-router";
import { assertAuthenticatedFn } from "~/fn/auth";
import {
  getUniqueModuleNamesFn,
  AddSegmentHeader,
  useAddSegment,
} from "./-components/add-segment";
import { Container } from "./-components/container";
import { SegmentForm } from "./-components/segment-form";
import { Plus } from "lucide-react";

export const Route = createFileRoute("/learn/add")({
  component: RouteComponent,
  beforeLoad: () => assertAuthenticatedFn(),
  loader: async () => {
    const moduleNames = await getUniqueModuleNamesFn();
    return { moduleNames };
  },
});

function RouteComponent() {
  const { moduleNames } = Route.useLoaderData();
  const { onSubmit, isSubmitting, uploadProgress } = useAddSegment();

  return (
    <div className="container mx-auto">
      <AddSegmentHeader />
      <Container>
        <SegmentForm
          headerTitle="Create New Content"
          headerDescription="Add a new segment to your course with rich content and media"
          buttonText="Create Content"
          loadingText="Creating..."
          buttonIcon={Plus}
          moduleNames={moduleNames}
          onSubmit={onSubmit}
          isSubmitting={isSubmitting}
          uploadProgress={uploadProgress}
          defaultValues={{
            title: "",
            content: "",
            slug: "",
            moduleTitle: "",
            isPremium: false,
          }}
        />
      </Container>
    </div>
  );
}
