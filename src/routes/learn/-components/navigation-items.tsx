import {
  Check,
  ChevronRight,
  CircleCheck,
  Lock,
  GripVertical,
  Star,
  PlayCircle,
  BookOpen,
  Users,
} from "lucide-react";
import type { Module, Progress, Segment } from "~/db/schema";
import { cn } from "~/lib/utils";
import { useState, useEffect } from "react";
import { useSegment } from "./segment-context";
import { DragDropContext, Draggable, Droppable } from "@hello-pangea/dnd";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { reorderSegmentsFn } from "~/fn/segments";

interface ModuleWithSegments extends Module {
  segments: Segment[];
}

interface NavigationItemsProps {
  modules: ModuleWithSegments[];
  currentSegmentId: number;
  progress: Progress[];
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
  progress,
  onItemClick,
  dragHandleProps,
}: NavigationItemsProps) {
  const { setCurrentSegmentId } = useSegment();
  const queryClient = useQueryClient();

  // Track expanded state for each module
  const [expandedModules, setExpandedModules] = useState<
    Record<string, boolean>
  >(() => {
    const currentModule = modules?.find((module) =>
      module?.segments?.some((segment) => segment.id === currentSegmentId)
    );
    return currentModule ? { [currentModule.id]: true } : {};
  });

  // Update expanded state when currentSegmentId changes
  useEffect(() => {
    const currentModule = modules?.find((module) =>
      module?.segments?.some((segment) => segment.id === currentSegmentId)
    );
    if (currentModule) {
      setExpandedModules((prev) => ({ ...prev, [currentModule.id]: true }));
    }
  }, [currentSegmentId, modules]);

  const reorderMutation = useMutation({
    mutationFn: (updates: { id: number; order: number }[]) =>
      reorderSegmentsFn({ data: updates }),
    onMutate: async (updates) => {
      await queryClient.cancelQueries({ queryKey: ["modules"] });
      const previousModules = queryClient.getQueryData<ModuleWithSegments[]>([
        "modules",
      ]);

      // Create a new array with the updated order
      const optimisticModules = modules.map((module) => ({
        ...module,
        segments: [...module.segments].sort((a, b) => {
          const aOrder = updates.find((u) => u.id === a.id)?.order ?? a.order;
          const bOrder = updates.find((u) => u.id === b.id)?.order ?? b.order;
          return aOrder - bOrder;
        }),
      }));

      queryClient.setQueryData(["modules"], optimisticModules);
      return { previousModules };
    },
    onError: (err, newModules, context) => {
      queryClient.setQueryData(["modules"], context?.previousModules);
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["modules"] });
    },
  });

  const toggleModule = (moduleId: number) => {
    setExpandedModules((prev) => ({ ...prev, [moduleId]: !prev[moduleId] }));
  };

  const handleSegmentClick = (segmentId: number) => {
    setCurrentSegmentId(segmentId);
    onItemClick?.();
  };

  const handleDragEnd = (result: any, moduleId: number) => {
    if (!result.destination || !isAdmin) return;

    const moduleSegments =
      modules.find((m) => m.id === moduleId)?.segments || [];

    const items = Array.from(moduleSegments);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);

    const updates = items.map((item, index) => ({
      id: item.id,
      order: index + 1,
    }));

    reorderMutation.mutate(updates);
  };

  const isSegmentCompleted = (segmentId: number) => {
    return progress.some((p) => p.segmentId === segmentId);
  };

  const getModuleProgress = (module: ModuleWithSegments) => {
    const completedSegments = module.segments.filter((segment) =>
      isSegmentCompleted(segment.id)
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

  return (
    <div className={cn("space-y-4", className)}>
      {modules.map((module, moduleIndex) => {
        const moduleProgress = getModuleProgress(module);
        const isExpanded = expandedModules[module.id];
        const hasCurrentSegment = module.segments.some(
          (segment) => segment.id === currentSegmentId
        );

        return (
          <div
            key={module.id}
            className="group animate-fade-in"
            style={{ animationDelay: `${moduleIndex * 150}ms` }}
          >
            {/* Module Card */}
            <div className="module-card w-full">
              <div className="relative p-4 w-full">
                {/* Module Header */}
                <div className="flex items-start gap-3">
                  {dragHandleProps && isAdmin && (
                    <div
                      {...dragHandleProps}
                      className="cursor-grab active:cursor-grabbing p-1 rounded-md hover:bg-theme-100 dark:hover:bg-theme-800 transition-colors mt-0.5"
                    >
                      <GripVertical className="h-4 w-4 text-muted-foreground" />
                    </div>
                  )}

                  <div className="flex-1">
                    <button
                      onClick={() => toggleModule(module.id)}
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
                                <span className="text-xs font-medium">
                                  Complete
                                </span>
                              </div>
                            ) : (
                              <span className="text-xs text-muted-foreground">
                                {moduleProgress.completed} of{" "}
                                {moduleProgress.total} completed
                              </span>
                            )}
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 flex-shrink-0">
                        {/* Progress Circle */}
                        <div className="relative w-8 h-8">
                          <svg
                            className="w-8 h-8 transform"
                            viewBox="0 0 36 36"
                          >
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

              {/* Segments */}
              {isExpanded && (
                <div className="border-t border-gray-200/60 dark:border-gray-700/60 bg-gradient-to-b from-gray-50/30 to-transparent dark:from-gray-800/30 w-full">
                  {isAdmin ? (
                    <DragDropContext
                      onDragEnd={(result) => handleDragEnd(result, module.id)}
                    >
                      <Droppable droppableId={`module-${module.id}-segments`}>
                        {(provided) => (
                          <div
                            {...provided.droppableProps}
                            ref={provided.innerRef}
                            className="p-3 space-y-1"
                          >
                            {module.segments.map((segment, index) => {
                              const isActive = segment.id === currentSegmentId;
                              const isCompleted = isSegmentCompleted(
                                segment.id
                              );
                              return (
                                <Draggable
                                  key={segment.id}
                                  draggableId={`segment-${segment.id}`}
                                  index={index}
                                  isDragDisabled={false}
                                >
                                  {(provided, snapshot) => (
                                    <div
                                      ref={provided.innerRef}
                                      {...provided.draggableProps}
                                      className={cn(
                                        "relative",
                                        snapshot.isDragging &&
                                          "z-50 rotate-2 scale-105"
                                      )}
                                      style={{
                                        ...provided.draggableProps.style,
                                        animationDelay: `${index * 50}ms`,
                                      }}
                                    >
                                      <div
                                        className={cn(
                                          "segment-item group/segment p-3 rounded-lg border border-transparent transition-all duration-300",
                                          isActive &&
                                            "active bg-gradient-to-r from-theme-50 to-theme-100/50 dark:from-theme-950/50 dark:to-theme-900/30 border-theme-200 dark:border-theme-800 shadow-lg",
                                          !isActive &&
                                            "hover:border-theme-200/50 dark:hover:border-theme-800/50"
                                        )}
                                      >
                                        <div className="flex items-center gap-2">
                                          <div
                                            {...provided.dragHandleProps}
                                            className="cursor-grab active:cursor-grabbing p-1 rounded opacity-0 group-hover/segment:opacity-100 transition-opacity"
                                          >
                                            <GripVertical className="h-3 w-3 text-muted-foreground" />
                                          </div>

                                          <button
                                            onClick={() =>
                                              handleSegmentClick(segment.id)
                                            }
                                            className="flex items-center gap-2 flex-1 text-left"
                                          >
                                            <div className="flex items-center gap-2">
                                              {/* Status Icon */}
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

                                              {/* Segment Info */}
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

                                            {/* Status Indicators */}
                                            <div className="flex items-center gap-1">
                                              {segment.isPremium && (
                                                <div
                                                  className={cn(
                                                    "flex items-center gap-1 px-1.5 py-0.5 rounded text-xs font-medium",
                                                    isPremium || isAdmin
                                                      ? "bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400"
                                                      : "bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400"
                                                  )}
                                                >
                                                  <Star className="h-2.5 w-2.5" />
                                                  Pro
                                                </div>
                                              )}
                                              {segment.isPremium &&
                                                !isPremium &&
                                                !isAdmin && (
                                                  <Lock className="h-3 w-3 text-muted-foreground" />
                                                )}
                                            </div>
                                          </button>
                                        </div>
                                      </div>
                                    </div>
                                  )}
                                </Draggable>
                              );
                            })}
                            {provided.placeholder}
                          </div>
                        )}
                      </Droppable>
                    </DragDropContext>
                  ) : (
                    <div className="p-3 space-y-1">
                      {module.segments.map((segment, index) => {
                        const isActive = segment.id === currentSegmentId;
                        const isCompleted = isSegmentCompleted(segment.id);
                        return (
                          <div
                            key={segment.id}
                            className="animate-slide-up"
                            style={{ animationDelay: `${index * 50}ms` }}
                          >
                            <div
                              className={cn(
                                "segment-item group/segment p-3 rounded-lg border border-transparent transition-all duration-300",
                                isActive &&
                                  "active bg-gradient-to-r from-theme-50 to-theme-100/50 dark:from-theme-950/50 dark:to-theme-900/30 border-theme-200 dark:border-theme-800 shadow-lg",
                                !isActive &&
                                  "hover:border-theme-200/50 dark:hover:border-theme-800/50"
                              )}
                            >
                              <button
                                onClick={() => handleSegmentClick(segment.id)}
                                className="flex items-center gap-2 w-full text-left"
                              >
                                {/* Status Icon */}
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

                                {/* Segment Info */}
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

                                {/* Status Indicators */}
                                <div className="flex items-center gap-1">
                                  {segment.isPremium && (
                                    <div
                                      className={cn(
                                        "flex items-center gap-1 px-1.5 py-0.5 rounded text-xs font-medium",
                                        isPremium || isAdmin
                                          ? "bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400"
                                          : "bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400"
                                      )}
                                    >
                                      <Star className="h-2.5 w-2.5" />
                                      Pro
                                    </div>
                                  )}
                                  {segment.isPremium &&
                                    !isPremium &&
                                    !isAdmin && (
                                      <Lock className="h-3 w-3 text-muted-foreground" />
                                    )}
                                </div>
                              </button>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
