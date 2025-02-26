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
import { createCourseUseCase } from "~/use-cases/courses";
import { assertAuthenticatedFn } from "~/fn/auth";
import { Loader2 } from "lucide-react";
import { Container } from "~/routes/courses/-components/container";
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
  description: z.string().min(10, "Description must be at least 10 characters"),
  category: z.string().min(2, "Category must be at least 2 characters"),
  video: z.instanceof(File).optional(),
});

const createCourseFn = createServerFn()
  .middleware([authenticatedMiddleware])
  .validator(
    z.object({
      title: z.string(),
      description: z.string(),
      category: z.string(),
      videoKey: z.string().optional(),
    })
  )
  .handler(async ({ data, context }) => {
    return await createCourseUseCase(context.userId, data);
  });

export const Route = createFileRoute("/courses/add")({
  component: RouteComponent,
  beforeLoad: () => assertAuthenticatedFn(),
});

function RouteComponent() {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      description: "",
      category: "",
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

      const course = await createCourseFn({
        data: {
          title: values.title,
          description: values.description,
          category: values.category,
          videoKey: videoKey,
        },
      });

      // Navigate to the new course
      navigate({
        to: "/courses/$courseId",
        params: {
          courseId: course.id.toString(),
        },
      });
    } catch (error) {
      console.error("Failed to create course:", error);
      // TODO: Show error toast
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Container>
      <Title title="Create a Course" />

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
                    Creating...
                  </>
                ) : (
                  "Create Course"
                )}
              </Button>
            </div>
          </form>
        </Form>
      </div>
    </Container>
  );
}
