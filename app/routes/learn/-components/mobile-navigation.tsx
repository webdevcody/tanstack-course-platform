import { Sheet, SheetContent } from "~/components/ui/sheet";
import { Button } from "~/components/ui/button";
import { X, Plus } from "lucide-react";
import { Segment, Progress } from "~/db/schema";
import { NavigationItems } from "./navigation-items";

interface MobileNavigationProps {
  segments: Segment[];
  progress: Progress[];
  currentSegmentId: Segment["id"];
  isOpen: boolean;
  onClose: () => void;
  isAdmin: boolean;
  isPremium: boolean;
}

export function MobileNavigation({
  segments,
  progress,
  currentSegmentId,
  isOpen,
  onClose,
  isAdmin,
  isPremium,
}: MobileNavigationProps) {
  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent
        side="left"
        className="w-full max-w-[85vw] p-0 flex flex-col gap-0"
      >
        <div className="sticky top-0 right-0 flex items-center justify-between p-6 bg-background border-b z-10">
          <div className="flex items-center gap-4">
            <h2 className="text-lg font-semibold">Content Navigation</h2>
          </div>
          <Button
            variant="ghost"
            size="icon"
            className="hover:bg-accent/50"
            onClick={onClose}
          >
            <X className="h-6 w-6" />
            <span className="sr-only">Close navigation</span>
          </Button>
        </div>
        <div className="divide-y divide-border overflow-y-auto flex-1">
          <NavigationItems
            segments={segments}
            progress={progress}
            currentSegmentId={currentSegmentId}
            isAdmin={isAdmin}
            isPremium={isPremium}
            onItemClick={onClose}
          />
        </div>

        {isAdmin && (
          <Button variant="secondary" className="py-8" asChild>
            <a href="/learn/add">
              <Plus className="h-4 w-4" /> Add Segment
              <span className="sr-only">Create new segment</span>
            </a>
          </Button>
        )}
      </SheetContent>
    </Sheet>
  );
}
