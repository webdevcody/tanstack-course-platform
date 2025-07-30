import { Button } from "~/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "~/components/ui/sheet";
import { Menu } from "lucide-react";
import { Skeleton } from "~/components/ui/skeleton";

export function MobileNavigationSkeleton() {
  return (
    <div className="lg:hidden sticky top-0 z-40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b">
      <div className="flex h-14 items-center justify-between px-4">
        <div className="flex items-center gap-3">
          <Skeleton className="h-4 w-24" />
        </div>
        <Sheet>
          <SheetTrigger asChild>
            <Button
              variant="ghost"
              className="px-2 text-base hover:bg-transparent focus-visible:bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0 lg:hidden"
            >
              <Menu className="h-5 w-5" />
              <span className="sr-only">Toggle menu</span>
            </Button>
          </SheetTrigger>
          <SheetContent side="right" className="pr-0">
            <div className="space-y-4 py-4">
              {/* Skeleton for mobile navigation content */}
              {Array.from({ length: 3 }).map((_, index) => (
                <div key={index} className="space-y-2">
                  <div className="p-3 rounded-lg border">
                    <div className="flex items-center gap-3">
                      <Skeleton className="h-4 w-4" />
                      <div className="space-y-1 flex-1">
                        <Skeleton className="h-4 w-32" />
                        <Skeleton className="h-3 w-20" />
                      </div>
                      <Skeleton className="h-6 w-6 rounded-full" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </div>
  );
}
