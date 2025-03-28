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
import type { Module, Segment } from "~/db/schema";
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
}

export function DesktopNavigation({
  modules,
  currentSegmentId,
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
    <Sidebar className="hidden lg:block">
      <SidebarContent className="pt-20">
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              <DragDropContext onDragEnd={handleDragEnd}>
                <Droppable droppableId="modules">
                  {(provided) => (
                    <div
                      {...provided.droppableProps}
                      ref={provided.innerRef}
                      className="space-y-4"
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
                                dragHandleProps={
                                  isAdmin ? provided.dragHandleProps : undefined
                                }
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
                  variant="outline"
                  size="sm"
                  className="w-full mt-4"
                  onClick={() => {
                    router.navigate({ to: "/learn/add" });
                  }}
                >
                  <Plus className="mr-2 h-4 w-4" />
                  Add Module
                </Button>
              )}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
