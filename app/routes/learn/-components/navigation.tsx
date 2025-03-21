import { Button } from "~/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";
import type { Segment } from "~/db/schema";

interface NavigationProps {
  prevSegment: Segment | null;
  nextSegment: Segment | null;
}

export function Navigation({ prevSegment, nextSegment }: NavigationProps) {
  return (
    <div className="flex justify-between gap-4 mt-6">
      {prevSegment ? (
        <Button variant="outline" asChild className="flex-1 max-w-[300px]">
          <a href={`/learn/${prevSegment.id}`} className="truncate">
            <ChevronLeft className="mr-2 h-4 w-4 shrink-0" />
            <span className="truncate">Previous: {prevSegment.title}</span>
          </a>
        </Button>
      ) : (
        <div className="flex-1 max-w-[300px]"></div>
      )}
      {nextSegment && (
        <Button asChild className="flex-1 max-w-[300px]">
          <a href={`/learn/${nextSegment.id}`} className="truncate">
            <span className="truncate">Next: {nextSegment.title}</span>
            <ChevronRight className="ml-2 h-4 w-4 shrink-0" />
          </a>
        </Button>
      )}
    </div>
  );
}
