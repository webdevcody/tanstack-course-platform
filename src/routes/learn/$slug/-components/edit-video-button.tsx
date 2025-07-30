import { Link } from "@tanstack/react-router";
import { Button } from "~/components/ui/button";
import { Edit } from "lucide-react";
import { type Segment } from "~/db/schema";

interface EditVideoButtonProps {
  currentSegment: Segment;
}

export function EditVideoButton({ currentSegment }: EditVideoButtonProps) {
  return (
    <Link to="/learn/$slug/edit" params={{ slug: currentSegment.slug }}>
      <Button className="module-card px-4 py-2 flex items-center gap-2 text-sm font-medium text-theme-700 dark:text-theme-300 hover:text-theme-800 dark:hover:text-theme-200 transition-all duration-200 hover:shadow-elevation-3">
        <Edit className="h-4 w-4" />
        Edit
      </Button>
    </Link>
  );
}
