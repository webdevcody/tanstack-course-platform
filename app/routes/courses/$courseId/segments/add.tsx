import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { Title } from "~/components/title";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription,
} from "~/components/ui/form";
import { Input } from "~/components/ui/input";
import { Button } from "~/components/ui/button";
import { Textarea } from "~/components/ui/textarea";
import { authenticatedMiddleware } from "~/lib/auth";
import { isCourseAdminUseCase } from "~/use-cases/courses";
import { addSegmentUseCase } from "~/use-cases/segments";
import { assertAuthenticatedFn } from "~/fn/auth";
import { ChevronLeft, Loader2 } from "lucide-react";
import { getSegmentsByCourseId } from "~/data-access/segments";
import { Container } from "../../-components/container";
import { v4 as uuidv4 } from "uuid";
import { getPresignedPostUrlFn } from "~/fn/storage";
import { useState } from "react";
import { uploadFile } from "~/utils/storage";

function generateRandomUUID() {
  return uuidv4();
}

const formSchema = z.object({
  title: z
    .string()
    .min(2, "Title must be at least 2 characters")
    .max(100, "Title must be less than 100 characters"),
  content: z.string().min(10, "Content must be at least 10 characters"),
  video: z.instanceof(File).optional(),
});

const createSegmentFn = createServerFn()
  .middleware([authenticatedMiddleware])
  .validator(
    z.object({
      courseId: z.number(),
      data: z.object({
        title: z.string(),
        content: z.string(),
        videoKey: z.string().optional(),
      }),
    })
  )
  .handler(async ({ data, context }) => {
    const isAdmin = await isCourseAdminUseCase(context.userId, data.courseId);
    if (!isAdmin) throw new Error("Not authorized");

    // Get all segments to determine the next order number
    const segments = await getSegmentsByCourseId(data.courseId);
    const maxOrder = segments.reduce(
      (max, segment) => Math.max(max, segment.order),
      -1
    );
    const nextOrder = maxOrder + 1;

    const segment = await addSegmentUseCase({
      courseId: data.courseId,
      title: data.data.title,
      content: data.data.content,
      order: nextOrder,
      videoKey: data.data.videoKey,
    });

    return segment;
  });

export const Route = createFileRoute("/courses/$courseId/segments/add")({
  component: RouteComponent,
  beforeLoad: () => assertAuthenticatedFn(),
  loader: async ({ params, context }) => {
    return false;
  },
});

function RouteComponent() {
  const params = Route.useParams();
  const navigate = useNavigate();
  const courseId = parseInt(params.courseId);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      content: "",
      video: undefined,
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      setIsSubmitting(true);
      let videoKey = undefined;
      if (values.video) {
        videoKey = generateRandomUUID();
        await uploadFile(videoKey, values.video);
      }

      const segment = await createSegmentFn({
        data: {
          courseId,
          data: {
            title: values.title,
            content: values.content,
            videoKey: videoKey,
          },
        },
      });

      // Navigate to the new segment
      navigate({
        to: "/courses/$courseId/segments/$segmentId",
        params: {
          courseId: courseId.toString(),
          segmentId: segment.id.toString(),
        },
      });
    } catch (error) {
      console.error("Failed to create segment:", error);
      // TODO: Show error toast
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Container>
      <div>
        <Button
          variant="secondary"
          onClick={() =>
            navigate({
              to: "/courses/$courseId",
              params: { courseId: courseId.toString() },
            })
          }
          className="flex items-center gap-2"
        >
          <ChevronLeft className="h-4 w-4" />
          Back to Course
        </Button>
      </div>

      <Title title="Add New Segment" />

      <div className="max-w-2xl">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Title</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter segment title" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="content"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Content</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Enter segment content (supports markdown)"
                      className="min-h-[200px]"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="video"
              render={({ field: { value, onChange, ...field } }) => (
                <FormItem>
                  <FormLabel>Segment Video</FormLabel>
                  <FormControl>
                    <Input
                      type="file"
                      accept="video/*"
                      onChange={(e) =>
                        onChange(e.target.files ? e.target.files[0] : undefined)
                      }
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    Upload a video file for your segment (optional)
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex justify-end">
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Creating...
                  </>
                ) : (
                  "Create Segment"
                )}
              </Button>
            </div>
          </form>
        </Form>
      </div>
    </Container>
  );
}
