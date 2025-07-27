import React, { useState, useRef, useEffect } from "react";
import { Button } from "~/components/ui/button";
import { Textarea } from "~/components/ui/textarea";
import { Smile } from "lucide-react";
import { useAuth } from "~/hooks/use-auth";

interface CommentFormProps {
  onSubmit: (comment: string) => void;
  isLoading?: boolean;
}

export function CommentForm({ onSubmit, isLoading = false }: CommentFormProps) {
  const [commentText, setCommentText] = useState("");
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const user = useAuth();

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
    if (commentText.trim() && !isLoading) {
      onSubmit(commentText.trim());
      setCommentText("");
    }
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
              disabled={isLoading}
            />
          </div>
        </div>
        <div className="flex justify-end gap-2 mt-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={handleCancel}
            disabled={!commentText.trim() || isLoading}
          >
            Cancel
          </Button>
          <Button
            size="sm"
            onClick={handleSubmit}
            disabled={!commentText.trim() || isLoading}
          >
            {isLoading ? "Posting..." : "Comment"}
          </Button>
        </div>
      </div>
    </div>
  );
}
