import {
  Check,
  ChevronRight,
  CircleCheck,
  GripVertical,
  BookOpen,
} from "lucide-react";
import type { Module, Progress, Segment } from "~/db/schema";
import { cn } from "~/lib/utils";
import { DeleteModuleButton } from "./delete-module-button";

interface ModuleWithSegments extends Module {
  segments: Segment[];
}

interface ModuleAccordionHeaderProps {
  module: ModuleWithSegments;
  progress: Progress[];
  isExpanded: boolean;
  onToggle: () => void;
  dragHandleProps?: any;
  isAdmin: boolean;
  moduleIndex: number;
}

export function ModuleAccordionHeader({
  module,
  progress,
  isExpanded,
  onToggle,
  dragHandleProps,
  isAdmin,
  moduleIndex,
}: ModuleAccordionHeaderProps) {
  // Early return if module data is incomplete
  if (!module || !module.title) {
    return null;
  }

  const getModuleProgress = (module: ModuleWithSegments) => {
    // Add safety check for module.segments
    if (!module.segments || !Array.isArray(module.segments)) {
      return {
        completed: 0,
        total: 0,
        percentage: 0,
      };
    }

    const completedSegments = module.segments.filter((segment) =>
      progress.some((p) => p.segmentId === segment.id)
    ).length;
    return {
      completed: completedSegments,
      total: module.segments.length,
      percentage:
        module.segments.length > 0
          ? (completedSegments / module.segments.length) * 100
          : 0,
    };
  };

  const moduleProgress = getModuleProgress(module);

  return (
    <div
      className="group animate-fade-in"
      style={{ animationDelay: `${moduleIndex * 150}ms` }}
    >
      <div className="w-full">
        <div className="relative p-4 w-full">
          <div className="flex items-center gap-3">
            {dragHandleProps && isAdmin && (
              <div
                {...dragHandleProps}
                className="cursor-grab active:cursor-grabbing p-1 rounded-md hover:bg-theme-100 dark:hover:bg-theme-800 transition-colors"
              >
                <GripVertical className="h-4 w-4 text-muted-foreground" />
              </div>
            )}

            <div className="flex-1">
              <button
                onClick={onToggle}
                className="flex items-center justify-between w-full text-left group/module"
              >
                <div className="flex items-center gap-3 flex-1 min-w-0">
                  <div className="p-1.5 rounded-lg bg-gradient-to-br from-theme-500/10 to-theme-600/10 group-hover/module:from-theme-500/20 group-hover/module:to-theme-600/20 transition-all duration-300 flex-shrink-0">
                    <BookOpen className="h-4 w-4 text-theme-600 dark:text-theme-400" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <h3 className="text-base font-semibold text-foreground group-hover/module:text-theme-600 dark:group-hover/module:text-theme-400 transition-colors duration-200 truncate">
                      {module.title}
                    </h3>
                    <div className="flex items-center gap-2 mt-0.5">
                      {moduleProgress.percentage === 100 ? (
                        <div className="flex items-center gap-1 text-theme-600 dark:text-theme-400">
                          <CircleCheck className="h-3 w-3" />
                          <span className="text-xs font-medium">Complete</span>
                        </div>
                      ) : (
                        <span className="text-xs text-muted-foreground">
                          {moduleProgress.completed} of {moduleProgress.total}{" "}
                          completed
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2 flex-shrink-0">
                  {isAdmin ? (
                    <DeleteModuleButton
                      moduleId={module.id}
                      moduleTitle={module.title}
                    />
                  ) : (
                    <div className="relative w-8 h-8">
                      <svg className="w-8 h-8 transform" viewBox="0 0 36 36">
                        <path
                          className="text-gray-200 dark:text-gray-700"
                          d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                        />
                        <path
                          className="text-theme-500"
                          d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeDasharray={`${moduleProgress.percentage}, 100`}
                          strokeLinecap="round"
                        />
                      </svg>
                      <div className="absolute inset-0 flex items-center justify-center">
                        {moduleProgress.percentage === 100 ? (
                          <Check className="h-3 w-3 text-theme-600 dark:text-theme-400" />
                        ) : (
                          <span className="text-xs font-semibold text-theme-600 dark:text-theme-400"></span>
                        )}
                      </div>
                    </div>
                  )}

                  <ChevronRight
                    className={cn(
                      "h-4 w-4 text-muted-foreground transition-all duration-300 group-hover/module:text-theme-600 dark:group-hover/module:text-theme-400",
                      isExpanded && "rotate-90"
                    )}
                  />
                </div>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
