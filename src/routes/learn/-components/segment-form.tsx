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
  LucideIcon,
} from "lucide-react";
import { AutoComplete } from "~/components/ui/autocomplete";
import { Switch } from "~/components/ui/switch";
import type { UploadProgress } from "~/utils/storage/helpers";

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

interface SegmentFormProps {
  // Content customization
  headerTitle: string;
  headerDescription: string;
  buttonText: string;
  loadingText: string;
  buttonIcon?: LucideIcon;

  // Data
  moduleNames: string[];
  defaultValues?: Partial<SegmentFormValues>;

  // Functionality
  onSubmit: (values: SegmentFormValues) => Promise<void>;
  isSubmitting: boolean;
  uploadProgress?: UploadProgress | null;
}

export function SegmentForm({
  headerTitle,
  headerDescription,
  buttonText,
  loadingText,
  buttonIcon: ButtonIcon = Edit,
  moduleNames,
  defaultValues,
  onSubmit,
  isSubmitting,
  uploadProgress,
}: SegmentFormProps) {
  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: defaultValues?.title || "",
      content: defaultValues?.content || "",
      video: undefined,
      slug: defaultValues?.slug || "",
      moduleTitle: defaultValues?.moduleTitle || "",
      isPremium: defaultValues?.isPremium || false,
    },
  });

  return (
    <div className="max-w-5xl mx-auto space-y-12">
      {/* Header Section */}
      <div className="text-center space-y-4 animate-fade-in">
        <div className="relative inline-block">
          <h1 className="text-4xl font-bold tracking-tight text-gradient mb-2">
            {headerTitle}
          </h1>
          <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 w-24 h-1 bg-gradient-to-r from-theme-400 to-theme-600 rounded-full animate-scale-in" />
        </div>
        <p className="text-muted-foreground text-xl max-w-2xl mx-auto leading-relaxed">
          {headerDescription}
        </p>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          {/* Basic Information Card */}
          <Card className="module-card animate-slide-up border-theme-200/40 dark:border-theme-800/40">
            <CardHeader className="relative">
              <div className="absolute top-4 right-4 h-2 w-2 rounded-full bg-theme-400 animate-pulse" />
              <CardTitle className="flex items-center gap-3 text-xl">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-theme-500 to-theme-600 shadow-glow-sm">
                  <Edit className="h-5 w-5 text-white" />
                </div>
                Basic Information
              </CardTitle>
              <CardDescription className="text-base">
                Set the fundamental details for your content segment
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
                          autoFocus
                          placeholder="Enter a compelling title"
                          className="text-base border-theme-200/40 dark:border-theme-800/40 focus:border-theme-500 dark:focus:border-theme-400 transition-colors duration-200 bg-gradient-to-r from-transparent to-theme-50/20 dark:to-theme-950/20"
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
                          className="text-base font-mono border-theme-200/40 dark:border-theme-800/40 focus:border-theme-500 dark:focus:border-theme-400 transition-colors duration-200 bg-gradient-to-r from-transparent to-theme-50/20 dark:to-theme-950/20"
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
                        items={moduleNames.map((name) => ({
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
          <Card
            className="module-card animate-slide-up border-theme-200/40 dark:border-theme-800/40"
            style={{ animationDelay: "0.1s" }}
          >
            <CardHeader className="relative">
              <div className="absolute top-4 right-4 h-2 w-2 rounded-full bg-blue-400 animate-pulse" />
              <CardTitle className="flex items-center gap-3 text-xl">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 shadow-lg">
                  <FileText className="h-5 w-5 text-white" />
                </div>
                Content
              </CardTitle>
              <CardDescription className="text-base">
                Write your lesson content using Markdown for rich formatting
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
                        className="min-h-[300px] text-base font-mono border-theme-200/40 dark:border-theme-800/40 focus:border-theme-500 dark:focus:border-theme-400 transition-colors duration-200 bg-gradient-to-br from-transparent via-theme-50/10 to-theme-100/20 dark:via-theme-950/10 dark:to-theme-900/20 resize-none"
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
          <Card
            className="module-card animate-slide-up border-theme-200/40 dark:border-theme-800/40"
            style={{ animationDelay: "0.2s" }}
          >
            <CardHeader className="relative">
              <div className="absolute top-4 right-4 h-2 w-2 rounded-full bg-purple-400 animate-pulse" />
              <CardTitle className="flex items-center gap-3 text-xl">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-purple-500 to-purple-600 shadow-lg">
                  <Video className="h-5 w-5 text-white" />
                </div>
                Media Content
              </CardTitle>
              <CardDescription className="text-base">
                Upload a video to enhance your lesson experience
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
                            <label className="group flex flex-col items-center justify-center w-full h-40 border-2 border-dashed border-theme-300/40 dark:border-theme-700/40 rounded-xl cursor-pointer bg-gradient-to-br from-theme-50/30 to-transparent dark:from-theme-950/20 hover:from-theme-100/50 dark:hover:from-theme-900/30 transition-all duration-300 hover:border-theme-400/60 dark:hover:border-theme-600/60 hover:shadow-elevation-2">
                              <div className="flex flex-col items-center justify-center pt-6 pb-6">
                                <div className="relative mb-4">
                                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-theme-500/20 to-theme-600/20 group-hover:from-theme-500/30 group-hover:to-theme-600/30 transition-all duration-300">
                                    <Upload className="w-6 h-6 text-theme-600 dark:text-theme-400 group-hover:scale-110 transition-transform duration-300" />
                                  </div>
                                </div>
                                <p className="mb-2 text-base text-foreground">
                                  <span className="font-semibold text-theme-600 dark:text-theme-400">
                                    Click to upload
                                  </span>{" "}
                                  or drag and drop
                                </p>
                                <p className="text-sm text-muted-foreground">
                                  MP4 files only (Max 500MB)
                                </p>
                              </div>
                              <Input
                                type="file"
                                accept="video/mp4"
                                onChange={(e) => onChange(e.target.files?.[0])}
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
                      Upload an MP4 video file to accompany your lesson content
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
          </Card>

          {/* Settings Card */}
          <Card
            className="module-card animate-slide-up border-amber-200/40 dark:border-amber-800/40"
            style={{ animationDelay: "0.3s" }}
          >
            <CardHeader className="relative">
              <div className="absolute top-4 right-4 h-2 w-2 rounded-full bg-amber-400 animate-pulse" />
              <CardTitle className="flex items-center gap-3 text-xl">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-amber-500 to-amber-600 shadow-lg">
                  <Crown className="h-5 w-5 text-white" />
                </div>
                Content Settings
              </CardTitle>
              <CardDescription className="text-base">
                Configure access permissions and content visibility
              </CardDescription>
            </CardHeader>
            <CardContent>
              <FormField
                control={form.control}
                name="isPremium"
                render={({ field }) => (
                  <FormItem className="relative overflow-hidden flex flex-row items-center justify-between rounded-xl border p-8 bg-gradient-to-br from-amber-50 via-yellow-50/80 to-orange-50/60 dark:from-amber-950/30 dark:via-yellow-950/20 dark:to-orange-950/10 border-amber-200/60 dark:border-amber-800/40 shadow-elevation-1 hover:shadow-elevation-2 transition-all duration-300">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-amber-400/10 to-transparent rounded-full blur-xl" />
                    <div className="relative space-y-2">
                      <FormLabel className="text-lg font-bold flex items-center gap-3">
                        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-amber-500 to-amber-600 shadow-lg">
                          <Crown className="h-4 w-4 text-white" />
                        </div>
                        <span className="bg-gradient-to-r from-amber-600 to-amber-500 bg-clip-text text-transparent">
                          Premium Content
                        </span>
                      </FormLabel>
                      <FormDescription className="text-base text-amber-700 dark:text-amber-300 leading-relaxed mr-8">
                        Mark this segment as premium content.
                        <br />
                        Only users with premium access will be able to view this
                        content.
                      </FormDescription>
                    </div>
                    <FormControl>
                      <div className="relative">
                        <Switch
                          checked={field.value}
                          onCheckedChange={field.onChange}
                          className="data-[state=checked]:bg-gradient-to-r data-[state=checked]:from-amber-500 data-[state=checked]:to-amber-600 scale-125"
                        />
                      </div>
                    </FormControl>
                  </FormItem>
                )}
              />
            </CardContent>
          </Card>

          {/* Action Section */}
          <div
            className="flex justify-center pt-8 animate-slide-up"
            style={{ animationDelay: "0.4s" }}
          >
            <div className="relative group">
              <div className="absolute -inset-1 bg-gradient-to-r from-theme-400 via-theme-500 to-theme-600 rounded-lg blur opacity-30 group-hover:opacity-60 transition duration-300" />
              <Button
                type="submit"
                disabled={isSubmitting}
                size="lg"
                className="relative min-w-[240px] text-base btn-gradient py-4 px-8 font-semibold shadow-elevation-3 transform hover:scale-105 transition-all duration-300"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-3 h-5 w-5 animate-spin" />
                    {loadingText}
                  </>
                ) : (
                  <>
                    <ButtonIcon className="mr-3 h-5 w-5" />
                    {buttonText}
                  </>
                )}
              </Button>
            </div>
          </div>
        </form>
      </Form>
    </div>
  );
}
