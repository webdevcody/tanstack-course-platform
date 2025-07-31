import type { Module, Progress, Segment } from "~/db/schema";
import { cn } from "~/lib/utils";
import { useState, useEffect } from "react";
import { useSegment } from "./segment-context";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { reorderSegmentsFn } from "~/fn/segments";
import { ModuleAccordionHeader } from "./module-accordion-header";
import { ModulePanel } from "./module-panel";

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

  // Early return if modules data is not ready
  if (!modules || !Array.isArray(modules) || modules.length === 0) {
    return null;
  }

  // Track expanded state for each module
  const [expandedModules, setExpandedModules] = useState<
    Record<string, boolean>
  >(() => {
    // Add safety checks for modules and segments
    if (!modules || !Array.isArray(modules)) {
      return {};
    }

    const currentModule = modules.find(
      (module) =>
        module?.segments &&
        Array.isArray(module.segments) &&
        module.segments.some((segment) => segment.id === currentSegmentId)
    );
    return currentModule ? { [currentModule.id]: true } : {};
  });

  // Update expanded state when currentSegmentId changes
  useEffect(() => {
    // Add safety checks for modules and segments
    if (!modules || !Array.isArray(modules)) {
      return;
    }

    const currentModule = modules.find(
      (module) =>
        module?.segments &&
        Array.isArray(module.segments) &&
        module.segments.some((segment) => segment.id === currentSegmentId)
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

    // Add safety check for segments array
    if (!Array.isArray(moduleSegments)) {
      return;
    }

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
      {modules &&
        Array.isArray(modules) &&
        modules.map((module, moduleIndex) => {
          const isExpanded = expandedModules[module.id];

          return (
            <div key={module.id} className="module-card">
              <ModuleAccordionHeader
                module={module}
                progress={progress}
                isExpanded={isExpanded}
                onToggle={() => toggleModule(module.id)}
                dragHandleProps={dragHandleProps}
                isAdmin={isAdmin}
                moduleIndex={moduleIndex}
              />
              <ModulePanel
                module={module}
                isExpanded={isExpanded}
                currentSegmentId={currentSegmentId}
                progress={progress}
                isAdmin={isAdmin}
                isPremium={isPremium}
                onSegmentClick={handleSegmentClick}
                onDragEnd={handleDragEnd}
              />
            </div>
          );
        })}
    </div>
  );
}
