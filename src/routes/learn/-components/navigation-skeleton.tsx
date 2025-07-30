import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
} from "~/components/ui/sidebar";
import { Skeleton } from "~/components/ui/skeleton";

export function NavigationSkeleton() {
  return (
    <Sidebar className="border-r">
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel className="text-xs text-muted-foreground mb-4">
            Course Content
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              <div className="space-y-4">
                {/* Skeleton for 3-4 modules */}
                {Array.from({ length: 3 }).map((_, index) => (
                  <div key={index} className="module-card">
                    <div className="p-4 w-full">
                      <div className="flex items-center gap-3">
                        <div className="flex-1">
                          <div className="flex items-center justify-between w-full">
                            <div className="flex items-center gap-3 flex-1 min-w-0">
                              <div className="p-1.5 rounded-lg bg-gradient-to-br from-theme-500/10 to-theme-600/10 flex-shrink-0">
                                <Skeleton className="h-4 w-4" />
                              </div>
                              <div className="min-w-0 flex-1 space-y-1">
                                <Skeleton className="h-4 w-32" />
                                <Skeleton className="h-3 w-20" />
                              </div>
                            </div>
                            <div className="flex items-center gap-2 flex-shrink-0">
                              <Skeleton className="h-8 w-8 rounded-full" />
                              <Skeleton className="h-4 w-4" />
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
