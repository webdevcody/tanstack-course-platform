import { createFileRoute } from "@tanstack/react-router";
import { assertAuthenticatedFn } from "~/fn/auth";
import {
  getUniqueModuleNamesFn,
  getSegmentFn,
  EditSegmentHeader,
  useEditSegment,
} from "../-components/edit-segment";
import { Container } from "../-components/container";
import { SegmentForm } from "../-components/segment-form";
import { Edit } from "lucide-react";

export const Route = createFileRoute("/learn/$slug/edit")({
  component: RouteComponent,
  beforeLoad: () => assertAuthenticatedFn(),
  loader: async ({ params }) => {
    const { segment } = await getSegmentFn({ data: { slug: params.slug } });
    const moduleNames = await getUniqueModuleNamesFn();
    return { segment, moduleNames };
  },
});

function RouteComponent() {
  const { segment, moduleNames } = Route.useLoaderData();
  const { onSubmit, isSubmitting, uploadProgress } = useEditSegment(segment);

  return (
    <div className="min-h-screen bg-gradient-to-br from-theme-50/30 via-transparent to-theme-100/20 dark:from-theme-950/20 dark:via-transparent dark:to-theme-900/10 rounded-3xl ">
      <EditSegmentHeader />
      <Container>
        <SegmentForm
          headerTitle="Edit Content"
          headerDescription="Update your course segment with rich content and media"
          buttonText="Update Content"
          loadingText="Updating..."
          buttonIcon={Edit}
          moduleNames={moduleNames}
          onSubmit={onSubmit}
          isSubmitting={isSubmitting}
          uploadProgress={uploadProgress}
          defaultValues={{
            title: segment.title,
            content: segment.content ?? "",
            slug: segment.slug,
            moduleTitle: segment.moduleTitle,
            isPremium: segment.isPremium,
          }}
        />
      </Container>
    </div>
  );
}
