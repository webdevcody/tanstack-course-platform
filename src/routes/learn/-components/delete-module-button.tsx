import { Button, buttonVariants } from "~/components/ui/button";
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
import { deleteModuleUseCase } from "~/use-cases/modules";
import { useToast } from "~/hooks/use-toast";
import { useRouter } from "@tanstack/react-router";

export const deleteModuleFn = createServerFn()
  .middleware([adminMiddleware])
  .validator(z.object({ moduleId: z.coerce.number() }))
  .handler(async ({ data }) => {
    await deleteModuleUseCase(data.moduleId);
  });

interface DeleteModuleButtonProps {
  moduleId: number;
  moduleTitle: string;
}

export function DeleteModuleButton({
  moduleId,
  moduleTitle,
}: DeleteModuleButtonProps) {
  const { toast } = useToast();
  const router = useRouter();

  const handleDeleteModule = async () => {
    try {
      await deleteModuleFn({ data: { moduleId } });

      toast({
        title: "Module deleted successfully!",
        description: `"${moduleTitle}" has been permanently deleted.`,
      });

      // Refresh the page to update the module list
      router.invalidate();
    } catch (error) {
      toast({
        title: "Failed to delete module",
        description: "Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          className="h-8 w-8 p-0 text-muted-foreground hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent
        animation="slide-left"
        className="bg-background border border-border shadow-elevation-3 rounded-xl max-w-md mx-auto"
      >
        <AlertDialogHeader className="space-y-4 p-6">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-gradient-to-br from-red-100 to-red-200 dark:from-red-900 dark:to-red-800">
              <Trash2 className="h-5 w-5 text-red-600 dark:text-red-400" />
            </div>
            <AlertDialogTitle className="text-xl font-semibold text-foreground leading-tight">
              Delete Module
            </AlertDialogTitle>
          </div>
          <AlertDialogDescription className="text-muted-foreground text-sm leading-relaxed">
            Are you sure you want to delete the module{" "}
            <strong>"{moduleTitle}"</strong>? This action cannot be undone and
            will permanently delete the module and all its associated segments.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter className="flex gap-3 p-6 pt-0">
          <AlertDialogCancel
            className={buttonVariants({ variant: "gray-outline" })}
          >
            Cancel
          </AlertDialogCancel>
          <AlertDialogAction
            onClick={handleDeleteModule}
            className={buttonVariants({ variant: "destructive" })}
          >
            Delete Module
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
