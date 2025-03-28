import {
  Check,
  ChevronRight,
  CircleCheck,
  Lock,
  GripVertical,
} from "lucide-react";
import type { Module, Segment } from "~/db/schema";
import { cn } from "~/lib/utils";
import { useState } from "react";
import { useSegment } from "./segment-context";

interface ModuleWithSegments extends Module {
  segments: Segment[];
}

interface NavigationItemsProps {
  modules: ModuleWithSegments[];
  currentSegmentId: number;
  isAdmin: boolean;
  isPremium: boolean;
  className?: string;
  onItemClick?: () => void;
  dragHandleProps?: any;
}

export function NavigationItems({
  modules,
  currentSegmentId,
  isAdmin,
  isPremium,
  className,
  onItemClick,
  dragHandleProps,
}: NavigationItemsProps) {
  const { setCurrentSegmentId } = useSegment();

  // Track expanded state for each module
  const [expandedModules, setExpandedModules] = useState<
    Record<string, boolean>
  >(() => {
    const currentModule = modules.find((module) =>
      module.segments.some((segment) => segment.id === currentSegmentId)
    );
    return currentModule ? { [currentModule.id]: true } : {};
  });

  const toggleModule = (moduleId: number) => {
    setExpandedModules((prev) => ({ ...prev, [moduleId]: !prev[moduleId] }));
  };

  const handleSegmentClick = (segmentId: number) => {
    setCurrentSegmentId(segmentId);
    onItemClick?.();
  };

  return (
    <div className={cn("space-y-4", className)}>
      {modules.map((module) => (
        <div key={module.id} className="relative">
          <div className="flex items-center gap-2">
            {dragHandleProps && (
              <div
                {...dragHandleProps}
                className="cursor-grab active:cursor-grabbing p-2"
              >
                <GripVertical className="h-4 w-4 text-muted-foreground" />
              </div>
            )}
            <button
              onClick={() => toggleModule(module.id)}
              className="flex items-center justify-between w-full px-2 py-2 text-sm font-medium text-left hover:bg-accent rounded-md transition-colors"
            >
              <span>{module.title}</span>
              <ChevronRight
                className={cn(
                  "h-4 w-4 transition-transform",
                  expandedModules[module.id] && "rotate-90"
                )}
              />
            </button>
          </div>

          {expandedModules[module.id] && (
            <div className="mt-1 ml-4 space-y-1">
              {module.segments.map((segment) => {
                const isActive = segment.id === currentSegmentId;
                return (
                  <div key={segment.id} className="relative">
                    {isActive && (
                      <div className="absolute left-0 top-0 bottom-0 w-px bg-theme-500" />
                    )}
                    <button
                      onClick={() => handleSegmentClick(segment.id)}
                      className={cn(
                        "flex items-center gap-2 w-full pl-6 pr-4 py-3 text-base hover:text-foreground transition-colors group relative text-left",
                        isActive ? "text-theme-500" : "text-muted-foreground",
                        "before:absolute before:left-0 before:top-0 before:bottom-0 before:w-[2px] before:bg-theme-500 before:opacity-0 hover:before:opacity-100",
                        isActive && "before:opacity-100"
                      )}
                    >
                      <span className="flex-1">{segment.title}</span>
                      {segment.isPremium && !isPremium && (
                        <Lock className="h-4 w-4" />
                      )}
                    </button>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
