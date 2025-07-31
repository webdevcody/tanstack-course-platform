import { Button } from "~/components/ui/button";
import { ArrowRight, CheckCircle } from "lucide-react";
import { useNavigate } from "@tanstack/react-router";
import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { type Segment } from "~/db/schema";
import { authenticatedMiddleware } from "~/lib/auth";
import { markAsWatchedUseCase } from "~/use-cases/progress";
import { useMemo } from "react";

export const markedAsWatchedFn = createServerFn()
  .middleware([authenticatedMiddleware])
  .validator(z.object({ segmentId: z.coerce.number() }))
  .handler(async ({ data, context }) => {
    await markAsWatchedUseCase(context.userId, data.segmentId);
  });

interface VideoControlsProps {
  currentSegmentId: number;
  segments: Segment[];
  isLoggedIn: boolean;
  setCurrentSegmentId: (id: number) => void;
}

export function VideoControls({
  currentSegmentId,
  segments,
  isLoggedIn,
  setCurrentSegmentId,
}: VideoControlsProps) {
  const navigate = useNavigate();

  const nextSegment = useMemo(() => {
    // Add safety check for segments
    if (!segments || !Array.isArray(segments) || segments.length === 0) {
      return null;
    }

    // Find the current module and segment index
    const currentModule = segments.find(
      (segment) => segment.id === currentSegmentId
    )?.moduleId;
    if (!currentModule) return null;

    // Get all segments in the current module and sort by order
    const currentModuleSegments = segments
      .filter((s) => s.moduleId === currentModule)
      .sort((a, b) => a.order - b.order);
    const currentIndex = currentModuleSegments.findIndex(
      (s) => s.id === currentSegmentId
    );

    // If there's a next segment in the current module
    if (currentIndex < currentModuleSegments.length - 1) {
      return currentModuleSegments[currentIndex + 1];
    }

    // If we're at the end of the current module, find the next module
    const modules = segments.reduce(
      (acc, segment) => {
        if (!acc[segment.moduleId]) {
          acc[segment.moduleId] = [];
        }
        acc[segment.moduleId].push(segment);
        return acc;
      },
      {} as Record<number, typeof segments>
    );

    // Sort segments within each module by order
    Object.keys(modules).forEach((moduleId) => {
      modules[Number(moduleId)].sort((a, b) => a.order - b.order);
    });

    const moduleIds = Object.keys(modules)
      .map(Number)
      .sort((a, b) => a - b);
    const currentModuleIndex = moduleIds.indexOf(currentModule);

    // If there's a next module
    if (currentModuleIndex < moduleIds.length - 1) {
      const nextModuleId = moduleIds[currentModuleIndex + 1];
      return modules[nextModuleId][0]; // Return first segment of next module
    }

    return null;
  }, [currentSegmentId, segments]);

  const previousSegment = useMemo(() => {
    // Add safety check for segments
    if (!segments || !Array.isArray(segments) || segments.length === 0) {
      return null;
    }

    // Find the current module and segment index
    const currentModule = segments.find(
      (segment) => segment.id === currentSegmentId
    )?.moduleId;
    if (!currentModule) return null;

    // Get all segments in the current module and sort by order
    const currentModuleSegments = segments
      .filter((s) => s.moduleId === currentModule)
      .sort((a, b) => a.order - b.order);
    const currentIndex = currentModuleSegments.findIndex(
      (s) => s.id === currentSegmentId
    );

    // If there's a previous segment in the current module
    if (currentIndex > 0) {
      return currentModuleSegments[currentIndex - 1];
    }

    // If we're at the start of the current module, find the previous module
    const modules = segments.reduce(
      (acc, segment) => {
        if (!acc[segment.moduleId]) {
          acc[segment.moduleId] = [];
        }
        acc[segment.moduleId].push(segment);
        return acc;
      },
      {} as Record<number, typeof segments>
    );

    // Sort segments within each module by order
    Object.keys(modules).forEach((moduleId) => {
      modules[Number(moduleId)].sort((a, b) => a.order - b.order);
    });

    const moduleIds = Object.keys(modules)
      .map(Number)
      .sort((a, b) => a - b);
    const currentModuleIndex = moduleIds.indexOf(currentModule);

    // If there's a previous module
    if (currentModuleIndex > 0) {
      const prevModuleId = moduleIds[currentModuleIndex - 1];
      const prevModuleSegments = modules[prevModuleId];
      return prevModuleSegments[prevModuleSegments.length - 1]; // Return last segment of previous module
    }

    return null;
  }, [currentSegmentId, segments]);

  const isLastSegment = !nextSegment;
  const isFirstSegment = !previousSegment;

  return (
    <div className="flex justify-between items-center gap-4 mb-8">
      <Button
        disabled={isFirstSegment}
        onClick={() => {
          if (previousSegment) {
            setCurrentSegmentId(previousSegment.id);
          }
        }}
      >
        <ArrowRight className="h-4 w-4 rotate-180" />
        Previous Lesson
      </Button>

      <Button
        onClick={async () => {
          if (isLoggedIn) {
            await markedAsWatchedFn({
              data: { segmentId: currentSegmentId },
            });
          }

          if (isLastSegment) {
            navigate({ to: "/learn/course-completed" });
          } else if (nextSegment) {
            setCurrentSegmentId(nextSegment.id);
          }
        }}
      >
        {isLastSegment ? (
          <>
            Complete Course
            <CheckCircle className="ml-2 h-4 w-4" />
          </>
        ) : (
          <>
            Next Video
            <ArrowRight className="ml-2 h-4 w-4" />
          </>
        )}
      </Button>
    </div>
  );
}
