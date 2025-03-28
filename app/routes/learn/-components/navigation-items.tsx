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
import { DragDropContext, Draggable, Droppable } from "@hello-pangea/dnd";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { reorderSegmentsFn } from "~/fn/segments";

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
  const queryClient = useQueryClient();

  // Track expanded state for each module
  const [expandedModules, setExpandedModules] = useState<
    Record<string, boolean>
  >(() => {
    const currentModule = modules.find((module) =>
      module.segments.some((segment) => segment.id === currentSegmentId)
    );
    return currentModule ? { [currentModule.id]: true } : {};
  });

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

  return (
    <div className={cn("space-y-4", className)}>
      {modules.map((module) => (
        <div key={module.id} className="relative">
          <div className="flex items-center gap-2">
            {dragHandleProps && isAdmin && (
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
            <>
              {isAdmin ? (
                <DragDropContext
                  onDragEnd={(result) => handleDragEnd(result, module.id)}
                >
                  <Droppable droppableId={`module-${module.id}-segments`}>
                    {(provided) => (
                      <div
                        {...provided.droppableProps}
                        ref={provided.innerRef}
                        className="mt-1 ml-4 space-y-1"
                      >
                        {module.segments.map((segment, index) => {
                          const isActive = segment.id === currentSegmentId;
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
                                    snapshot.isDragging && "z-50"
                                  )}
                                >
                                  {isActive && (
                                    <div className="absolute left-0 top-0 bottom-0 w-px bg-theme-500" />
                                  )}
                                  <div className="flex items-center">
                                    <div
                                      {...provided.dragHandleProps}
                                      className="cursor-grab active:cursor-grabbing p-2"
                                    >
                                      <GripVertical className="h-4 w-4 text-muted-foreground" />
                                    </div>
                                    <button
                                      onClick={() =>
                                        handleSegmentClick(segment.id)
                                      }
                                      className={cn(
                                        "flex items-center gap-2 w-full pl-6 pr-4 py-3 text-base hover:text-foreground transition-colors group relative text-left",
                                        isActive
                                          ? "text-theme-500"
                                          : "text-muted-foreground",
                                        "before:absolute before:left-0 before:top-0 before:bottom-0 before:w-[2px] before:bg-theme-500 before:opacity-0 hover:before:opacity-100",
                                        isActive && "before:opacity-100"
                                      )}
                                    >
                                      <span className="flex-1">
                                        {segment.title}
                                      </span>
                                      {segment.isPremium && !isPremium && (
                                        <Lock className="h-4 w-4" />
                                      )}
                                    </button>
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
                            isActive
                              ? "text-theme-500"
                              : "text-muted-foreground",
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
            </>
          )}
        </div>
      ))}
    </div>
  );
}
