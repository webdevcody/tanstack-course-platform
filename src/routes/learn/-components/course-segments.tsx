import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
} from "~/components/ui/sidebar";

interface Segment {
  id: string;
  title: string;
}

interface CourseSegmentsProps {
  segments: Segment[];
  currentSegmentId: string;
  variant?: "mobile" | "desktop";
}

export function CourseSegments({
  segments,
  currentSegmentId,
  variant = "desktop",
}: CourseSegmentsProps) {
  if (variant === "mobile") {
    return (
      <div className="divide-y divide-border">
        {segments.map((segment) => (
          <a
            key={segment.id}
            href={`/course/${segment.id}`}
            className={`flex items-center gap-6 p-6 hover:bg-accent/50 transition-colors ${
              segment.id === currentSegmentId ? "bg-accent/50" : ""
            }`}
          >
            <div className="flex-shrink-0 size-10 flex items-center justify-center rounded-full bg-background border text-lg font-medium">
              {segment.id}
            </div>
            <span className="text-lg">{segment.title}</span>
          </a>
        ))}
      </div>
    );
  }

  return (
    <SidebarGroup>
      <SidebarGroupLabel className="text-sm font-medium px-2 py-2 text-muted-foreground">
        Sections
      </SidebarGroupLabel>
      <SidebarGroupContent>
        <SidebarMenu className="space-y-1">
          {segments.map((segment) => (
            <SidebarMenuItem key={segment.id}>
              <SidebarMenuButton
                asChild
                isActive={segment.id === currentSegmentId}
                className="rounded-md transition-colors w-full py-2 px-2 hover:bg-accent text-sm"
              >
                <a
                  href={`/course/${segment.id}`}
                  className="flex items-center gap-2 w-full"
                >
                  <span className="flex-shrink-0 size-5 flex items-center justify-center rounded-full bg-muted font-medium text-xs">
                    {segment.id}
                  </span>
                  <span>{segment.title}</span>
                </a>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  );
}
