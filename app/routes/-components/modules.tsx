import { Link } from "@tanstack/react-router";
import { type Segment } from "~/db/schema";

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
      <div className="max-w-4xl mx-auto">
        <div className="space-y-12">
          {Object.entries(modules).map(([moduleId, moduleSegments]) => (
            <div key={moduleId}>
              <div className="mb-4">
                <div className="text-gray-500 dark:text-gray-400">
                  Module {moduleId}
                </div>
                <h2 className="text-3xl font-bold">
                  {moduleSegments[0]?.title.split(" - ")[0] ||
                    "Untitled Module"}
                </h2>
              </div>

              <div className="grid gap-4">
                {moduleSegments.map((segment) => (
                  <Link
                    key={segment.id}
                    to="/learn/$slug"
                    params={{ slug: segment.slug }}
                    className="bg-gray-900 hover:bg-gray-800 transition-colors p-4 rounded-lg flex justify-between items-center group"
                  >
                    <div>
                      <div className="text-gray-400 text-sm">
                        Video {segment.order}
                      </div>
                      <div className="text-white text-lg">{segment.title}</div>
                    </div>
                    {segment.videoKey && (
                      <div className="text-gray-400">3:40</div>
                    )}
                  </Link>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
