import { Badge } from "~/components/ui/badge";
import { BookOpen, Clock, Lock } from "lucide-react";
import { type Segment } from "~/db/schema";
import { AdminControls } from "./admin-controls";

interface VideoHeaderProps {
  currentSegment: Segment;
  isAdmin: boolean;
}

export function VideoHeader({ currentSegment, isAdmin }: VideoHeaderProps) {
  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-gradient-to-br from-theme-100 to-theme-200 dark:from-theme-900 dark:to-theme-800">
            <BookOpen className="h-6 w-6 text-theme-600 dark:text-theme-400" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-foreground leading-tight">
              {currentSegment.title}
            </h1>
            {currentSegment.length && (
              <p className="text-muted-foreground mt-1 flex items-center gap-2">
                <Clock className="h-4 w-4" />
                {currentSegment.length}
              </p>
            )}
          </div>
        </div>

        <div className="flex items-center gap-3">
          {isAdmin && currentSegment.isPremium && (
            <Badge
              variant="outline"
              className="bg-amber-50 dark:bg-amber-950 text-amber-700 dark:text-amber-300 border-amber-200 dark:border-amber-800 flex items-center gap-1"
            >
              <Lock className="w-3 h-3" />
              PREMIUM
            </Badge>
          )}

          {isAdmin && <AdminControls currentSegment={currentSegment} />}
        </div>
      </div>
    </div>
  );
}
