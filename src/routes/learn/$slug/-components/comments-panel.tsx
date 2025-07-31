import { MessageSquare } from "lucide-react";
import { Suspense, useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { getCommentsQuery } from "~/lib/queries/comments";
import { CommentForm } from "./comment-form";
import { CommentList } from "./comment-list";

interface CommentsPanelProps {
  currentSegmentId: number;
  isLoggedIn: boolean;
  activeTab: "content" | "comments";
}

export function CommentsPanel({
  currentSegmentId,
  isLoggedIn,
  activeTab,
}: CommentsPanelProps) {
  // Check if there are existing comments to determine initial form visibility
  const { data: existingComments } = useQuery(
    getCommentsQuery(currentSegmentId)
  );
  const [showCommentForm, setShowCommentForm] = useState(
    () => (existingComments && existingComments.length > 0) || false
  );

  // Update form visibility when comments data changes
  useEffect(() => {
    if (existingComments && existingComments.length > 0) {
      setShowCommentForm(true);
    }
  }, [existingComments]);

  const onStartDiscussion = () => setShowCommentForm(true);

  return (
    <div className="animate-fade-in space-y-8">
      {/* Comment Form Section */}
      {showCommentForm && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-foreground flex items-center gap-2">
              <MessageSquare className="h-5 w-5 text-theme-600 dark:text-theme-400" />
              Join the Discussion
            </h3>
            {isLoggedIn && (
              <div className="text-sm text-muted-foreground">
                Share your thoughts
              </div>
            )}
          </div>
          <CommentForm
            autoFocus={showCommentForm && activeTab === "comments"}
          />
        </div>
      )}

      {/* Comments List Section */}
      <div className={showCommentForm ? "border-t border-border/60 pt-6" : ""}>
        <Suspense
          fallback={
            <div className="space-y-4">
              {/* Loading header */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="h-5 w-5 rounded bg-muted animate-pulse"></div>
                  <div className="h-5 w-24 rounded bg-muted animate-pulse"></div>
                </div>
                <div className="h-4 w-20 rounded bg-muted animate-pulse"></div>
              </div>

              {/* Loading comments */}
              {[1, 2, 3].map((i) => (
                <div key={i} className="module-card animate-pulse">
                  <div className="p-4">
                    <div className="flex gap-3">
                      <div className="h-10 w-10 rounded-full bg-muted"></div>
                      <div className="flex-1 space-y-2">
                        <div className="flex items-center gap-2">
                          <div className="h-4 w-24 rounded bg-muted"></div>
                          <div className="h-3 w-16 rounded bg-muted"></div>
                        </div>
                        <div className="space-y-1">
                          <div className="h-4 w-full rounded bg-muted"></div>
                          <div className="h-4 w-3/4 rounded bg-muted"></div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          }
        >
          <CommentList onStartDiscussion={onStartDiscussion} />
        </Suspense>
      </div>
    </div>
  );
}
