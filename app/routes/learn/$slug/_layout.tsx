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

  // Combined effect to handle both initialization and navigation
  useEffect(() => {
    // If we don't have a currentSegmentId, initialize it
    if (!currentSegmentId) {
      setCurrentSegmentId(segment.id);
      return;
    }

    // If we have a currentSegmentId that's different from the current segment,
    // and we're not already on that segment's page, navigate
    if (currentSegmentId !== segment.id) {
      const newSegment = segments.find((s) => s.id === currentSegmentId);
      if (newSegment && newSegment.slug !== segment.slug) {
        navigate({ to: "/learn/$slug", params: { slug: newSegment.slug } });
      }
    }
  }, [
    currentSegmentId,
    segment.id,
    segment.slug,
    segments,
    navigate,
    setCurrentSegmentId,
  ]);

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
  const { segment } = Route.useLoaderData();

  return (
    <SidebarProvider>
      {segment && (
        <SegmentProvider>
          <LayoutContent />
        </SegmentProvider>
      )}
    </SidebarProvider>
  );
}
