import { Button } from "~/components/ui/button";
import { Link } from "@tanstack/react-router";
import { useContinueSlug } from "~/hooks/use-continue-slug";
import { createServerFn } from "@tanstack/react-start";
import { getSegments } from "~/data-access/segments";
import { VideoPlayer } from "~/routes/learn/-components/video-player";
import { useQuery } from "@tanstack/react-query";

const getFirstVideoSegmentFn = createServerFn().handler(async () => {
  const segments = await getSegments();
  // Find the first segment that has a video
  const firstVideoSegment = segments
    .sort((a, b) => a.order - b.order)
    .find((segment) => segment.videoKey);
  return firstVideoSegment;
});

export function HeroSection() {
  const continueSlug = useContinueSlug();

  const { data: firstVideoSegment } = useQuery({
    queryKey: ["first-video-segment"],
    queryFn: () => getFirstVideoSegmentFn(),
  });

  return (
    <section className="relative h-screen overflow-hidden w-full">
      {/* Modern gradient background */}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-blue-900/20 to-slate-800"></div>

      {/* Subtle pattern overlay */}
      <div className="absolute inset-0 opacity-5">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `radial-gradient(circle at 25% 25%, #64748b 1px, transparent 1px),
                           radial-gradient(circle at 75% 75%, #64748b 1px, transparent 1px)`,
            backgroundSize: "50px 50px",
          }}
        ></div>
      </div>

      {/* Floating background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-theme-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 w-64 h-64 bg-purple-500/5 rounded-full blur-3xl animate-pulse delay-500"></div>
      </div>

      {/* Content */}
      <div className="relative z-10 h-full">
        <div className="container mx-auto h-full px-6 lg:px-12">
          <div className="flex items-center h-full">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 w-full items-center">
              {/* Left side - Content */}
              <div className="max-w-2xl">
                {/* Badge */}
                <div className="inline-flex items-center px-4 py-2 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 text-theme-400 text-sm font-medium mb-8">
                  <span className="w-2 h-2 bg-theme-400 rounded-full mr-2 animate-pulse"></span>
                  React Mastery Course
                </div>

                <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold mb-8 text-white leading-tight">
                  20{" "}
                  <span className="text-transparent bg-gradient-to-r from-theme-400 to-theme-300 bg-clip-text">
                    Beginner
                  </span>{" "}
                  React
                  <br />
                  <span className="text-transparent bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text">
                    Challenges
                  </span>
                </h1>

                <p className="text-xl text-slate-300 mb-12 leading-relaxed max-w-xl">
                  Master React through hands-on practice with 20 engaging
                  challenges. From building a Connect Four game to crafting a
                  Quote Generator, you'll learn to solve real-world React
                  problems by breaking them down into manageable pieces.
                </p>

                <div className="flex flex-col sm:flex-row gap-4">
                  <Link to="/purchase">
                    <Button
                      size="lg"
                      className="bg-gradient-to-r from-theme-500 to-theme-400 hover:from-theme-600 hover:to-theme-500 text-black font-semibold w-full sm:w-auto px-8 py-4 text-lg rounded-xl shadow-lg shadow-theme-500/25 transition-all duration-300 hover:shadow-xl hover:shadow-theme-500/40 hover:scale-[1.02]"
                    >
                      Buy Now
                    </Button>
                  </Link>
                  <Link to={"/learn/$slug"} params={{ slug: continueSlug }}>
                    <Button
                      size="lg"
                      variant="outline"
                      className="w-full sm:w-auto px-8 py-4 text-lg rounded-xl bg-white/5 backdrop-blur-sm border-white/20 text-white hover:bg-white/10 hover:border-white/30 transition-all duration-300 hover:scale-[1.02]"
                    >
                      Continue Learning
                    </Button>
                  </Link>
                </div>

                {/* Stats */}
                <div className="flex items-center gap-8 mt-12 pt-8 border-t border-white/10">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-white">20</div>
                    <div className="text-sm text-slate-400">Challenges</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-white">6+</div>
                    <div className="text-sm text-slate-400">Hours Content</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-white">∞</div>
                    <div className="text-sm text-slate-400">Learning</div>
                  </div>
                </div>
              </div>

              {/* Right side - Video player */}
              <div className="flex items-center justify-center lg:justify-end">
                {firstVideoSegment && (
                  <div className="w-full max-w-lg lg:max-w-xl">
                    {/* Video container with glass morphism effect */}
                    <div className="relative p-1 rounded-2xl bg-gradient-to-br from-white/20 via-white/10 to-white/5 backdrop-blur-sm">
                      <div className="rounded-xl overflow-hidden bg-black/20 backdrop-blur-sm shadow-2xl">
                        <VideoPlayer segmentId={firstVideoSegment.id} />
                      </div>

                      {/* Decorative elements */}
                      <div className="absolute -top-4 -right-4 w-8 h-8 bg-theme-400/30 rounded-full blur-sm"></div>
                      <div className="absolute -bottom-4 -left-4 w-6 h-6 bg-blue-400/30 rounded-full blur-sm"></div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom gradient fade */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-slate-900 to-transparent"></div>
    </section>
  );
}
