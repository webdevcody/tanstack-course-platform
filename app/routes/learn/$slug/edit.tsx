import {
  createFileRoute,
  useNavigate,
  useRouter,
} from "@tanstack/react-router";
import { createServerFn } from "@tanstack/start";
import { z } from "zod";
import { Title } from "~/components/title";
import { Button } from "~/components/ui/button";
import { adminMiddleware, authenticatedMiddleware } from "~/lib/auth";
import {
  getSegmentBySlugUseCase,
  getSegmentByIdUseCase,
  updateSegmentUseCase,
} from "~/use-cases/segments";
import { assertAuthenticatedFn } from "~/fn/auth";
import { ChevronLeft } from "lucide-react";
import { Container } from "~/routes/learn/-components/container";
import { v4 as uuidv4 } from "uuid";
import { useState } from "react";
import { uploadFile } from "~/utils/storage";
import { getSegments } from "~/data-access/segments";
import {
  SegmentForm,
  type SegmentFormValues,
} from "../-components/segment-form";

function generateRandomUUID() {
  return uuidv4();
}

const updateSegmentFn = createServerFn()
  .middleware([authenticatedMiddleware])
  .validator(
    z.object({
      segmentId: z.number(),
      data: z.object({
        title: z.string(),
        content: z.string(),
        videoKey: z.string().optional(),
        moduleId: z.string(),
        slug: z.string(),
        length: z.string().optional(),
      }),
    })
  )
  .handler(async ({ data, context }) => {
    const segment = await getSegmentByIdUseCase(data.segmentId);
    if (!segment) throw new Error("Segment not found");

    if (!context.isAdmin) throw new Error("Not authorized");

    return await updateSegmentUseCase(data.segmentId, data.data);
  });

const loaderFn = createServerFn()
  .middleware([adminMiddleware])
  .validator(z.object({ slug: z.string() }))
  .handler(async ({ data, context }) => {
    const segment = await getSegmentBySlugUseCase(data.slug);
    if (!segment) throw new Error("Segment not found");
    return segment;
  });

const getUniqueModuleNamesFn = createServerFn()
  .middleware([authenticatedMiddleware])
  .handler(async () => {
    const segments = await getSegments();
    const uniqueModuleNames = Array.from(
      new Set(segments.map((segment) => segment.moduleId))
    );
    return uniqueModuleNames;
  });

export const Route = createFileRoute("/learn/$slug/edit")({
  component: RouteComponent,
  beforeLoad: () => assertAuthenticatedFn(),
  loader: async ({ params, context }) => {
    const [segment, moduleNames] = await Promise.all([
      loaderFn({ data: { slug: params.slug } }),
      getUniqueModuleNamesFn(),
    ]);

    return { segment, moduleNames };
  },
});

function RouteComponent() {
  const params = Route.useParams();
  const navigate = useNavigate();
  const slug = params.slug;
  const { segment, moduleNames } = Route.useLoaderData();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const onSubmit = async (values: SegmentFormValues) => {
    try {
      setIsSubmitting(true);
      let videoKey = undefined;
      if (values.video) {
        videoKey = generateRandomUUID();
        await uploadFile(videoKey, values.video);
      }

      await updateSegmentFn({
        data: {
          segmentId: segment.id,
          data: {
            title: values.title,
            content: values.content,
            videoKey: videoKey,
            moduleId: values.moduleId,
            slug: values.slug,
            length: values.length || undefined,
          },
        },
      });

      // Navigate back to the segment
      navigate({ to: "/learn/$slug", params: { slug } });
    } catch (error) {
      console.error("Failed to update segment:", error);
      // TODO: Show error toast
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Container>
      <div className="mb-6">
        <Button
          variant="outline"
          onClick={() =>
            navigate({ to: "/learn/$slug", params: { slug: segment.slug } })
          }
          className="flex items-center gap-2"
        >
          <ChevronLeft className="h-4 w-4" />
          Back to Course
        </Button>
      </div>

      <Title title="Edit Segment" />

      <div className="max-w-2xl">
        <SegmentForm
          onSubmit={onSubmit}
          defaultValues={{
            title: segment.title,
            content: segment.content,
            video: undefined,
            moduleId: segment.moduleId,
            slug: segment.slug,
            length: segment.length || "",
          }}
          moduleNames={moduleNames}
          isSubmitting={isSubmitting}
          submitButtonText="Update Segment"
          submitButtonLoadingText="Updating..."
        />
      </div>
    </Container>
  );
}
