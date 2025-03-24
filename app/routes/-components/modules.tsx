import { Link } from "@tanstack/react-router";
import { type Segment } from "~/db/schema";
import { Badge } from "~/components/ui/badge";
import { Lock } from "lucide-react";
import { Stat } from "~/components/ui/stat";
import { useRef, useState } from "react";

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

export function ModulesSection({ segments }: { segments: Segment[] }) {
  const [activeCard, setActiveCard] = useState<{
    id: string;
    position: { x: number; y: number };
  } | null>(null);

  const handleMouseMove = (
    event: React.MouseEvent<HTMLDivElement>,
    cardElement: HTMLDivElement,
    moduleId: string
  ) => {
    const rect = cardElement.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;
    setActiveCard({ id: moduleId, position: { x, y } });
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

  // Calculate total duration
  const totalDurationMinutes = calculateDuration(segments);
  const formattedTotalDuration = formatDuration(totalDurationMinutes);

  return (
    <section className="py-16 px-6">
      {/* Course stats banner */}
      <div className="max-w-6xl mx-auto mb-16">
        <div className="grid grid-cols-3 gap-8 p-6 bg-gray-800/50 backdrop-blur-sm rounded-2xl border border-gray-700/50">
          <Stat label="Students Enrolled" value="2,547+" />
          <Stat label="Total Duration" value={formattedTotalDuration} />
          <Stat label="Total Lessons" value={`${segments.length}`} />
        </div>
      </div>

      {/* Module cards with rich preview */}
      <div className="max-w-6xl mx-auto grid gap-8">
        {Object.entries(modules).map(([moduleId, moduleSegments]) => {
          const moduleDurationMinutes = calculateDuration(moduleSegments);
          const formattedModuleDuration = formatDuration(moduleDurationMinutes);
          const cardRef = useRef<HTMLDivElement>(null);
          const isActive = activeCard?.id === moduleId;

          return (
            <div key={moduleId} className="group/module relative">
              {/* Animated border effect */}
              <div className="absolute -inset-[1px] bg-gradient-to-r from-emerald-600/0 via-emerald-600/40 to-emerald-600/0 rounded-2xl opacity-0 group-hover/module:opacity-100 blur-xl transition-opacity duration-500 pointer-events-none" />
              <div
                className="absolute -inset-[1px] bg-gradient-to-r from-emerald-600/0 via-emerald-600/30 to-emerald-600/0 rounded-2xl opacity-0 group-hover/module:opacity-100 animate-[border-flow_4s_ease_infinite] pointer-events-none"
                style={{ backgroundSize: "200% 100%" }}
              />

              {/* Card content */}
              <div
                ref={cardRef}
                onMouseMove={(e) =>
                  cardRef.current &&
                  handleMouseMove(e, cardRef.current, moduleId)
                }
                onMouseLeave={handleMouseLeave}
                className="relative bg-gray-800/50 rounded-2xl p-6 hover:bg-gray-800/30 transition-colors overflow-hidden border border-white/[0.08]"
                style={{
                  background:
                    isActive && activeCard.position
                      ? `radial-gradient(800px circle at ${activeCard.position.x}px ${activeCard.position.y}px, 
                          rgba(52,211,153,0.15),
                          rgba(16,185,129,0.1) 20%,
                          rgba(6,78,59,0.1) 30%,
                          transparent 50%
                        )`
                      : "",
                }}
              >
                <div className="absolute inset-0 bg-gray-800/30 backdrop-blur-[1px] transition-colors group-hover/module:bg-gray-800/20" />

                {/* Content container */}
                <div className="relative z-10 backdrop-blur-[0.5px]">
                  {/* Module header with expanded info */}
                  <div className="flex items-center justify-between mb-6">
                    <div>
                      <h2 className="text-2xl font-bold mb-2">
                        {moduleSegments[0]?.title.split(" - ")[0]}
                      </h2>
                      <div className="flex items-center gap-4 text-sm text-gray-400">
                        <span>{moduleSegments.length} lessons</span>
                        <span>•</span>
                        <span>{formattedModuleDuration}</span>
                      </div>
                    </div>
                    <Link
                      to="/learn/$slug"
                      params={{ slug: moduleSegments[0]?.slug }}
                      className="px-4 py-2 bg-emerald-500 rounded-lg hover:bg-emerald-600 transition-colors"
                    >
                      Start Module
                    </Link>
                  </div>

                  {/* Preview grid with hover effects */}
                  <div className="grid gap-4 grid-cols-3">
                    {moduleSegments.map((segment, index) => (
                      <Link
                        key={segment.id}
                        to="/learn/$slug"
                        params={{ slug: segment.slug }}
                        className="bg-gray-900 hover:bg-gray-800 transition-colors p-4 rounded-lg flex justify-between items-center group/card"
                      >
                        <div>
                          <div className="text-gray-400 text-sm">
                            Video {index + 1}
                          </div>
                          <div className="text-white text-lg flex items-center gap-2">
                            {segment.title}
                            {!segment.isPremium ? (
                              <Badge
                                variant="outline"
                                className="bg-emerald-500/10 text-emerald-500 border-emerald-500/20"
                              >
                                FREE
                              </Badge>
                            ) : (
                              <Badge
                                variant="outline"
                                className="bg-amber-500/10 text-amber-500 border-amber-500/20 flex items-center gap-1"
                              >
                                <Lock className="w-3 h-3" />
                                PREMIUM
                              </Badge>
                            )}
                          </div>
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
