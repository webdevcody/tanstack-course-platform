import { Button } from "~/components/ui/button";
import { Link } from "@tanstack/react-router";
import { useContinueSlug } from "~/hooks/use-continue-slug";
import { createServerFn } from "@tanstack/react-start";
import { getSegments } from "~/data-access/segments";
import { VideoPlayer } from "~/routes/learn/-components/video-player";
import { useQuery } from "@tanstack/react-query";
import { ArrowRight, ShoppingCart } from "lucide-react";

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
      {/* Modern gradient background - using theme colors */}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-slate-800 to-gray-900"></div>

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

      {/* Floating background elements - using theme colors */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-theme-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-theme-400/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 w-64 h-64 bg-theme-600/5 rounded-full blur-3xl animate-pulse delay-500"></div>
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
                  20 <span className="text-gradient">Beginner</span> React
                  <br />
                  <span className="text-gradient">Challenges</span>
                </h1>

                <p className="text-xl text-slate-300 mb-12 leading-relaxed max-w-xl">
                  Master React through hands-on practice with 20 engaging
                  challenges. From building a Connect Four game to crafting a
                  Quote Generator, you'll learn to solve real-world React
                  problems by breaking them down into manageable pieces.
                </p>

                <div className="flex flex-col sm:flex-row gap-4">
                  <Link to="/purchase">
                    <Button variant={"secondary"} size="lg">
                      <ShoppingCart className="mr-2 h-4 w-4" />
                      Buy Now
                    </Button>
                  </Link>
                  <Link to={"/learn/$slug"} params={{ slug: continueSlug }}>
                    <Button size="lg">
                      Continue Learning
                      <ArrowRight className="ml-2 h-4 w-4" />
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
                      <div className="rounded-xl overflow-hidden bg-black/20 backdrop-blur-sm shadow-elevation-3">
                        <VideoPlayer segmentId={firstVideoSegment.id} />
                      </div>

                      {/* Decorative elements - using theme colors */}
                      <div className="absolute -top-4 -right-4 w-8 h-8 bg-theme-400/30 rounded-full blur-sm"></div>
                      <div className="absolute -bottom-4 -left-4 w-6 h-6 bg-theme-500/30 rounded-full blur-sm"></div>
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
