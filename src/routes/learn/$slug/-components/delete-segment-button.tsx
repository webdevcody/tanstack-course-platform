import { Button, buttonVariants } from "~/components/ui/button";
import { Trash2 } from "lucide-react";
import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { useMemo } from "react";
import { useNavigate } from "@tanstack/react-router";
import { Route } from "../_layout.index";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "~/components/ui/alert-dialog";
import { adminMiddleware } from "~/lib/auth";
import { deleteSegmentUseCase } from "~/use-cases/segments";
import { useToast } from "~/hooks/use-toast";

// TODO: there is a bug when trying to delet a segment
export const deleteSegmentFn = createServerFn()
  .middleware([adminMiddleware])
  .validator(z.object({ segmentId: z.coerce.number() }))
  .handler(async ({ data }) => {
    await deleteSegmentUseCase(data.segmentId);
  });

interface DeleteVideoButtonProps {
  currentSegmentId: number;
}

export function DeleteSegmentButton({
  currentSegmentId,
}: DeleteVideoButtonProps) {
  const { toast } = useToast();
  const navigate = useNavigate();
  const { segments } = Route.useLoaderData();

  // Find the previous segment using the same logic as in video-controls.tsx
  const previousSegment = useMemo(() => {
    // Find the current module and segment index
    const currentModule = segments.find(
      (segment) => segment.id === currentSegmentId
    )?.moduleId;
    if (!currentModule) return null;

    // Get all segments in the current module and sort by order
    const currentModuleSegments = segments
      .filter((s) => s.moduleId === currentModule)
      .sort((a, b) => a.order - b.order);
    const currentIndex = currentModuleSegments.findIndex(
      (s) => s.id === currentSegmentId
    );

    // If there's a previous segment in the current module
    if (currentIndex > 0) {
      return currentModuleSegments[currentIndex - 1];
    }

    // If we're at the start of the current module, find the previous module
    const modules = segments.reduce(
      (acc, segment) => {
        if (!acc[segment.moduleId]) {
          acc[segment.moduleId] = [];
        }
        acc[segment.moduleId].push(segment);
        return acc;
      },
      {} as Record<number, typeof segments>
    );

    // Sort segments within each module by order
    Object.keys(modules).forEach((moduleId) => {
      modules[Number(moduleId)].sort((a, b) => a.order - b.order);
    });

    const moduleIds = Object.keys(modules)
      .map(Number)
      .sort((a, b) => a - b);
    const currentModuleIndex = moduleIds.indexOf(currentModule);

    // If there's a previous module
    if (currentModuleIndex > 0) {
      const prevModuleId = moduleIds[currentModuleIndex - 1];
      const prevModuleSegments = modules[prevModuleId];
      return prevModuleSegments[prevModuleSegments.length - 1]; // Return last segment of previous module
    }

    return null;
  }, [currentSegmentId, segments]);

  const handleDeleteSegment = async () => {
    try {
      await deleteSegmentFn({ data: { segmentId: currentSegmentId } });

      // Navigate to previous segment or /learn if no previous segment
      if (previousSegment) {
        navigate({
          to: "/learn/$slug",
          params: { slug: previousSegment.slug },
        });
      } else {
        navigate({ to: "/learn" });
      }

      toast({
        title: "Content deleted successfully!",
        description: previousSegment
          ? `Redirected to previous content: ${previousSegment.title}`
          : "Redirected to content list.",
      });
    } catch (error) {
      toast({
        title: "Failed to delete content",
        description: "Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button variant="destructive">
          <Trash2 className="h-4 w-4" />
          Delete
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent
        animation="slide-in-top-right"
        className="bg-background border border-border shadow-elevation-3 rounded-xl max-w-md mx-auto"
      >
        <AlertDialogHeader className="space-y-4 p-6">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-gradient-to-br from-red-100 to-red-200 dark:from-red-900 dark:to-red-800">
              <Trash2 className="h-5 w-5 text-red-600 dark:text-red-400" />
            </div>
            <AlertDialogTitle className="text-xl font-semibold text-foreground leading-tight">
              Are you absolutely sure?
            </AlertDialogTitle>
          </div>
          <AlertDialogDescription className="text-muted-foreground text-sm leading-relaxed">
            This action cannot be undone. This will permanently delete this
            content and all its associated files and attachments.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter className="flex gap-3 p-6 pt-0">
          <AlertDialogCancel
            className={buttonVariants({ variant: "gray-outline" })}
          >
            Cancel
          </AlertDialogCancel>
          <AlertDialogAction
            onClick={handleDeleteSegment}
            className={buttonVariants({ variant: "destructive" })}
          >
            Delete
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
