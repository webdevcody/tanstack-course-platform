import { Link } from "@tanstack/react-router";
import { type Segment } from "~/db/schema";
import { Badge } from "~/components/ui/badge";
import { Lock } from "lucide-react";
import { Stat } from "~/components/ui/stat";
import { useRef, useState } from "react";
import { createServerFn } from "@tanstack/react-start";
import { getModules } from "~/data-access/modules";
import { useQuery } from "@tanstack/react-query";

function formatDuration(durationInMinutes: number) {
  const hours = Math.floor(durationInMinutes / 60);
  const minutes = Math.round(durationInMinutes % 60);
  if (hours > 0) {
    return `${hours}h ${minutes}m`;
  }
  return `${minutes}m`;
}

function calculateDuration(segments: Segment[]) {
  return segments.reduce((acc, segment) => {
    if (!segment.length) return acc;
    const [minutes, seconds] = segment.length.split(":").map(Number);
    return acc + minutes + seconds / 60;
  }, 0);
}

export const getModulesFn = createServerFn().handler(async ({ context }) => {
  const modules = await getModules();
  return modules;
});

export function ModulesSection({ segments }: { segments: Segment[] }) {
  const [activeCard, setActiveCard] = useState<{
    id: string;
    position: { x: number; y: number };
  } | null>(null);

  // Create a map of refs outside the render loop
  const cardRefs = useRef<Map<string, HTMLAnchorElement>>(new Map());

  const handleMouseMove = (
    event: React.MouseEvent<HTMLAnchorElement>,
    segmentId: string
  ) => {
    const cardElement = cardRefs.current.get(segmentId);
    if (!cardElement) return;

    const rect = cardElement.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;
    setActiveCard({ id: segmentId, position: { x, y } });
  };

  const handleMouseLeave = () => {
    setActiveCard(null);
  };

  // Group segments by moduleId
  const modules = segments.reduce(
    (acc, segment) => {
      if (!acc[segment.moduleId]) {
        acc[segment.moduleId] = [];
      }
      acc[segment.moduleId].push(segment);
      return acc;
    },
    {} as Record<string, Segment[]>
  );

  // Sort segments within each module by order
  Object.keys(modules).forEach((moduleId) => {
    modules[moduleId].sort((a, b) => a.order - b.order);
  });

  const { data: moduleData } = useQuery({
    queryKey: ["modules"],
    queryFn: getModulesFn,
  });

  const moduleEntries = Object.entries(modules);

  // Calculate total duration
  const totalDurationMinutes = calculateDuration(segments);
  const formattedTotalDuration = formatDuration(totalDurationMinutes);

  return (
    <section className="relative py-32 px-6">
      {/* Enhanced background effects */}
      <div className="absolute inset-0 bg-gradient-to-b from-gray-900/0 via-theme-950/10 to-gray-900/0 pointer-events-none" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(74,222,128,0.05)_0%,transparent_65%)] pointer-events-none" />

      {/* Decorative elements */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2">
        <div className="w-px h-24 bg-gradient-to-b from-theme-500/0 via-theme-500/30 to-theme-500/0" />
        <div className="w-3 h-3 rounded-full bg-theme-500/30 blur-sm -translate-x-1/2" />
      </div>

      {/* Course Introduction - More dynamic styling */}
      <div className="max-w-6xl mx-auto mb-20 text-center relative">
        <div className="space-y-6">
          <div className="inline-block animate-fade-in">
            <span className="px-4 py-1.5 rounded-full text-sm font-medium bg-theme-950/60 text-theme-400 border border-theme-800/50 shadow-lg shadow-theme-900/20">
              20 Beginner-Friendly Challenges
            </span>
          </div>

          <h1 className="text-6xl font-bold tracking-tight">
            <span className="inline-block bg-gradient-to-r from-white via-white to-gray-300 bg-clip-text text-transparent">
              Master React Through
            </span>
            <br />
            <span className="inline-block bg-gradient-to-r from-gray-300 to-gray-400 bg-clip-text text-transparent">
              Hands-On Practice
            </span>
          </h1>

          <p className="text-gray-300 text-xl max-w-2xl mx-auto leading-relaxed">
            Each challenge is designed to help you learn React by building real
            projects. From simple utilities to interactive games, you'll develop
            practical skills while having fun.
          </p>
        </div>
      </div>

      {/* Enhanced stats banner */}
      <div className="max-w-6xl mx-auto mb-24">
        <div className="relative">
          {/* Animated glowing background effect */}
          <div className="absolute -inset-px rounded-2xl bg-gradient-to-r from-theme-500/20 via-theme-500/10 to-theme-500/20 blur-lg opacity-50 animate-pulse" />
          <div className="absolute -inset-px rounded-2xl bg-gradient-to-r from-theme-500/0 via-theme-500/20 to-theme-500/0 animate-shimmer" />

          <div className="relative grid grid-cols-2 gap-8 p-10 bg-gradient-to-b from-gray-800/90 to-gray-900/90 backdrop-blur-xl rounded-2xl border border-theme-500/20">
            {/* <Stat label="Students Enrolled" value="2,547+" /> */}
            <Stat label="Total Duration" value={formattedTotalDuration} />
            <Stat label="Total Lessons" value={`${segments.length}`} />
          </div>
        </div>
      </div>

      {/* Module cards section with enhanced header */}
      <div className="max-w-6xl mx-auto">
        <div className="mb-12 text-center">
          <h2 className="text-3xl font-bold mb-4 bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
            Course Curriculum
          </h2>
          <p className="text-gray-300 text-lg max-w-2xl mx-auto">
            Each module contains bite-sized video lessons with hands-on
            exercises to reinforce your learning. Follow our structured path to
            success.
          </p>
        </div>

        <div className="grid gap-8">
          {moduleEntries.map(([moduleId, moduleSegments]) => {
            const moduleDurationMinutes = calculateDuration(moduleSegments);
            const formattedModuleDuration = formatDuration(
              moduleDurationMinutes
            );
            const isActive = activeCard?.id === moduleId;

            return (
              <div key={moduleId} className="group/module relative">
                {/* Card content */}
                <div className="relative bg-gray-800/50 rounded-2xl p-6 hover:bg-gray-800/30 transition-colors overflow-hidden border border-white/[0.08]">
                  <div className="absolute inset-0 bg-gray-900/60 backdrop-blur-[1px] transition-colors group-hover/module:bg-gray-900/50" />

                  {/* Content container */}
                  <div className="relative z-10">
                    {/* Module header with expanded info */}
                    <div className="flex items-center justify-between mb-6">
                      <div>
                        <h2 className="text-2xl font-bold mb-2">
                          {
                            moduleData?.find((m) => m.id === Number(moduleId))
                              ?.title
                          }
                        </h2>
                        <div className="flex items-center gap-4 text-sm text-gray-300">
                          <span>{moduleSegments.length} lessons</span>
                          <span>•</span>
                          <span>{formattedModuleDuration}</span>
                        </div>
                      </div>
                      <Link
                        to="/learn/$slug"
                        params={{ slug: moduleSegments[0]?.slug }}
                        className="px-4 py-2 bg-theme-700 text-white font-medium rounded-lg hover:bg-theme-800 transition-colors"
                      >
                        Start Module
                      </Link>
                    </div>

                    {/* Preview grid with hover effects */}
                    <div className="grid gap-4 grid-cols-3">
                      {moduleSegments.map((segment, index) => {
                        const isActive =
                          activeCard?.id === segment.id.toString();

                        return (
                          <Link
                            key={segment.id}
                            ref={(el) => {
                              if (el)
                                cardRefs.current.set(segment.id.toString(), el);
                              else
                                cardRefs.current.delete(segment.id.toString());
                            }}
                            onMouseMove={(e) =>
                              handleMouseMove(e, segment.id.toString())
                            }
                            onMouseLeave={handleMouseLeave}
                            to="/learn/$slug"
                            params={{ slug: segment.slug }}
                            className="bg-gray-900/95 hover:bg-gray-800/95 transition-colors p-4 rounded-lg flex justify-between items-center group/card border border-gray-800"
                            style={{
                              background:
                                isActive && activeCard?.position
                                  ? `radial-gradient(400px circle at ${activeCard.position.x}px ${activeCard.position.y}px, 
                                      rgba(74,222,128,0.08),
                                      rgba(74,222,128,0.06) 20%,
                                      rgba(74,222,128,0.04) 30%,
                                      transparent 50%
                                    )`
                                  : "",
                            }}
                          >
                            <div>
                              <div className="text-gray-300 text-sm">
                                Video {index + 1}
                              </div>
                              <div className="text-white text-lg flex items-center gap-2">
                                {segment.title}
                                {!segment.isPremium ? (
                                  <Badge
                                    variant="outline"
                                    className="bg-theme-950 text-theme-300 border-theme-800"
                                  >
                                    FREE
                                  </Badge>
                                ) : (
                                  <Badge
                                    variant="outline"
                                    className="bg-amber-950 text-amber-300 border-amber-800 flex items-center gap-1"
                                  >
                                    <Lock className="w-3 h-3" />
                                    PREMIUM
                                  </Badge>
                                )}
                              </div>
                            </div>
                          </Link>
                        );
                      })}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}

          {/* Total Modules Value Proposition Card */}
          <div className="relative z-10 flex flex-col items-center justify-center py-12 text-center">
            <div className="text-4xl font-bold text-theme-400 mb-2">
              {Object.keys(modules).length} Total Modules
            </div>
            <p className="text-gray-300 mb-6 max-w-md">
              Start learning React with my curriculum of{" "}
              {Object.keys(modules).length} comprehensive modules,{" "}
              {segments.length} video lessons, and{" "}
              {formatDuration(calculateDuration(segments))} of expert-led
              content.
            </p>
            <Link
              to="/learn/$slug"
              params={{ slug: segments[0]?.slug }}
              className="px-6 py-3 bg-theme-500 text-white font-medium rounded-lg hover:bg-theme-600 transition-colors inline-flex items-center gap-2"
            >
              Start Watching Now
              <svg
                className="w-4 h-4"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M5 12H19M19 12L12 5M19 12L12 19"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
