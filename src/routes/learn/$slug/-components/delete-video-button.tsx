import { Button } from "~/components/ui/button";
import { Trash2 } from "lucide-react";
import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
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

export function DeleteVideoButton({
  currentSegmentId,
}: DeleteVideoButtonProps) {
  const { toast } = useToast();

  const handleDeleteSegment = async () => {
    try {
      await deleteSegmentFn({ data: { segmentId: currentSegmentId } });
      toast({
        title: "Content deleted successfully!",
        description: "You will be redirected to the content list.",
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
        <Button
          variant="outline"
          className="btn-red-border-gradient px-4 py-2 flex items-center gap-2 text-sm font-medium rounded-md !bg-transparent !border-red-500"
        >
          <Trash2 className="h-4 w-4" />
          Delete
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent className="bg-background border border-border shadow-elevation-3 rounded-xl max-w-md mx-auto">
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
          <AlertDialogCancel className="px-4 py-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-all duration-200 border border-border rounded-md hover:bg-muted">
            Cancel
          </AlertDialogCancel>
          <AlertDialogAction
            onClick={handleDeleteSegment}
            className="btn-gradient-red px-4 py-2 text-sm font-medium rounded-md"
          >
            Delete
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
