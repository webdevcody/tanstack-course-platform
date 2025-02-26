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
import {
  getCourseUseCase,
  isCourseAdminUseCase,
  updateCourseUseCase,
} from "~/use-cases/courses";
import { assertAuthenticatedFn } from "~/fn/auth";
import { ChevronLeft, Loader2 } from "lucide-react";
import { Container } from "~/routes/courses/-components/container";
import { useEffect, useState } from "react";
import { uploadFile } from "~/utils/storage";
import { generateRandomUUID } from "~/utils/uuid";

const formSchema = z.object({
  title: z
    .string()
    .min(2, "Title must be at least 2 characters")
    .max(100, "Title must be less than 100 characters"),
  description: z.string().min(10, "Description must be at least 10 characters"),
  category: z.string().min(2, "Category must be at least 2 characters"),
  video: z.instanceof(File).optional(),
});

const updateCourseFn = createServerFn()
  .middleware([authenticatedMiddleware])
  .validator(
    z.object({
      courseId: z.number(),
      data: z.object({
        title: z.string().min(2).max(100),
        description: z.string().min(10),
        category: z.string().min(2),
        videoKey: z.string().optional(),
      }),
    })
  )
  .handler(async ({ data, context }) => {
    const course = await getCourseUseCase(data.courseId);
    if (!course) throw new Error("Course not found");

    const isAdmin = await isCourseAdminUseCase(context.userId, course.id);
    if (!isAdmin) throw new Error("Not authorized");

    return await updateCourseUseCase(data.courseId, context.userId, {
      category: data.data.category,
      description: data.data.description,
      title: data.data.title,
      videoKey: data.data.videoKey,
    });
  });

const loaderFn = createServerFn()
  .middleware([authenticatedMiddleware])
  .validator(z.object({ courseId: z.number() }))
  .handler(async ({ data, context }) => {
    const course = await getCourseUseCase(data.courseId);
    if (!course) throw new Error("Course not found");

    const isAdmin = await isCourseAdminUseCase(context.userId, course.id);
    if (!isAdmin) throw new Error("Not authorized");

    return course;
  });

export const Route = createFileRoute("/courses/$courseId/edit")({
  component: RouteComponent,
  beforeLoad: () => assertAuthenticatedFn(),
  loader: async ({ params }) => {
    const course = await loaderFn({
      data: {
        courseId: parseInt(params.courseId),
      },
    });

    return course;
  },
});

function RouteComponent() {
  const params = Route.useParams();
  const navigate = useNavigate();
  const courseId = parseInt(params.courseId);
  const course = Route.useLoaderData();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: course.title,
      description: course.description,
      category: course.category,
      video: undefined,
    },
  });

  useEffect(() => {
    form.reset({
      title: course.title,
      description: course.description,
      category: course.category,
      video: undefined,
    });
  }, [course]);

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      setIsSubmitting(true);
      let videoKey = undefined;
      if (values.video) {
        videoKey = generateRandomUUID();
        await uploadFile(videoKey, values.video);
      }

      await updateCourseFn({
        data: {
          courseId,
          data: {
            title: values.title,
            description: values.description,
            category: values.category,
            videoKey: videoKey,
          },
        },
      });

      // Navigate back to the course
      navigate({
        to: "/courses/$courseId",
        params: {
          courseId: courseId.toString(),
        },
      });
    } catch (error) {
      console.error("Failed to update course:", error);
      // TODO: Show error toast
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Container>
      <div className="mb-6">
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

      <Title title="Edit Course" />

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
                    <Input placeholder="Enter course title" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Enter course description"
                      className="min-h-[100px]"
                      rows={10}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="category"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Category</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter course category" {...field} />
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
                  <FormLabel>Course Video</FormLabel>
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
                    Upload a video file for your course (optional)
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
                    Updating...
                  </>
                ) : (
                  "Update Course"
                )}
              </Button>
            </div>
          </form>
        </Form>
      </div>
    </Container>
  );
}
