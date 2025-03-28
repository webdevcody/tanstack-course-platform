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
import { createServerFn } from "@tanstack/start";
import { getModulesWithSegmentsUseCase } from "~/use-cases/modules";
import { unauthenticatedMiddleware } from "~/lib/auth";
import {
  queryOptions,
  useQuery,
  useSuspenseQuery,
} from "@tanstack/react-query";

const getModulesWithSegmentsFn = createServerFn()
  .middleware([unauthenticatedMiddleware])
  .handler(async () => {
    return getModulesWithSegmentsUseCase();
  });

export const modulesQueryOptions = queryOptions({
  queryKey: ["modules"],
  queryFn: () => getModulesWithSegmentsFn(),
});

export const Route = createFileRoute("/learn/$slug/_layout")({
  component: RouteComponent,
  loader: async ({ context: { queryClient }, params }) => {
    const { segment } = await getSegmentInfoFn({ data: { slug: params.slug } });
    const isPremium = await isUserPremiumFn();

    await queryClient.ensureQueryData(modulesQueryOptions);

    return { segment, isPremium };
  },
});

function LayoutContent() {
  const { openMobile, setOpenMobile } = useSidebar();
  const { segment, isPremium } = Route.useLoaderData();
  const navigate = useNavigate();
  const { currentSegmentId, setCurrentSegmentId } = useSegment();

  const { data: modulesWithSegments } = useQuery(modulesQueryOptions);

  // Combined effect to handle both initialization and navigation
  useEffect(() => {
    if (!currentSegmentId) {
      setCurrentSegmentId(segment.id);
      return;
    }

    if (currentSegmentId !== segment.id) {
      const newSegment = modulesWithSegments
        ?.flatMap((module) => module.segments)
        .find((s) => s.id === currentSegmentId);
      if (newSegment && newSegment.slug !== segment.slug) {
        navigate({ to: "/learn/$slug", params: { slug: newSegment.slug } });
      }
    }
  }, [
    currentSegmentId,
    segment.id,
    segment.slug,
    modulesWithSegments,
    navigate,
    setCurrentSegmentId,
  ]);

  return (
    <div className="flex w-full">
      {/* Desktop Navigation */}
      <div className="hidden md:block w-80 flex-shrink-0">
        <DesktopNavigation
          modules={modulesWithSegments ?? []}
          currentSegmentId={segment.id}
          isAdmin={true}
          isPremium={isPremium}
        />
      </div>

      <div className="flex-1 w-full">
        {/* Mobile Navigation */}
        <MobileNavigation
          modules={modulesWithSegments ?? []}
          currentSegmentId={segment.id}
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
