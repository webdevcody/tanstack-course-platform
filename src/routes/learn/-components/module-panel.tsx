import type { Module, Progress, Segment } from "~/db/schema";
import { DragDropContext, Draggable, Droppable } from "@hello-pangea/dnd";
import { SegmentItem } from "./segment-item";
import { useNavigate } from "@tanstack/react-router";
import { Plus } from "lucide-react";
import { cn } from "~/lib/utils";

interface ModuleWithSegments extends Module {
  segments: Segment[];
}

interface ModulePanelProps {
  module: ModuleWithSegments;
  isExpanded: boolean;
  currentSegmentId: number;
  progress: Progress[];
  isAdmin: boolean;
  isPremium: boolean;
  onSegmentClick: (segmentId: number) => void;
  onDragEnd: (result: any, moduleId: number) => void;
}

export function ModulePanel({
  module,
  isExpanded,
  currentSegmentId,
  progress,
  isAdmin,
  isPremium,
  onSegmentClick,
  onDragEnd,
}: ModulePanelProps) {
  const navigate = useNavigate();

  const isSegmentCompleted = (segmentId: number) => {
    return progress.some((p) => p.segmentId === segmentId);
  };

  const handleCreateSegment = () => {
    navigate({
      to: "/learn/add",
      search: { moduleTitle: module.title },
    });
  };

  if (!isExpanded) return null;

  // Add safety check for module.segments
  const segments = module.segments || [];

  return (
    <div className="border-t border-gray-200/60 dark:border-gray-700/60 w-full">
      {isAdmin ? (
        <DragDropContext onDragEnd={(result) => onDragEnd(result, module.id)}>
          <Droppable droppableId={`module-${module.id}-segments`}>
            {(provided) => (
              <div
                {...provided.droppableProps}
                ref={provided.innerRef}
                className="p-3 space-y-1"
              >
                {segments.map((segment, index) => {
                  const isActive = segment.id === currentSegmentId;
                  const isCompleted = isSegmentCompleted(segment.id);
                  return (
                    <Draggable
                      key={segment.id}
                      draggableId={`segment-${segment.id}`}
                      index={index}
                      isDragDisabled={false}
                    >
                      {(provided, snapshot) => (
                        <SegmentItem
                          segment={segment}
                          index={index}
                          isActive={isActive}
                          isCompleted={isCompleted}
                          isPremium={isPremium}
                          isAdmin={isAdmin}
                          onSegmentClick={onSegmentClick}
                          provided={provided}
                          snapshot={snapshot}
                        />
                      )}
                    </Draggable>
                  );
                })}
                {provided.placeholder}

                {/* Empty state for creating new segment */}
                <button
                  onClick={handleCreateSegment}
                  className={cn(
                    "w-full p-3 rounded-lg border-2 border-dashed border-theme-300/60 dark:border-theme-700/60",
                    "bg-gradient-to-br from-theme-50/30 to-transparent dark:from-theme-950/20",
                    "hover:border-theme-400/80 dark:hover:border-theme-600/80",
                    "hover:from-theme-100/50 dark:hover:from-theme-900/30",
                    "transition-all duration-300 hover:shadow-elevation-2",
                    "group/add-segment"
                  )}
                >
                  <div className="flex items-center justify-center gap-2 text-theme-600 dark:text-theme-400">
                    <div className="flex items-center justify-center w-6 h-6 rounded-md bg-theme-100 dark:bg-theme-900 group-hover/add-segment:bg-theme-200 dark:group-hover/add-segment:bg-theme-800 transition-colors duration-200">
                      <Plus className="h-3 w-3" />
                    </div>
                    <span className="text-sm font-medium group-hover/add-segment:text-theme-700 dark:group-hover/add-segment:text-theme-300 transition-colors duration-200">
                      New segment
                    </span>
                  </div>
                </button>
              </div>
            )}
          </Droppable>
        </DragDropContext>
      ) : (
        <div className="p-3 space-y-1">
          {segments.map((segment, index) => {
            const isActive = segment.id === currentSegmentId;
            const isCompleted = isSegmentCompleted(segment.id);
            return (
              <SegmentItem
                key={segment.id}
                segment={segment}
                index={index}
                isActive={isActive}
                isCompleted={isCompleted}
                isPremium={isPremium}
                isAdmin={isAdmin}
                onSegmentClick={onSegmentClick}
              />
            );
          })}
        </div>
      )}
    </div>
  );
}
