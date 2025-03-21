import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  Sidebar,
  SidebarContent,
} from "~/components/ui/sidebar";
import { Segment } from "~/db/schema";
import { Button } from "~/components/ui/button";
import { Plus } from "lucide-react";

interface DesktopNavigationProps {
  segments: Segment[];
  currentSegmentId: Segment["id"];
  isAdmin: boolean;
}

export function DesktopNavigation({
  segments,
  currentSegmentId,
  isAdmin,
}: DesktopNavigationProps) {
  return (
    <Sidebar className="fixed top-0 left-0 bottom-0 w-80 border-r">
      <SidebarContent className="pt-[4.5rem]">
        <div className="px-4">
          <SidebarGroup>
            <div className="flex items-center justify-between px-2 py-2">
              <SidebarGroupLabel className="text-sm font-medium text-muted-foreground">
                Sections
              </SidebarGroupLabel>
            </div>
            <SidebarGroupContent>
              <SidebarMenu className="space-y-1">
                {segments.map((segment, index) => (
                  <SidebarMenuItem key={segment.id}>
                    <SidebarMenuButton
                      asChild
                      isActive={segment.id === currentSegmentId}
                      className="rounded-md transition-colors w-full py-2 px-2 hover:bg-accent text-sm data-[active=true]:bg-accent data-[active=true]:font-medium"
                    >
                      <a
                        href={`/learn/${segment.id}`}
                        className="flex items-center gap-2 w-full"
                      >
                        <span className="flex-shrink-0 size-5 flex items-center justify-center rounded-full bg-muted font-medium text-xs">
                          {index + 1}
                        </span>
                        <span>{segment.title}</span>
                      </a>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}

                {isAdmin && (
                  <Button variant="secondary" asChild>
                    <a href="/learn/add">
                      <Plus className="h-4 w-4" /> Add Content
                      <span className="sr-only">Create new content</span>
                    </a>
                  </Button>
                )}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        </div>
      </SidebarContent>
    </Sidebar>
  );
}
