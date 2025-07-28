import React, { useState, useRef, useEffect } from "react";
import { Button } from "~/components/ui/button";
import { Textarea } from "~/components/ui/textarea";
import { useAuth } from "~/hooks/use-auth";
import { useLoaderData } from "@tanstack/react-router";
import { useCreateComment } from "~/hooks/mutations/use-create-comment";
import { toast } from "~/hooks/use-toast";

export function CommentForm() {
  const [commentText, setCommentText] = useState("");
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const user = useAuth();
  const { segment } = useLoaderData({ from: "/learn/$slug/_layout/" });
  const { mutate: createComment, isPending } = useCreateComment();

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

  const handleSubmit = () => {
    createComment(
      {
        segmentId: segment.id,
        content: commentText.trim(),
      },
      {
        onSuccess: () => {
          setCommentText("");
        },
        onError: () => {
          toast({
            title: "Error",
            description:
              "Something went wrong, please try again later or contact support.",
            variant: "destructive",
          });
        },
      }
    );
  };

  const handleCancel = () => {
    setCommentText("");
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  return (
    <div className="space-y-4">
      <div className="relative">
        <div className="flex items-start gap-3">
          <div className="flex shrink-0 size-8 rounded-full overflow-hidden bg-muted">
            <img
              className="max-h-8 w-auto object-cover"
              src={`https://api.dicebear.com/9.x/initials/svg?seed=${user?.email || "user"}`}
              alt="User"
            />
          </div>
          <div className="flex-1 relative">
            <Textarea
              ref={textareaRef}
              placeholder="Add a comment"
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
              onKeyDown={handleKeyDown}
              className="min-h-[32px] max-h-32 resize-none border-0 border-b border-muted-foreground/25 rounded-none px-0 py-2 focus-visible:ring-0 focus-visible:border-primary"
              style={{ height: "auto" }}
              disabled={isPending}
            />
          </div>
        </div>
        <div className="flex justify-end gap-2 mt-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={handleCancel}
            disabled={!commentText.trim() || isPending}
          >
            Cancel
          </Button>
          <Button
            size="sm"
            onClick={handleSubmit}
            disabled={!commentText.trim() || isPending}
          >
            {isPending ? "Posting..." : "Comment"}
          </Button>
        </div>
      </div>
    </div>
  );
}
