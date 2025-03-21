import {
  createFileRoute,
  useCanGoBack,
  useNavigate,
  useRouter,
} from "@tanstack/react-router";
import { createServerFn } from "@tanstack/start";
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
import { addSegmentUseCase } from "~/use-cases/segments";
import { assertAuthenticatedFn } from "~/fn/auth";
import { ChevronLeft, Loader2 } from "lucide-react";
import { getSegments } from "~/data-access/segments";
import { v4 as uuidv4 } from "uuid";
import { useState } from "react";
import { uploadFile } from "~/utils/storage";
import { Container } from "./-components/container";

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
  slug: z.string().min(2, "Slug must be at least 2 characters"),
  moduleId: z.string().min(1, "Module ID is required"),
});

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
    });

    return segment;
  });

export const Route = createFileRoute("/learn/add")({
  component: RouteComponent,
  beforeLoad: () => assertAuthenticatedFn(),
  loader: async () => {
    return false;
  },
});

function RouteComponent() {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      content: "",
      video: undefined,
      slug: "",
      moduleId: "default",
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
          data: {
            title: values.title,
            content: values.content,
            videoKey: videoKey,
            slug: values.title.toLowerCase().replace(/ /g, "-"),
            moduleId: values.moduleId,
          },
        },
      });

      // Navigate to the new segment
      navigate({
        to: "/learn/$segmentId",
        params: { segmentId: segment.id.toString() },
      });
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
        <Button variant="ghost" onClick={() => router.history.back()}>
          <ChevronLeft className="h-4 w-4 mr-2" />
          Back to Course
        </Button>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <FormField
            control={form.control}
            name="title"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Title</FormLabel>
                <FormControl>
                  <Input placeholder="Enter a title" {...field} />
                </FormControl>
                <FormDescription>
                  Give your content a clear and concise title.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="slug"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Slug</FormLabel>
                <FormControl>
                  <Input placeholder="Enter a slug" {...field} />
                </FormControl>
                <FormDescription>
                  The slug is used to generate the URL for your content.
                </FormDescription>
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
                    placeholder="Enter your content"
                    className="min-h-[200px]"
                    {...field}
                  />
                </FormControl>
                <FormDescription>
                  Write your content using Markdown for rich formatting.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="video"
            render={({ field: { value, onChange, ...field } }) => (
              <FormItem>
                <FormLabel>Video (Optional)</FormLabel>
                <FormControl>
                  <Input
                    type="file"
                    accept="video/*"
                    onChange={(e) => onChange(e.target.files?.[0])}
                    {...field}
                  />
                </FormControl>
                <FormDescription>
                  Upload a video to accompany your content.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="moduleId"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Module Name</FormLabel>
                <FormControl>
                  <Input placeholder="Enter module name" {...field} />
                </FormControl>
                <FormDescription>
                  Specify which module this content belongs to.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Creating...
              </>
            ) : (
              "Create Content"
            )}
          </Button>
        </form>
      </Form>
    </Container>
  );
}
