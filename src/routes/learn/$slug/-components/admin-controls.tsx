import { type Segment } from "~/db/schema";
import { EditVideoButton } from "./edit-video-button";
import { DeleteVideoButton } from "./delete-video-button";

interface AdminControlsProps {
  currentSegment: Segment;
}

export function AdminControls({ currentSegment }: AdminControlsProps) {
  return (
    <div className="flex items-center gap-2">
      <EditVideoButton currentSegment={currentSegment} />
      <DeleteVideoButton currentSegmentId={currentSegment.id} />
    </div>
  );
}
