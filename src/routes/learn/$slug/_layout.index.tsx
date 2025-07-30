import { createFileRoute, redirect } from "@tanstack/react-router";
import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { useEffect } from "react";
import { getSegmentBySlugUseCase } from "~/use-cases/segments";
import { getSegments } from "~/data-access/segments";
import { type Segment } from "~/db/schema";

import { VideoPlayer } from "~/routes/learn/-components/video-player";

import { Toaster } from "~/components/ui/toaster";

import { unauthenticatedMiddleware } from "~/lib/auth";
import { isAdminFn, isUserPremiumFn } from "~/fn/auth";
import { getAllProgressForUserUseCase } from "~/use-cases/progress";
import { useSegment } from "../-components/segment-context";
import { setLastWatchedSegment } from "~/utils/local-storage";

import { useAuth } from "~/hooks/use-auth";

import { getCommentsQuery } from "~/lib/queries/comments";
import { VideoHeader } from "./-components/video-header";
import { VideoControls } from "./-components/video-controls";
import { VideoContentTabsPanel } from "./-components/video-content-tabs-panel";
import { UpgradePlaceholder } from "./-components/upgrade-placeholder";
import { FloatingFeedbackButton } from "./-components/feedback-button";

export const Route = createFileRoute("/learn/$slug/_layout/")({
  component: RouteComponent,
  loader: async ({ context: { queryClient }, params }) => {
    const { segment, segments, progress } = await getSegmentInfoFn({
      data: { slug: params.slug },
    });
    queryClient.ensureQueryData(getCommentsQuery(segment.id));
    const isPremium = await isUserPremiumFn();
    const isAdmin = await isAdminFn();

    if (segments.length === 0) {
      throw redirect({ to: "/learn/no-segments" });
    }

    if (!segment) {
      throw redirect({ to: "/learn/not-found" });
    }

    return { segment, segments, progress, isPremium, isAdmin };
  },
});

export const getSegmentInfoFn = createServerFn()
  .middleware([unauthenticatedMiddleware])
  .validator(z.object({ slug: z.string() }))
  .handler(async ({ data, context }) => {
    const segment = await getSegmentBySlugUseCase(data.slug);
    const [segments, progress] = await Promise.all([
      getSegments(),
      context.userId ? getAllProgressForUserUseCase(context.userId) : [],
    ]);

    return { segment, segments, progress };
  });

function ViewSegment({
  segments,
  currentSegment,
  currentSegmentId,
  isPremium,
  isAdmin,
}: {
  segments: Segment[];
  currentSegment: Segment;
  currentSegmentId: number;
  isPremium: boolean;
  isAdmin: boolean;
}) {
  const { setCurrentSegmentId } = useSegment();

  useEffect(() => {
    setLastWatchedSegment(currentSegment.slug);
  }, [currentSegment.slug]);

  const user = useAuth();
  const isLoggedIn = !!user?.id;

  const showUpgradePanel = currentSegment.isPremium && !isPremium && !isAdmin;

  return (
    <div className="max-w-5xl mx-auto space-y-4">
      {/* Header Section */}
      <VideoHeader currentSegment={currentSegment} isAdmin={isAdmin} />

      {showUpgradePanel ? (
        <UpgradePlaceholder currentSegment={currentSegment} />
      ) : currentSegment.videoKey ? (
        <div className="relative">
          <div className="aspect-video rounded-xl overflow-hidden bg-gradient-to-br from-gray-900 to-gray-800 shadow-elevation-3 border border-gray-200 dark:border-gray-700">
            <VideoPlayer segmentId={currentSegment.id} />
          </div>
        </div>
      ) : null}

      {/* Navigation Section - Moved here after video */}
      <VideoControls
        currentSegmentId={currentSegmentId}
        segments={segments}
        isLoggedIn={isLoggedIn}
        setCurrentSegmentId={setCurrentSegmentId}
      />

      {/* Tabs Section */}
      <VideoContentTabsPanel
        currentSegment={currentSegment}
        isLoggedIn={isLoggedIn}
      />
    </div>
  );
}

function RouteComponent() {
  const { segment, segments, isPremium, isAdmin } = Route.useLoaderData();

  return (
    <>
      <ViewSegment
        segments={segments}
        currentSegment={segment}
        currentSegmentId={segment.id}
        isPremium={isPremium}
        isAdmin={isAdmin}
      />
      <FloatingFeedbackButton />
      <Toaster />
    </>
  );
}
