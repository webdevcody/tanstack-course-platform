import { createFileRoute } from "@tanstack/react-router";
import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { Button, buttonVariants } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Textarea } from "~/components/ui/textarea";
import { useToast } from "~/hooks/use-toast";
import { useRouter, Link } from "@tanstack/react-router";
import { createTestimonialUseCase } from "~/use-cases/testimonials";
import { authenticatedMiddleware } from "~/lib/auth";
import { useState } from "react";
import { cn } from "~/lib/utils";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Checkbox } from "~/components/ui/checkbox";

const emojis = [
  "😊",
  "👍",
  "🌟",
  "💯",
  "🔥",
  "🚀",
  "💪",
  "🎉",
  "💡",
  "❤️",
  "👏",
  "🙌",
  "🎯",
  "✨",
  "💫",
  "⭐",
  "💖",
  "💝",
  "💗",
  "🙏",
];

const testimonialSchema = z.object({
  displayName: z.string().min(1, "Display name is required"),
  content: z.string().min(10, "Testimonial must be at least 10 characters"),
  emojis: z.string().min(1, "Please select at least one emoji"),
  permissionGranted: z.boolean().refine((val) => val === true, {
    message: "You must agree to share your testimonial publicly",
  }),
});

type TestimonialFormValues = z.infer<typeof testimonialSchema>;

export const Route = createFileRoute("/create-testimonial")({
  component: CreateTestimonial,
});

export const createTestimonialFn = createServerFn()
  .middleware([authenticatedMiddleware])
  .validator(testimonialSchema)
  .handler(async ({ data, context }) => {
    await createTestimonialUseCase({
      ...data,
      userId: context.userId,
    });
  });

function SuccessMessage() {
  return (
    <div className="max-w-2xl mx-auto p-6 text-center space-y-6 mt-12">
      <h1 className="text-3xl font-bold">Thank You for Your Testimonial!</h1>
      <p className="text-gray-500">
        Your feedback helps others understand the value of our platform.
      </p>
      <div className="flex justify-center gap-4">
        <Link
          to="/"
          hash="testimonials"
          className={buttonVariants({ variant: "default" })}
        >
          View Your Testimonial
        </Link>
      </div>
    </div>
  );
}

function CreateTestimonial() {
  const { toast } = useToast();
  const router = useRouter();
  const [selectedEmojis, setSelectedEmojis] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const form = useForm<TestimonialFormValues>({
    resolver: zodResolver(testimonialSchema),
    defaultValues: {
      displayName: "",
      content: "",
      emojis: "",
      permissionGranted: false,
    },
  });

  const toggleEmoji = (emoji: string) => {
    let newEmojis: string[];
    if (selectedEmojis.includes(emoji)) {
      newEmojis = selectedEmojis.filter((e) => e !== emoji);
    } else if (selectedEmojis.length < 3) {
      newEmojis = [...selectedEmojis, emoji];
    } else {
      return; // Don't allow more than 3 emojis
    }
    setSelectedEmojis(newEmojis);
    form.setValue("emojis", newEmojis.join(""), {
      shouldValidate: true,
      shouldDirty: true,
      shouldTouch: true,
    });
  };

  const onSubmit = async (values: TestimonialFormValues) => {
    if (selectedEmojis.length === 0) {
      form.setError("emojis", {
        type: "manual",
        message: "Please select at least one emoji",
      });
      return;
    }

    try {
      setIsSubmitting(true);
      await createTestimonialFn({
        data: {
          displayName: values.displayName,
          content: values.content,
          emojis: selectedEmojis.join(""),
          permissionGranted: values.permissionGranted,
        },
      });
      setIsSubmitted(true);
    } catch (error) {
      console.error("Failed to submit testimonial:", error);
      toast({
        title: "Error",
        description: "Failed to submit testimonial. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSubmitted) {
    return <SuccessMessage />;
  }

  return (
    <div className="max-w-2xl mx-auto p-6 mt-12">
      <h1 className="text-3xl font-bold mb-8">Share Your Experience</h1>

      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="space-y-2">
          <label htmlFor="displayName" className="text-sm font-medium">
            Display Name <span className="text-red-500">*</span>
          </label>
          <Input
            id="displayName"
            {...form.register("displayName")}
            placeholder="How you'd like to be known"
            className={cn(
              form.formState.errors.displayName &&
                "border-red-500 focus-visible:ring-red-500"
            )}
          />
          {form.formState.errors.displayName && (
            <p className="text-sm text-red-500">
              {form.formState.errors.displayName.message}
            </p>
          )}
        </div>

        <div className="space-y-2">
          <label htmlFor="content" className="text-sm font-medium">
            Your Testimonial <span className="text-red-500">*</span>
          </label>
          <Textarea
            id="content"
            {...form.register("content")}
            placeholder="Share your experience with our platform..."
            className={cn(
              "min-h-[150px]",
              form.formState.errors.content &&
                "border-red-500 focus-visible:ring-red-500"
            )}
          />
          {form.formState.errors.content && (
            <p className="text-sm text-red-500">
              {form.formState.errors.content.message}
            </p>
          )}
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">
            Select up to 3 emojis (optional but fun!)
          </label>
          <div className="flex flex-wrap gap-2">
            {emojis.map((emoji) => (
              <button
                key={emoji}
                type="button"
                onClick={() => toggleEmoji(emoji)}
                className={cn(
                  "text-2xl p-2 rounded-lg transition-colors",
                  selectedEmojis.includes(emoji)
                    ? "bg-theme-500/20 text-theme-500"
                    : "hover:bg-gray-100 dark:hover:bg-gray-800"
                )}
              >
                {emoji}
              </button>
            ))}
          </div>
          {selectedEmojis.length > 0 && (
            <p className="text-sm text-gray-500">
              Selected: {selectedEmojis.join(" ")}
            </p>
          )}
          {form.formState.errors.emojis && (
            <p className="text-sm text-red-500">
              {form.formState.errors.emojis.message}
            </p>
          )}
        </div>

        <div className="flex items-start space-x-2">
          <Checkbox
            id="permission"
            checked={form.watch("permissionGranted")}
            onCheckedChange={(checked) => {
              form.setValue("permissionGranted", checked === true, {
                shouldValidate: true,
                shouldDirty: true,
                shouldTouch: true,
              });
            }}
            className={cn(
              form.formState.errors.permissionGranted && "border-red-500"
            )}
          />
          <div className="grid gap-1.5 leading-none">
            <label
              htmlFor="permission"
              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
            >
              Permission to Share <span className="text-red-500">*</span>
            </label>
            <p className="text-sm text-muted-foreground">
              I agree to let my testimonial be shared publicly on this site
            </p>
            {form.formState.errors.permissionGranted && (
              <p className="text-sm text-red-500">
                {form.formState.errors.permissionGranted.message}
              </p>
            )}
          </div>
        </div>

        <Button type="submit" className="w-full" disabled={isSubmitting}>
          {isSubmitting ? "Submitting..." : "Submit Testimonial"}
        </Button>
      </form>
    </div>
  );
}
