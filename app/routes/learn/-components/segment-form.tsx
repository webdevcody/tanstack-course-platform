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
import { Loader2 } from "lucide-react";
import { AutoComplete } from "~/components/ui/autocomplete";
import { Switch } from "~/components/ui/switch";

export const formSchema = z.object({
  title: z
    .string()
    .min(2, "Title must be at least 2 characters")
    .max(100, "Title must be less than 100 characters"),
  content: z.string().optional(),
  video: z.instanceof(File).optional(),
  moduleTitle: z.string().min(1, "Module ID is required"),
  slug: z.string().min(2, "Slug must be at least 2 characters"),
  length: z.string().optional(),
  isPremium: z.boolean().default(false),
});

export type SegmentFormValues = z.infer<typeof formSchema>;

interface SegmentFormProps {
  onSubmit: (values: SegmentFormValues) => Promise<void>;
  defaultValues: SegmentFormValues;
  moduleNames: string[];
  isSubmitting: boolean;
  submitButtonText: string;
  submitButtonLoadingText: string;
}

export function SegmentForm({
  onSubmit,
  defaultValues,
  moduleNames,
  isSubmitting,
  submitButtonText,
  submitButtonLoadingText,
}: SegmentFormProps) {
  const form = useForm({ resolver: zodResolver(formSchema), defaultValues });

  return (
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
              <FormLabel>Content (Optional)</FormLabel>
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
                  accept="video/mp4"
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
          name="moduleTitle"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Module Name</FormLabel>
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
                Select an existing module or enter a new one.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="length"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Length (Optional)</FormLabel>
              <FormControl>
                <Input placeholder="2:54" {...field} />
              </FormControl>
              <FormDescription>
                Estimated length of the segment (e.g. "5 minutes", "2 hours")
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="isPremium"
          render={({ field }) => (
            <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
              <div className="space-y-0.5">
                <FormLabel className="text-base">Premium Content</FormLabel>
                <FormDescription>
                  Mark this segment as premium content. Premium content will
                  only be accessible to premium users.
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

        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              {submitButtonLoadingText}
            </>
          ) : (
            submitButtonText
          )}
        </Button>
      </form>
    </Form>
  );
}
