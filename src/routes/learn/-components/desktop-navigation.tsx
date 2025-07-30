import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  Sidebar,
  SidebarContent,
} from "~/components/ui/sidebar";
import { Button } from "~/components/ui/button";
import { Plus } from "lucide-react";
import { NavigationItems } from "./navigation-items";
import { UserMenu } from "./user-menu";
import type { Module, Progress, Segment } from "~/db/schema";
import { useRouter } from "@tanstack/react-router";
import { DragDropContext, Draggable, Droppable } from "@hello-pangea/dnd";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { reorderModulesFn } from "~/fn/modules";
import { cn } from "~/lib/utils";

interface ModuleWithSegments extends Module {
  segments: Segment[];
}

interface DesktopNavigationProps {
  modules: ModuleWithSegments[];
  currentSegmentId: number;
  isAdmin: boolean;
  isPremium: boolean;
  progress: Progress[];
}

export function DesktopNavigation({
  modules,
  currentSegmentId,
  progress,
  isAdmin,
  isPremium,
}: DesktopNavigationProps) {
  const router = useRouter();
  const queryClient = useQueryClient();

  const reorderMutation = useMutation({
    mutationFn: (updates: { id: number; order: number }[]) =>
      reorderModulesFn({ data: updates }),
    onMutate: async (updates) => {
      await queryClient.cancelQueries({ queryKey: ["modules"] });
      const previousModules = queryClient.getQueryData<ModuleWithSegments[]>([
        "modules",
      ]);

      const optimisticModules = [...modules].sort((a, b) => {
        const aOrder = updates.find((u) => u.id === a.id)?.order ?? a.order;
        const bOrder = updates.find((u) => u.id === b.id)?.order ?? b.order;
        return aOrder - bOrder;
      });

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

  const handleDragEnd = (result: any) => {
    if (!result.destination || !isAdmin) return;

    const items = Array.from(modules);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);

    const updates = items.map((item, index) => ({
      id: item.id,
      order: index + 1,
    }));

    reorderMutation.mutate(updates);
  };

  return (
    <Sidebar className="hidden lg:block w-80 xl:w-[380px]">
      <SidebarContent className="pt-6 w-full flex flex-col h-full">
        {/* Brand Header */}
        <div className="px-4">
          <div className="flex items-center gap-2">
            <img
              src="/icon.png"
              alt="Beginner React Challenges"
              className="size-12"
            />
            <span className="font-semibold">
              The 20 React Challenges Course
            </span>
          </div>
        </div>

        <SidebarGroup className="flex-1">
          <SidebarGroupContent>
            <SidebarMenu className="w-full">
              <DragDropContext onDragEnd={handleDragEnd}>
                <Droppable droppableId="modules">
                  {(provided) => (
                    <div
                      {...provided.droppableProps}
                      ref={provided.innerRef}
                      className="space-y-2 w-full"
                    >
                      {modules.map((module, index) => (
                        <Draggable
                          key={module.id}
                          draggableId={`module-${module.id}`}
                          index={index}
                          isDragDisabled={!isAdmin}
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
                              <NavigationItems
                                modules={[module]}
                                currentSegmentId={currentSegmentId}
                                isAdmin={isAdmin}
                                isPremium={isPremium}
                                progress={progress}
                                dragHandleProps={
                                  isAdmin ? provided.dragHandleProps : undefined
                                }
                                className="w-full"
                              />
                            </div>
                          )}
                        </Draggable>
                      ))}
                      {provided.placeholder}
                    </div>
                  )}
                </Droppable>
              </DragDropContext>

              {isAdmin && (
                <Button
                  className="mt-4 module-card px-4 py-2 flex items-center gap-2 text-sm font-medium text-theme-700 dark:text-theme-300 hover:text-theme-800 dark:hover:text-theme-200 transition-all duration-200 hover:shadow-elevation-3"
                  onClick={() => {
                    router.navigate({ to: "/learn/add" });
                  }}
                >
                  <Plus className="mr-2 h-4 w-4" />
                  New Segment
                </Button>
              )}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* User menu at the bottom */}
        <UserMenu />
      </SidebarContent>
    </Sidebar>
  );
}
