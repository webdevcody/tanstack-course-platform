import {
  createFileRoute,
  useNavigate,
  useRouter,
} from "@tanstack/react-router";
import { createServerFn } from "@tanstack/start";
import { z } from "zod";
import { Button } from "~/components/ui/button";
import { authenticatedMiddleware } from "~/lib/auth";
import { addSegmentUseCase } from "~/use-cases/segments";
import { assertAuthenticatedFn } from "~/fn/auth";
import { ChevronLeft } from "lucide-react";
import { getSegments } from "~/data-access/segments";
import { v4 as uuidv4 } from "uuid";
import { useState } from "react";
import { uploadFile } from "~/utils/storage";
import { Container } from "./-components/container";
import {
  SegmentForm,
  type SegmentFormValues,
} from "./-components/segment-form";

function generateRandomUUID() {
  return uuidv4();
}

const createSegmentFn = createServerFn()
  .middleware([authenticatedMiddleware])
  .validator(
    z.object({
      data: z.object({
        title: z.string(),
        content: z.string(),
        videoKey: z.string().optional(),
        slug: z.string(),
        moduleId: z.string(),
        length: z.string().optional(),
      }),
    })
  )
  .handler(async ({ data }) => {
    // Get all segments to determine the next order number
    const segments = await getSegments();
    const maxOrder = segments.reduce(
      (max, segment) => Math.max(max, segment.order),
      -1
    );
    const nextOrder = maxOrder + 1;

    const segment = await addSegmentUseCase({
      title: data.data.title,
      content: data.data.content,
      slug: data.data.slug,
      order: nextOrder,
      moduleId: data.data.moduleId,
      videoKey: data.data.videoKey,
      length: data.data.length,
    });

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

export const Route = createFileRoute("/learn/add")({
  component: RouteComponent,
  beforeLoad: () => assertAuthenticatedFn(),
  loader: async () => {
    const moduleNames = await getUniqueModuleNamesFn();
    return { moduleNames };
  },
});

function RouteComponent() {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { moduleNames } = Route.useLoaderData();

  const onSubmit = async (values: SegmentFormValues) => {
    try {
      setIsSubmitting(true);
      let videoKey = undefined;
      if (values.video) {
        videoKey = generateRandomUUID();
        await uploadFile(videoKey, values.video);
      }

      const segment = await createSegmentFn({
        data: {
          data: {
            title: values.title,
            content: values.content,
            videoKey: videoKey,
            slug: values.title.toLowerCase().replace(/ /g, "-"),
            moduleId: values.moduleId,
            length: values.length || undefined,
          },
        },
      });

      // Navigate to the new segment
      navigate({ to: "/learn/$slug", params: { slug: segment.slug } });
    } catch (error) {
      console.error("Failed to create segment:", error);
      // TODO: Show error toast
    } finally {
      setIsSubmitting(false);
    }
  };

  const router = useRouter();

  return (
    <Container>
      <div className="flex items-center gap-4 mb-8">
        <Button variant="outline" onClick={() => router.history.back()}>
          <ChevronLeft className="h-4 w-4 mr-2" />
          Back to Course
        </Button>
      </div>

      <SegmentForm
        onSubmit={onSubmit}
        defaultValues={{
          title: "",
          content: "",
          video: undefined,
          slug: "",
          moduleId: "",
          length: "",
        }}
        moduleNames={moduleNames}
        isSubmitting={isSubmitting}
        submitButtonText="Create Content"
        submitButtonLoadingText="Creating..."
      />
    </Container>
  );
}
