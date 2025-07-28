import { useRouter } from "@tanstack/react-router";
import { Button } from "~/components/ui/button";
import { ChevronLeft, Plus } from "lucide-react";

export function AddSegmentHeader() {
  const router = useRouter();

  return (
    <div className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-10">
      <div className="container flex h-16 items-center justify-between">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => router.history.back()}
            className="gap-2"
          >
            <ChevronLeft className="h-4 w-4" />
            Back to Course
          </Button>

          <div className="h-6 w-px bg-border" />

          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10">
              <Plus className="h-4 w-4 text-primary" />
            </div>
            <div>
              <h2 className="text-sm font-semibold">New Content</h2>
              <p className="text-xs text-muted-foreground">
                Create a learning segment
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
