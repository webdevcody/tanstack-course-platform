import { useState } from "react";
import { FileText, MessageSquare } from "lucide-react";
import { cn } from "~/lib/utils";
import { type Segment } from "~/db/schema";
import { ContentPanel } from "./content-panel";
import { CommentsPanel } from "./comments-panel";

interface VideoContentTabsPanelProps {
  currentSegment: Segment;
  isLoggedIn: boolean;
}

export function VideoContentTabsPanel({
  currentSegment,
  isLoggedIn,
}: VideoContentTabsPanelProps) {
  const [activeTab, setActiveTab] = useState<"content" | "comments">("content");

  return (
    <div className="module-card overflow-hidden">
      {/* Tab Headers */}
      <div className="flex border-b border-gray-200 dark:border-gray-700">
        <button
          onClick={() => setActiveTab("content")}
          className={cn(
            "flex items-center gap-2 px-6 py-4 text-sm font-medium transition-all duration-200 border-b-2 cursor-pointer",
            activeTab === "content"
              ? "border-theme-500 text-theme-600 dark:text-theme-400 bg-theme-50 dark:bg-theme-950/30"
              : "border-transparent text-muted-foreground hover:text-foreground hover:bg-muted/50"
          )}
        >
          <FileText className="h-4 w-4" />
          Lesson Content
        </button>
        <button
          onClick={() => setActiveTab("comments")}
          className={cn(
            "flex items-center gap-2 px-6 py-4 text-sm font-medium transition-all duration-200 border-b-2 cursor-pointer",
            activeTab === "comments"
              ? "border-theme-500 text-theme-600 dark:text-theme-400 bg-theme-50 dark:bg-theme-950/30"
              : "border-transparent text-muted-foreground hover:text-foreground hover:bg-muted/50"
          )}
        >
          <MessageSquare className="h-4 w-4" />
          Discussion
        </button>
      </div>

      {/* Tab Content */}
      <div className="p-6">
        {activeTab === "content" && (
          <ContentPanel currentSegment={currentSegment} />
        )}

        {activeTab === "comments" && (
          <CommentsPanel
            currentSegmentId={currentSegment.id}
            isLoggedIn={isLoggedIn}
            activeTab={activeTab}
          />
        )}
      </div>
    </div>
  );
}
