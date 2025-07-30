import { Button } from "~/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "~/components/ui/sheet";
import { Menu, Plus } from "lucide-react";
import type { Module, Progress, Segment } from "~/db/schema";
import { NavigationItems } from "./navigation-items";
import { UserMenu } from "./user-menu";
import { useState } from "react";
import { useRouter } from "@tanstack/react-router";
interface ModuleWithSegments extends Module {
  segments: Segment[];
}

interface MobileNavigationProps {
  modules: ModuleWithSegments[];
  currentSegmentId: number;
  isAdmin: boolean;
  isPremium: boolean;
  progress: Progress[];
}

export function MobileNavigation({
  modules,
  currentSegmentId,
  isAdmin,
  isPremium,
  progress,
}: MobileNavigationProps) {
  const [open, setOpen] = useState(false);
  const router = useRouter();

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button variant="outline" className="lg:hidden ml-6 mt-4">
          <Menu className="size-6" /> Quick Navigation
          <span className="sr-only">Toggle Menu</span>
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="pl-1 pr-0 flex flex-col">
        <SheetHeader>
          <SheetTitle>Course Content</SheetTitle>
        </SheetHeader>

        {/* Brand Header */}
        <div className="px-4 pb-2">
          <div className="flex items-center gap-2">
            <img
              src="/icon.png"
              alt="Beginner React Challenges"
              className="size-6"
            />
            <span className="font-semibold text-xs">
              The 20 React Challenges Course
            </span>
          </div>
        </div>
        <div className="flex-1 my-4 px-4 overflow-y-auto">
          <NavigationItems
            modules={modules}
            currentSegmentId={currentSegmentId}
            isAdmin={isAdmin}
            isPremium={isPremium}
            progress={progress}
            onItemClick={() => setOpen(false)}
          />
          {isAdmin && (
            <Button
              variant="outline"
              size="sm"
              className="w-full mt-4"
              onClick={() => {
                router.navigate({ to: "/learn/add" });
              }}
            >
              <Plus className="mr-2 h-4 w-4" />
              Add Segment
            </Button>
          )}
        </div>

        {/* User menu at the bottom */}
        <UserMenu className="mt-auto" />
      </SheetContent>
    </Sheet>
  );
}
