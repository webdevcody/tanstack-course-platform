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
import { useState } from "react";
import {
  SegmentForm,
  type SegmentFormValues,
} from "../-components/segment-form";
import { uploadVideoChunk } from "~/utils/storage";
import { getModuleById } from "~/data-access/modules";
import { getModulesUseCase } from "~/use-cases/modules";
import { generateRandomUUID } from "~/utils/uuid";

const updateSegmentFn = createServerFn()
  .middleware([adminMiddleware])
  .validator(
    z.object({
      segmentId: z.number(),
      updates: z.object({
        title: z.string(),
        content: z.string().optional(),
        videoKey: z.string().optional(),
        moduleTitle: z.string(),
        slug: z.string(),
        length: z.string().optional(),
        isPremium: z.boolean(),
      }),
    })
  )
  .handler(async ({ data }) => {
    const { segmentId, updates } = data;
    return updateSegmentUseCase(segmentId, updates);
  });

const getSegmentFn = createServerFn()
  .middleware([authenticatedMiddleware])
  .validator(z.object({ slug: z.string() }))
  .handler(async ({ data }) => {
    const segment = await getSegmentBySlugUseCase(data.slug);
    if (!segment) throw new Error("Segment not found");

    const module = await getModuleById(segment.moduleId);
    if (!module) throw new Error("Module not found");

    return { segment: { ...segment, moduleTitle: module.title } };
  });

const getUniqueModuleNamesFn = createServerFn()
  .middleware([authenticatedMiddleware])
  .handler(async () => {
    const modules = await getModulesUseCase();
    return modules.map((module) => module.title);
  });

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
        videoKey = `${generateRandomUUID()}.mp4`;
        await uploadVideoChunk(videoKey, values.video);
      }

      await updateSegmentFn({
        data: {
          segmentId: segment.id,
          updates: {
            title: values.title,
            content: values.content,
            videoKey: videoKey,
            moduleTitle: values.moduleTitle,
            slug: values.slug,
            length: values.length || undefined,
            isPremium: values.isPremium,
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
            content: segment.content || "",
            video: undefined,
            moduleTitle: segment.moduleTitle,
            slug: segment.slug,
            length: segment.length || "",
            isPremium: segment.isPremium,
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
