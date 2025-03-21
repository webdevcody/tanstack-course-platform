import { Link } from "@tanstack/react-router";
import { type Segment } from "~/db/schema";
import { Badge } from "~/components/ui/badge";
import { Lock } from "lucide-react";

export function ModulesSection({ segments }: { segments: Segment[] }) {
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

  return (
    <section className="py-16 px-6">
      <div className="max-w-6xl mx-auto">
        <div className="space-y-12">
          {Object.entries(modules).map(
            ([moduleId, moduleSegments], moduleIndex) => (
              <div key={moduleId}>
                <div className="mb-4">
                  <div className="text-gray-500 dark:text-gray-400">
                    Module {moduleIndex + 1}
                  </div>
                  <h2 className="text-3xl font-bold">
                    {moduleSegments[0]?.title.split(" - ")[0] ||
                      "Untitled Module"}
                  </h2>
                </div>

                <div className="grid gap-4 grid-cols-3">
                  {moduleSegments.map((segment, index) => (
                    <Link
                      key={segment.id}
                      to="/learn/$slug"
                      params={{ slug: segment.slug }}
                      className="bg-gray-900 hover:bg-gray-800 transition-colors p-4 rounded-lg flex justify-between items-center group"
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
                      {segment.videoKey && (
                        <Badge
                          variant="outline"
                          className="bg-gray-800 text-gray-400 border-gray-700"
                        >
                          3:40
                        </Badge>
                      )}
                    </Link>
                  ))}
                </div>
              </div>
            )
          )}
        </div>
      </div>
    </section>
  );
}
