import { Outlet, createFileRoute } from "@tanstack/react-router";
import { SidebarProvider, useSidebar } from "~/components/ui/sidebar";
import { Button } from "~/components/ui/button";
import { Menu } from "lucide-react";
import { MobileNavigation } from "~/routes/learn/-components/mobile-navigation";
import { DesktopNavigation } from "~/routes/learn/-components/desktop-navigation";
import { getSegmentInfoFn } from "./_layout.index";
import { isUserPremiumFn } from "~/fn/auth";

function LayoutContent() {
  const { openMobile, setOpenMobile } = useSidebar();
  const { segments, segment, isPremium } = Route.useLoaderData();

  return (
    <div className="flex w-full">
      {/* Desktop Navigation */}
      <div className="hidden md:block w-80 flex-shrink-0">
        <DesktopNavigation
          segments={segments}
          currentSegmentId={segment.id}
          isAdmin={true}
          isPremium={isPremium}
        />
      </div>

      <div className="flex-1 w-full">
        {/* Mobile Navigation */}
        <MobileNavigation
          segments={segments}
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

export const Route = createFileRoute("/learn/$slug/_layout")({
  component: RouteComponent,
  loader: async ({ params }) => {
    const { segment, segments, attachments } = await getSegmentInfoFn({
      data: { slug: params.slug },
    });

    const isPremium = await isUserPremiumFn();

    return { segment, segments, attachments, isPremium };
  },
});

function RouteComponent() {
  return (
    <SidebarProvider>
      <LayoutContent />
    </SidebarProvider>
  );
}
