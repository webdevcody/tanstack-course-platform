import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  Sidebar,
  SidebarContent,
} from "~/components/ui/sidebar";
import { Segment } from "~/db/schema";
import { Button } from "~/components/ui/button";
import { Plus } from "lucide-react";
import { NavigationItems } from "./navigation-items";

interface DesktopNavigationProps {
  segments: Segment[];
  currentSegmentId: Segment["id"];
  isAdmin: boolean;
  isPremium: boolean;
}

export function DesktopNavigation({
  segments,
  currentSegmentId,
  isAdmin,
  isPremium,
}: DesktopNavigationProps) {
  return (
    <Sidebar className="fixed top-0 left-0 bottom-0 w-80 border-r">
      <SidebarContent className="pt-[4.5rem]">
        <div className="px-4">
          <SidebarGroup>
            <SidebarGroupContent>
              <SidebarMenu className="space-y-1">
                <NavigationItems
                  segments={segments}
                  currentSegmentId={currentSegmentId}
                  isAdmin={isAdmin}
                  isPremium={isPremium}
                />

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
