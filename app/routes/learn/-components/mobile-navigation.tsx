import { Button } from "~/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "~/components/ui/sheet";
import { Menu, Plus } from "lucide-react";
import type { Module, Segment } from "~/db/schema";
import { NavigationItems } from "./navigation-items";
import { useState } from "react";

interface ModuleWithSegments extends Module {
  segments: Segment[];
}

interface MobileNavigationProps {
  modules: ModuleWithSegments[];
  currentSegmentId: number;
  isAdmin: boolean;
  isPremium: boolean;
}

export function MobileNavigation({
  modules,
  currentSegmentId,
  isAdmin,
  isPremium,
}: MobileNavigationProps) {
  const [open, setOpen] = useState(false);

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button
          variant="ghost"
          className="px-0 text-base hover:bg-transparent focus-visible:bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0 lg:hidden"
        >
          <Menu className="h-6 w-6" />
          <span className="sr-only">Toggle Menu</span>
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="pl-1 pr-0">
        <SheetHeader>
          <SheetTitle>Course Content</SheetTitle>
        </SheetHeader>
        <div className="my-4 px-4">
          <NavigationItems
            modules={modules}
            currentSegmentId={currentSegmentId}
            isAdmin={isAdmin}
            isPremium={isPremium}
            onItemClick={() => setOpen(false)}
          />
          {isAdmin && (
            <Button
              variant="outline"
              size="sm"
              className="w-full mt-4"
              onClick={() => {
                // TODO: Implement add module functionality
              }}
            >
              <Plus className="mr-2 h-4 w-4" />
              Add Module
            </Button>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
}
