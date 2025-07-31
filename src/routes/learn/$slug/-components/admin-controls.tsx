import { type Segment } from "~/db/schema";
import { EditVideoButton } from "./edit-video-button";
import { DeleteSegmentButton } from "./delete-segment-button";

interface AdminControlsProps {
  currentSegment: Segment;
}

export function AdminControls({ currentSegment }: AdminControlsProps) {
  return (
    <div className="flex items-center gap-2">
      <EditVideoButton currentSegment={currentSegment} />
      <DeleteSegmentButton currentSegmentId={currentSegment.id} />
    </div>
  );
}
