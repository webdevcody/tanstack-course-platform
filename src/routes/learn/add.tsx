import { createFileRoute } from "@tanstack/react-router";
import { assertAuthenticatedFn } from "~/fn/auth";
import {
  getUniqueModuleNamesFn,
  AddSegmentHeader,
  useAddSegment,
} from "./-components/add-segment";
import { Container } from "./-components/container";
import { SegmentForm } from "./-components/segment-form";

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
    <Container>
      <AddSegmentHeader />

      <SegmentForm
        onSubmit={onSubmit}
        defaultValues={{
          title: "",
          content: "",
          video: undefined,
          slug: "",
          moduleTitle: "",
          isPremium: false,
        }}
        moduleNames={moduleNames}
        isSubmitting={isSubmitting}
        submitButtonText="Create Content"
        submitButtonLoadingText="Creating..."
        uploadProgress={uploadProgress}
      />
    </Container>
  );
}
