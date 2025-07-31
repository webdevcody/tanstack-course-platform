import { Button } from "~/components/ui/button";
import { Plus } from "lucide-react";
import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "~/components/ui/dialog";
import { Input } from "~/components/ui/input";
import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { adminMiddleware } from "~/lib/auth";
import { getOrCreateModuleUseCase } from "~/use-cases/modules";
import { useRouter } from "@tanstack/react-router";
import { useQueryClient } from "@tanstack/react-query";

const createModuleFn = createServerFn()
  .middleware([adminMiddleware])
  .validator(
    z.object({
      title: z
        .string()
        .min(1, "Module title is required")
        .max(100, "Module title must be less than 100 characters"),
    })
  )
  .handler(async ({ data }) => {
    const module = await getOrCreateModuleUseCase(data.title);
    return module;
  });

export function NewModuleButton() {
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const queryClient = useQueryClient();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!title.trim()) return;

    setIsLoading(true);
    try {
      await createModuleFn({ data: { title: title.trim() } });
      queryClient.invalidateQueries({ queryKey: ["modules"] });
      setTitle("");
      setOpen(false);
      // Refresh the page to show the new module
      router.invalidate();
    } catch (error) {
      console.error("Failed to create module:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <Button
        className="mt-4 module-card px-4 py-2 flex items-center gap-2 text-sm font-medium text-theme-700 dark:text-theme-300 hover:text-theme-800 dark:hover:text-theme-200 transition-all duration-200 hover:shadow-elevation-3"
        onClick={() => setOpen(true)}
      >
        <Plus className="mr-2 h-4 w-4" />
        New Module
      </Button>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent animation="slide-in-bottom-left" className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Create New Module</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label
                htmlFor="module-title"
                className="block text-sm font-medium mb-2"
              >
                Module Title
              </label>
              <Input
                id="module-title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Enter module title..."
                disabled={isLoading}
                autoFocus
              />
            </div>
            <DialogFooter className="flex gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => setOpen(false)}
                disabled={isLoading}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={!title.trim() || isLoading}>
                {isLoading ? "Creating..." : "Create Module"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
}
