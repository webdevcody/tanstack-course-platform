import { z } from "zod";
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
import { Progress } from "~/components/ui/progress";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import { Badge } from "~/components/ui/badge";
import {
  Loader2,
  FileText,
  Link as LinkIcon,
  Video,
  FolderOpen,
  Crown,
  Upload,
  Edit,
} from "lucide-react";
import { AutoComplete } from "~/components/ui/autocomplete";
import { Switch } from "~/components/ui/switch";
import type { UploadProgress } from "~/utils/storage/helpers";
import { useEditSegment } from "./use-edit-segment";
import { useLoaderData } from "@tanstack/react-router";

export const formSchema = z.object({
  title: z
    .string()
    .min(2, "Title must be at least 2 characters")
    .max(100, "Title must be less than 100 characters"),
  content: z.string().optional(),
  video: z.instanceof(File).optional(),
  moduleTitle: z.string().min(1, "Module ID is required"),
  slug: z.string().min(2, "Slug must be at least 2 characters"),
  isPremium: z.boolean().default(false),
});

export type SegmentFormValues = z.infer<typeof formSchema>;

export function SegmentForm() {
  const { segment, moduleNames } = useLoaderData({ from: "/learn/$slug/edit" });
  const { onSubmit, isSubmitting, uploadProgress } = useEditSegment(segment);

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: segment.title,
      content: segment.content ?? "",
      video: undefined,
      slug: segment.slug,
      moduleTitle: segment.moduleTitle,
      isPremium: segment.isPremium,
    },
  });

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Header Section */}
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">Edit Content</h1>
        <p className="text-muted-foreground text-lg">
          Update your course segment with rich content and media
        </p>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          {/* Basic Information Card */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Edit className="h-5 w-5" />
                Basic Information
              </CardTitle>
              <CardDescription>
                Update the fundamental details for your content segment
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="title"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="flex items-center gap-2">
                        <FileText className="h-4 w-4" />
                        Title
                      </FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Enter a compelling title"
                          className="text-base"
                          {...field}
                        />
                      </FormControl>
                      <FormDescription>
                        Give your content a clear and engaging title
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
                      <FormLabel className="flex items-center gap-2">
                        <LinkIcon className="h-4 w-4" />
                        URL Slug
                      </FormLabel>
                      <FormControl>
                        <Input
                          placeholder="url-friendly-slug"
                          className="text-base font-mono"
                          {...field}
                        />
                      </FormControl>
                      <FormDescription>
                        Used to generate the URL for your content
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="moduleTitle"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex items-center gap-2">
                      <FolderOpen className="h-4 w-4" />
                      Module
                    </FormLabel>
                    <FormControl>
                      <AutoComplete
                        selectedValue={field.value}
                        onSelectedValueChange={field.onChange}
                        searchValue={field.value}
                        onSearchValueChange={field.onChange}
                        items={moduleNames.map(name => ({
                          value: name,
                          label: name,
                        }))}
                        isLoading={false}
                        placeholder="Search or enter a module name"
                        emptyMessage="No modules found."
                      />
                    </FormControl>
                    <FormDescription>
                      Select an existing module or create a new one
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
          </Card>

          {/* Content Card */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                Content
              </CardTitle>
              <CardDescription>
                Update your lesson content using Markdown for rich formatting
              </CardDescription>
            </CardHeader>
            <CardContent>
              <FormField
                control={form.control}
                name="content"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Lesson Content (Optional)</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="# Welcome to the lesson&#10;&#10;Write your content here using **Markdown** formatting...&#10;&#10;- Bullet points&#10;- Code blocks&#10;- And more!"
                        className="min-h-[300px] text-base font-mono"
                        {...field}
                      />
                    </FormControl>
                    <FormDescription>
                      Supports Markdown syntax for headers, links, code blocks,
                      and more
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
          </Card>

          {/* Media Card */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Video className="h-5 w-5" />
                Media Content
              </CardTitle>
              <CardDescription>
                Upload a new video to replace the existing one (optional)
              </CardDescription>
            </CardHeader>
            <CardContent>
              <FormField
                control={form.control}
                name="video"
                render={({ field: { value, onChange, ...field } }) => (
                  <FormItem>
                    <FormLabel>Video File (Optional)</FormLabel>
                    <FormControl>
                      <div className="space-y-4">
                        {!value ? (
                          <div className="flex items-center justify-center w-full">
                            <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-muted-foreground/25 rounded-lg cursor-pointer hover:bg-muted/50 transition-colors">
                              <div className="flex flex-col items-center justify-center pt-5 pb-6">
                                <Upload className="w-8 h-8 mb-2 text-muted-foreground" />
                                <p className="mb-2 text-sm text-muted-foreground">
                                  <span className="font-semibold">
                                    Click to upload
                                  </span>{" "}
                                  or drag and drop
                                </p>
                                <p className="text-xs text-muted-foreground">
                                  MP4 files only (replaces existing video)
                                </p>
                              </div>
                              <Input
                                type="file"
                                accept="video/mp4"
                                onChange={e => onChange(e.target.files?.[0])}
                                className="hidden"
                                {...field}
                              />
                            </label>
                          </div>
                        ) : (
                          <Card className="bg-green-50 dark:bg-green-950/20 border-green-200 dark:border-green-800">
                            <CardContent className="pt-6">
                              <div className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-green-100 dark:bg-green-900">
                                    <Video className="h-5 w-5 text-green-600" />
                                  </div>
                                  <div>
                                    <p className="text-sm font-medium">
                                      {value.name}
                                    </p>
                                    <p className="text-xs text-muted-foreground">
                                      {(value.size / 1024 / 1024).toFixed(2)} MB
                                    </p>
                                  </div>
                                </div>
                                <Button
                                  type="button"
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => onChange(undefined)}
                                  className="text-muted-foreground hover:text-destructive"
                                >
                                  Remove
                                </Button>
                              </div>
                            </CardContent>
                          </Card>
                        )}

                        {uploadProgress && (
                          <Card className="bg-blue-50 dark:bg-blue-950/20 border-blue-200 dark:border-blue-800">
                            <CardContent className="pt-6">
                              <div className="space-y-3">
                                <div className="flex justify-between items-center">
                                  <div className="flex items-center gap-2">
                                    <Loader2 className="h-4 w-4 animate-spin text-blue-600" />
                                    <span className="text-sm font-medium">
                                      Uploading video...
                                    </span>
                                  </div>
                                  <Badge variant="secondary">
                                    {uploadProgress.percentage}%
                                  </Badge>
                                </div>
                                <Progress
                                  value={uploadProgress.percentage}
                                  className="w-full h-2"
                                />
                                <div className="flex justify-between text-xs text-muted-foreground">
                                  <span>
                                    {Math.round(
                                      uploadProgress.loaded / 1024 / 1024
                                    )}{" "}
                                    MB uploaded
                                  </span>
                                  <span>
                                    {Math.round(
                                      uploadProgress.total / 1024 / 1024
                                    )}{" "}
                                    MB total
                                  </span>
                                </div>
                              </div>
                            </CardContent>
                          </Card>
                        )}
                      </div>
                    </FormControl>
                    <FormDescription>
                      Upload an MP4 video file to replace the existing video
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
          </Card>

          {/* Settings Card */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Crown className="h-5 w-5" />
                Content Settings
              </CardTitle>
              <CardDescription>
                Configure access permissions and content visibility
              </CardDescription>
            </CardHeader>
            <CardContent>
              <FormField
                control={form.control}
                name="isPremium"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-between rounded-lg border p-6 bg-gradient-to-r from-yellow-50 to-amber-50 dark:from-yellow-950/20 dark:to-amber-950/20 border-yellow-200 dark:border-yellow-800">
                    <div className="space-y-1">
                      <FormLabel className="text-base font-semibold flex items-center gap-2">
                        <Crown className="h-4 w-4 text-yellow-600" />
                        Premium Content
                      </FormLabel>
                      <FormDescription className="text-sm">
                        Mark this segment as premium content. Only users with
                        premium access will be able to view this content.
                      </FormDescription>
                    </div>
                    <FormControl>
                      <Switch
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
            </CardContent>
          </Card>

          {/* Action Section */}
          <div className="flex justify-center pt-4">
            <Button
              type="submit"
              disabled={isSubmitting}
              size="lg"
              className="min-w-[200px] text-base"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                  Updating...
                </>
              ) : (
                <>
                  <Edit className="mr-2 h-5 w-5" />
                  Update Content
                </>
              )}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}
