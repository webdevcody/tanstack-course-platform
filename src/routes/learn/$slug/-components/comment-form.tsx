import React, { useState, useRef, useEffect } from "react";
import { Button } from "~/components/ui/button";
import { Textarea } from "~/components/ui/textarea";
import { useAuth } from "~/hooks/use-auth";
import { useLoaderData } from "@tanstack/react-router";
import { useCreateComment } from "~/hooks/mutations/use-create-comment";
import { toast } from "~/hooks/use-toast";
import { Send, MessageSquarePlus, Sparkles } from "lucide-react";
import { useProfile } from "~/hooks/use-profile";

export function CommentForm({ autoFocus = false }: { autoFocus?: boolean }) {
  const [commentText, setCommentText] = useState("");
  const [isFocused, setIsFocused] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const user = useAuth();
  const { segment } = useLoaderData({ from: "/learn/$slug/_layout/" });
  const { mutate: createComment, isPending } = useCreateComment();
  const { data: profile } = useProfile();

  // Auto-resize textarea
  const adjustTextareaHeight = () => {
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.style.height = "auto";
      textarea.style.height = `${textarea.scrollHeight}px`;
    }
  };

  useEffect(() => {
    adjustTextareaHeight();
  }, [commentText]);

  // Auto-focus when autoFocus prop is true
  useEffect(() => {
    if (autoFocus && textareaRef.current) {
      setTimeout(() => {
        textareaRef.current?.focus();
        setIsFocused(true);
      }, 100); // Small delay to ensure smooth animation
    }
  }, [autoFocus]);

  const handleSubmit = () => {
    if (!commentText.trim()) return;

    createComment(
      {
        segmentId: segment.id,
        content: commentText.trim(),
        parentId: null,
        repliedToId: null,
      },
      {
        onSuccess: () => {
          setCommentText("");
          setIsFocused(false);
          toast({
            title: "Comment posted! 🎉",
            description: "Your comment has been added to the discussion.",
          });
        },
        onError: () => {
          toast({
            title: "Something went wrong",
            description:
              "We couldn't post your comment. Please try again or contact support.",
            variant: "destructive",
          });
        },
      }
    );
  };

  const handleCancel = () => {
    setCommentText("");
    setIsFocused(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  const handleFocus = () => {
    setIsFocused(true);
  };

  if (!user) {
    return (
      <div className="module-card border-dashed border-2 border-theme-200 dark:border-theme-800">
        <div className="p-6 text-center">
          <div className="flex justify-center mb-3">
            <div className="p-2 rounded-lg bg-gradient-to-br from-theme-100 to-theme-200 dark:from-theme-900 dark:to-theme-800">
              <MessageSquarePlus className="h-5 w-5 text-theme-600 dark:text-theme-400" />
            </div>
          </div>
          <h4 className="font-medium text-foreground mb-1">
            Join the conversation
          </h4>
          <p className="text-sm text-muted-foreground">
            Sign in to share your thoughts and connect with other learners
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="relative">
        <div
          className={`module-card transition-all duration-300 ${
            isFocused
              ? "ring-2 ring-theme-500/30 border-theme-300 dark:border-theme-700 shadow-elevation-3"
              : "border-border hover:border-theme-200 dark:hover:border-theme-800"
          }`}
        >
          <div className="p-4">
            <div className="flex items-start gap-3">
              {/* User Avatar */}
              <div
                className={`flex shrink-0 size-10 rounded-full overflow-hidden bg-gradient-to-br from-theme-100 to-theme-200 dark:from-theme-800 dark:to-theme-700 shadow-elevation-1 transition-all duration-200 ${
                  isFocused ? "ring-2 ring-theme-500/20" : ""
                }`}
              >
                <img
                  className="max-h-10 w-auto object-cover"
                  src={
                    profile?.image ??
                    `https://api.dicebear.com/9.x/initials/svg?seed=${profile?.displayName || "user"}&backgroundColor=6366f1&textColor=ffffff`
                  }
                  alt="Your avatar"
                />
              </div>

              <div className="flex-1 space-y-3">
                {/* Textarea Container */}
                <div className="relative">
                  <Textarea
                    ref={textareaRef}
                    placeholder={
                      isFocused
                        ? "Share your thoughts, ask a question, or help others understand..."
                        : ""
                    }
                    value={commentText}
                    onChange={(e) => setCommentText(e.target.value)}
                    onKeyDown={handleKeyDown}
                    onFocus={handleFocus}
                    className={`min-h-[44px] max-h-40 resize-none border-0 p-0 text-base placeholder:text-muted-foreground/70 focus-visible:ring-0 transition-all duration-300 ${
                      isFocused ? "min-h-[100px]" : ""
                    }`}
                    style={{ height: "auto" }}
                    disabled={isPending}
                  />

                  {/* Floating placeholder icon */}
                  {!isFocused && !commentText && (
                    <div className="absolute left-0 top-3 flex items-center gap-2 text-muted-foreground/60 pointer-events-none transition-opacity duration-200">
                      <MessageSquarePlus className="h-4 w-4" />
                      <span className="text-base">Add a comment</span>
                    </div>
                  )}

                  {/* Character count and actions */}
                  {(isFocused || commentText) && (
                    <div className="flex justify-between items-center pt-3 border-t border-border/60">
                      <div className="text-xs text-muted-foreground space-y-1">
                        <div className="flex items-center gap-3">
                          <span>
                            Press{" "}
                            <kbd className="px-1.5 py-0.5 text-xs font-mono bg-muted/60 rounded border">
                              Enter
                            </kbd>{" "}
                            to post
                          </span>
                          <span>
                            <kbd className="px-1.5 py-0.5 text-xs font-mono bg-muted/60 rounded border">
                              Shift+Enter
                            </kbd>{" "}
                            for new line
                          </span>
                        </div>
                        {commentText.length > 0 && (
                          <div className="text-xs text-muted-foreground/80">
                            {commentText.length} characters
                          </div>
                        )}
                      </div>

                      <div className="flex gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={handleCancel}
                          className="text-muted-foreground hover:text-foreground transition-colors"
                        >
                          Cancel
                        </Button>
                        <Button
                          size="sm"
                          onClick={handleSubmit}
                          disabled={!commentText.trim() || isPending}
                          className="btn-gradient shadow-elevation-1 hover:shadow-elevation-2 transition-all duration-200"
                        >
                          {isPending ? (
                            <div className="flex items-center gap-2">
                              <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-white/70"></div>
                              <span>Posting...</span>
                            </div>
                          ) : (
                            <div className="flex items-center gap-2">
                              <Send className="h-3 w-3" />
                              <span>Comment</span>
                              {commentText.trim() && (
                                <Sparkles className="h-3 w-3" />
                              )}
                            </div>
                          )}
                        </Button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
