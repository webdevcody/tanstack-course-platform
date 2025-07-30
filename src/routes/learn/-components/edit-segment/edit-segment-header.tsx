import { useRouter } from "@tanstack/react-router";
import { Button } from "~/components/ui/button";
import { ChevronLeft, Edit, Sparkles } from "lucide-react";

export function EditSegmentHeader() {
  const router = useRouter();

  return (
    <div className="border-b bg-gradient-to-r from-background via-background to-background/95 backdrop-blur-xl supports-[backdrop-filter]:bg-background/80 sticky top-0 z-10 animate-fade-in">
      {/* Subtle gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-r from-theme-500/5 via-transparent to-theme-600/5 pointer-events-none" />

      <div className="mx-auto container relative flex h-20 items-center justify-between">
        <div className="flex items-center gap-6">
          <Button
            variant="ghost"
            onClick={() => router.history.back()}
            className="text-theme-600 dark:text-theme-400"
          >
            <ChevronLeft className="h-4 w-4 group-hover:-translate-x-0.5 transition-transform duration-200" />
            Back to Course
          </Button>

          <div className="h-8 w-px bg-gradient-to-b from-transparent via-border to-transparent" />

          <div className="flex items-center gap-4">
            <div className="relative">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-theme-50 to-theme-100 dark:from-theme-950/50 dark:to-theme-900/50 border border-theme-200/60 dark:border-theme-800/60 shadow-elevation-2">
                <Edit className="h-5 w-5 text-theme-600 dark:text-theme-400" />
              </div>
              <div className="absolute -top-1 -right-1 h-3 w-3 rounded-full bg-gradient-to-r from-theme-400 to-theme-500 animate-pulse" />
            </div>
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-bold text-gradient">
                  Edit Content
                </h2>
                <Sparkles className="h-4 w-4 text-theme-500 animate-pulse" />
              </div>
              <p className="text-sm text-muted-foreground">
                Update and enhance your learning segment
              </p>
            </div>
          </div>
        </div>

        {/* Decorative elements */}
        <div className="hidden lg:flex items-center gap-3">
          <div className="h-2 w-2 rounded-full bg-theme-400 animate-pulse" />
          <div
            className="h-1.5 w-1.5 rounded-full bg-theme-500 animate-pulse"
            style={{ animationDelay: "0.5s" }}
          />
          <div
            className="h-1 w-1 rounded-full bg-theme-600 animate-pulse"
            style={{ animationDelay: "1s" }}
          />
        </div>
      </div>

      {/* Bottom border with gradient */}
      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-theme-500/20 to-transparent" />
    </div>
  );
}
