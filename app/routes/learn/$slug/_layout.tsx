import { Outlet, createFileRoute, useNavigate } from "@tanstack/react-router";
import { SidebarProvider, useSidebar } from "~/components/ui/sidebar";
import { Button } from "~/components/ui/button";
import { Menu } from "lucide-react";
import { MobileNavigation } from "~/routes/learn/-components/mobile-navigation";
import { DesktopNavigation } from "~/routes/learn/-components/desktop-navigation";
import { getSegmentInfoFn } from "./_layout.index";
import { isUserPremiumFn } from "~/fn/auth";
import {
  SegmentProvider,
  useSegment,
} from "~/routes/learn/-components/segment-context";
import { useEffect } from "react";
import { setLastWatchedSegment } from "~/utils/local-storage";

export const Route = createFileRoute("/learn/$slug/_layout")({
  component: RouteComponent,
  loader: async ({ params }) => {
    const { segment, segments, attachments, progress } = await getSegmentInfoFn(
      { data: { slug: params.slug } }
    );

    const isPremium = await isUserPremiumFn();

    return { segment, segments, attachments, progress, isPremium };
  },
});

function LayoutContent() {
  const { openMobile, setOpenMobile } = useSidebar();
  const { segments, segment, progress, isPremium } = Route.useLoaderData();
  const navigate = useNavigate();
  const { currentSegmentId, setCurrentSegmentId } = useSegment();

  // Initialize the current segment ID when the component mounts
  useEffect(() => {
    setCurrentSegmentId(segment.id);
    // Track the last watched segment
    setLastWatchedSegment(segment.slug);
  }, [segment.id, segment.slug, setCurrentSegmentId]);

  // Handle segment changes
  useEffect(() => {
    if (currentSegmentId && currentSegmentId !== segment.id) {
      const newSegment = segments.find((s) => s.id === currentSegmentId);
      if (newSegment) {
        navigate({ to: "/learn/$slug", params: { slug: newSegment.slug } });
      }
    }
  }, [currentSegmentId, segment.id, segments, navigate]);

  return (
    <div className="flex w-full">
      {/* Desktop Navigation */}
      <div className="hidden md:block w-80 flex-shrink-0">
        <DesktopNavigation
          segments={segments}
          progress={progress}
          currentSegmentId={segment.id}
          isAdmin={true}
          isPremium={isPremium}
        />
      </div>

      <div className="flex-1 w-full">
        {/* Mobile Navigation */}
        <MobileNavigation
          segments={segments}
          progress={progress}
          currentSegmentId={segment.id}
          isOpen={openMobile}
          onClose={() => setOpenMobile(false)}
          isAdmin={true}
          isPremium={isPremium}
        />

        <main className="w-full p-6 pt-4">
          {/* Mobile Sidebar Toggle */}
          <Button
            size="icon"
            className="z-50 md:hidden hover:bg-accent"
            onClick={() => setOpenMobile(true)}
          >
            <Menu />
            <span className="sr-only">Toggle navigation</span>
          </Button>

          <Outlet />
        </main>
      </div>
    </div>
  );
}

function RouteComponent() {
  return (
    <SidebarProvider>
      <SegmentProvider>
        <LayoutContent />
      </SegmentProvider>
    </SidebarProvider>
  );
}
