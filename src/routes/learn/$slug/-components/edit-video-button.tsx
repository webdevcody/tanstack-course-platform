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
      <Button>
        <Edit className="h-4 w-4" />
        Edit
      </Button>
    </Link>
  );
}
