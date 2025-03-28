import {
  createFileRoute,
  useNavigate,
  useRouter,
} from "@tanstack/react-router";
import { createServerFn } from "@tanstack/start";
import { z } from "zod";
import { Button } from "~/components/ui/button";
import { adminMiddleware, authenticatedMiddleware } from "~/lib/auth";
import { addSegmentUseCase } from "~/use-cases/segments";
import { assertAuthenticatedFn } from "~/fn/auth";
import { ChevronLeft } from "lucide-react";
import { getSegments } from "~/data-access/segments";
import { useState } from "react";
import { Container } from "./-components/container";
import {
  SegmentForm,
  type SegmentFormValues,
} from "./-components/segment-form";
import { uploadVideoFn } from "~/fn/storage";
import { getModulesUseCase } from "~/use-cases/modules";

const createSegmentFn = createServerFn()
  .middleware([adminMiddleware])
  .validator(
    z.object({
      title: z.string(),
      content: z.string(),
      videoKey: z.string().optional(),
      slug: z.string(),
      moduleTitle: z.string(),
      length: z.string().optional(),
      isPremium: z.boolean(),
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
      title: data.title,
      content: data.content,
      slug: data.slug,
      order: nextOrder,
      moduleTitle: data.moduleTitle,
      videoKey: data.videoKey,
      length: data.length,
      isPremium: data.isPremium,
    });

    return segment;
  });

const getUniqueModuleNamesFn = createServerFn()
  .middleware([authenticatedMiddleware])
  .handler(async () => {
    const modules = await getModulesUseCase();
    return modules.map((module) => module.title);
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
      let videoKey;

      if (values.video) {
        const formData = new FormData();
        formData.set("file", values.video);
        const { videoKey: uploadedKey } = await uploadVideoFn({
          data: formData,
        });
        videoKey = uploadedKey;
      }

      const segment = await createSegmentFn({
        data: {
          title: values.title,
          content: values.content,
          slug: values.title.toLowerCase().replace(/ /g, "-"),
          moduleTitle: values.moduleTitle,
          length: values.length || undefined,
          videoKey,
          isPremium: values.isPremium,
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
          moduleTitle: "",
          length: "",
          isPremium: false,
        }}
        moduleNames={moduleNames}
        isSubmitting={isSubmitting}
        submitButtonText="Create Content"
        submitButtonLoadingText="Creating..."
      />
    </Container>
  );
}
