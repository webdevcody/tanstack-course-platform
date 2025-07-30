import { Check, Lock, GripVertical, Star, PlayCircle } from "lucide-react";
import type { Segment } from "~/db/schema";
import { cn } from "~/lib/utils";

interface SegmentItemProps {
  segment: Segment;
  index: number;
  isActive: boolean;
  isCompleted: boolean;
  isPremium: boolean;
  isAdmin: boolean;
  onSegmentClick: (segmentId: number) => void;
  provided?: any;
  snapshot?: any;
}

export function SegmentItem({
  segment,
  index,
  isActive,
  isCompleted,
  isPremium,
  isAdmin,
  onSegmentClick,
  provided,
  snapshot,
}: SegmentItemProps) {
  const content = (
    <div
      className={cn(
        "segment-item group/segment p-3 rounded-lg border border-transparent transition-all duration-300",
        isActive &&
          "active bg-gradient-to-r from-theme-50 to-theme-100/50 dark:from-theme-950/50 dark:to-theme-900/30 border-theme-200 dark:border-theme-800 shadow-lg",
        !isActive && "hover:border-theme-200/50 dark:hover:border-theme-800/50"
      )}
    >
      <div className="flex items-center gap-2">
        {provided && (
          <div
            {...provided.dragHandleProps}
            className="cursor-grab active:cursor-grabbing p-1 rounded opacity-0 group-hover/segment:opacity-100 transition-opacity"
          >
            <GripVertical className="h-3 w-3 text-muted-foreground" />
          </div>
        )}

        <button
          onClick={() => onSegmentClick(segment.id)}
          className="flex items-center justify-between flex-1 text-left"
        >
          <div className="flex items-center gap-2">
            <div
              className={cn(
                "flex items-center justify-center w-6 h-6 rounded-md transition-all duration-300",
                isCompleted
                  ? "bg-theme-500 text-white shadow-glow-sm"
                  : isActive
                    ? "bg-theme-100 dark:bg-theme-900 text-theme-600 dark:text-theme-400"
                    : "bg-gray-100 dark:bg-gray-800 text-muted-foreground group-hover/segment:bg-theme-100 dark:group-hover/segment:bg-theme-900 group-hover/segment:text-theme-600 dark:group-hover/segment:text-theme-400"
              )}
            >
              {isCompleted ? (
                <Check className="h-3 w-3" />
              ) : (
                <PlayCircle className="h-3 w-3" />
              )}
            </div>

            <div className="flex-1 min-w-0">
              <h4
                className={cn(
                  "text-sm font-medium transition-colors duration-200 truncate",
                  isActive
                    ? "text-theme-700 dark:text-theme-300"
                    : "text-foreground group-hover/segment:text-theme-600 dark:group-hover/segment:text-theme-400"
                )}
              >
                {segment.title}
              </h4>
              {segment.length && (
                <p className="text-xs text-muted-foreground mt-0.5">
                  {segment.length}
                </p>
              )}
            </div>
          </div>

          <div className="flex items-center gap-1">
            {segment.isPremium && !isPremium && (
              <div
                className={cn(
                  "flex items-center gap-1 px-1.5 py-0.5 rounded text-xs font-medium",
                  "bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400"
                )}
              >
                <Lock className="h-3 w-3 text-muted-foreground" />
                Pro Only
              </div>
            )}
          </div>
        </button>
      </div>
    </div>
  );

  if (provided) {
    return (
      <div
        ref={provided.innerRef}
        {...provided.draggableProps}
        className={cn(
          "relative",
          snapshot?.isDragging && "z-50 rotate-2 scale-105"
        )}
        style={{
          ...provided.draggableProps.style,
          animationDelay: `${index * 50}ms`,
        }}
      >
        {content}
      </div>
    );
  }

  return (
    <div
      className="animate-slide-up"
      style={{ animationDelay: `${index * 50}ms` }}
    >
      {content}
    </div>
  );
}
