import { getTimeAgo } from "~/lib/utils";
import { useSuspenseQuery } from "@tanstack/react-query";
import { getCommentsQuery } from "~/lib/queries/comments";
import { useLoaderData } from "@tanstack/react-router";
import { useAuth } from "~/hooks/use-auth";
import {
  MoreHorizontal,
  Edit,
  Trash2,
  Check,
  X,
  Reply,
  MessageSquare,
  Users,
  Heart,
  Lightbulb,
  Send,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "~/components/ui/dropdown-menu";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "~/components/ui/alert-dialog";
import { Button } from "~/components/ui/button";
import { Textarea } from "~/components/ui/textarea";
import { useState } from "react";
import { useDeleteComment } from "~/hooks/mutations/use-delete-comment";
import { toast } from "~/hooks/use-toast";
import { useEditComment } from "~/hooks/mutations/use-edit-comment";
import { useCreateComment } from "~/hooks/mutations/use-create-comment";
import { CommentsWithUser } from "~/data-access/comments";

interface CommentItemProps {
  comment: any;
  level?: number;
}

function CommentItem({ comment, level = 0 }: CommentItemProps) {
  const user = useAuth();
  const { segment } = useLoaderData({ from: "/learn/$slug/_layout/" });
  const [editingCommentId, setEditingCommentId] = useState<number | null>(null);
  const [editContent, setEditContent] = useState("");
  const [replyingToCommentId, setReplyingToCommentId] = useState<number | null>(
    null
  );
  const [replyContent, setReplyContent] = useState("");
  const [deleteCommentId, setDeleteCommentId] = useState<number | null>(null);

  const { mutate: deleteComment, isPending: isDeleting } = useDeleteComment();
  const { mutate: editComment, isPending: isEditing } = useEditComment();
  const { mutate: createComment, isPending: isReplying } = useCreateComment();

  const isEditingThis = editingCommentId === comment.id;
  const isReplyingToThis = replyingToCommentId === comment.id;
  const isOwner = user && comment.profile.userId === user.id;

  const handleEdit = (commentId: number) => {
    setEditingCommentId(commentId);
    setEditContent(comment.content);
  };

  const handleSaveEdit = (commentId: number) => {
    if (editContent.trim()) {
      editComment(
        {
          commentId,
          content: editContent.trim(),
        },
        {
          onSuccess: () => {
            setEditingCommentId(null);
            setEditContent("");
            toast({
              title: "Comment updated",
              description: "Your comment has been updated.",
              variant: "default",
            });
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
    }
  };

  const handleCancelEdit = () => {
    setEditingCommentId(null);
    setEditContent("");
  };

  const handleDeleteClick = (commentId: number) => {
    setDeleteCommentId(commentId);
  };

  const handleConfirmDelete = () => {
    if (deleteCommentId) {
      deleteComment(
        { commentId: deleteCommentId },
        {
          onSuccess: () => {
            setDeleteCommentId(null);
            toast({
              title: "Comment deleted",
              description: "Your comment has been deleted.",
              variant: "default",
            });
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
    }
  };

  const handleCancelDelete = () => {
    setDeleteCommentId(null);
  };

  const handleReply = (commentId: number) => {
    setReplyingToCommentId(commentId);
    setReplyContent("");
  };

  const handleSubmitReply = () => {
    if (replyContent.trim()) {
      const rootParentId = comment.parentId || comment.id;

      createComment(
        {
          segmentId: segment.id,
          content: replyContent,
          parentId: rootParentId,
          repliedToId: comment.profile.userId,
        },
        {
          onSuccess: () => {
            setReplyingToCommentId(null);
            setReplyContent("");
            toast({
              title: "Reply posted",
              description: "Your reply has been posted.",
              variant: "default",
            });
          },
        }
      );
    }
  };

  const handleCancelReply = () => {
    setReplyingToCommentId(null);
    setReplyContent("");
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmitReply();
    }
  };

  return (
    <>
      <div
        className={`${
          level > 0 ? "ml-4 border-l-2 comment-thread-line pl-4" : ""
        } ${level > 2 ? "ml-2" : ""}`}
      >
        <div
          className={`module-card group hover:shadow-elevation-2 transition-all duration-300 ${
            level > 0 ? "bg-muted/20" : ""
          }`}
        >
          <div className="p-4">
            <div className="flex gap-3">
              {/* User Avatar */}
              <div className="flex shrink-0 size-10 rounded-full overflow-hidden bg-gradient-to-br from-theme-100 to-theme-200 dark:from-theme-800 dark:to-theme-700 shadow-elevation-1 hover:shadow-elevation-2 transition-all duration-200">
                <img
                  className="max-h-10 w-auto object-cover"
                  src={`https://api.dicebear.com/9.x/initials/svg?seed=${comment.profile.displayName}&backgroundColor=6366f1&textColor=ffffff`}
                  alt="User avatar"
                />
              </div>

              <div className="flex flex-col gap-2 flex-1 min-w-0">
                {/* Comment Header */}
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-2 min-w-0 flex-wrap">
                    <p className="text-sm font-semibold text-foreground truncate">
                      {comment.profile.displayName}
                    </p>

                    {/* Visual separator */}
                    <span className="text-xs text-muted-foreground/60">•</span>

                    <p className="text-xs text-muted-foreground whitespace-nowrap hover:text-foreground transition-colors">
                      {getTimeAgo(comment.createdAt)}
                    </p>

                    {/* Reply indicator */}
                    {comment.repliedToProfile && (
                      <>
                        <span className="text-xs text-muted-foreground/60">
                          •
                        </span>
                        <div className="flex items-center gap-1">
                          <Reply className="h-3 w-3 text-muted-foreground/60" />
                          <span className="text-xs text-muted-foreground">
                            replying to{" "}
                            <span className="font-medium text-theme-600 dark:text-theme-400 hover:text-theme-700 dark:hover:text-theme-300 transition-colors">
                              {comment.repliedToProfile.displayName}
                            </span>
                          </span>
                        </div>
                      </>
                    )}
                  </div>

                  {/* Actions Menu */}
                  {isOwner && (
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-6 w-6 p-0 opacity-0 group-hover:opacity-100 transition-all duration-200 hover:bg-muted/80"
                        >
                          <MoreHorizontal className="h-3 w-3" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent
                        align="end"
                        className="shadow-elevation-3"
                      >
                        <DropdownMenuItem
                          onClick={() => handleEdit(comment.id)}
                          disabled={isEditing}
                          className="cursor-pointer"
                        >
                          <Edit className="mr-2 h-3 w-3" />
                          Edit
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => handleDeleteClick(comment.id)}
                          className="text-destructive cursor-pointer"
                          disabled={isDeleting}
                        >
                          <Trash2 className="mr-2 h-3 w-3" />
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  )}
                </div>

                {/* Comment Content */}
                {isEditingThis ? (
                  <div className="space-y-3 animate-fade-in">
                    <div className="relative">
                      <textarea
                        value={editContent}
                        onChange={(e) => setEditContent(e.target.value)}
                        className="w-full p-3 border rounded-lg resize-none text-sm bg-background focus:ring-2 focus:ring-theme-500/30 focus:border-theme-300 dark:focus:border-theme-700 transition-all duration-200 min-h-[80px]"
                        rows={3}
                        autoFocus
                        placeholder="Edit your comment..."
                      />
                    </div>
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        onClick={() => handleSaveEdit(comment.id)}
                        disabled={isEditing || !editContent.trim()}
                        className="btn-gradient shadow-elevation-1"
                      >
                        {isEditing ? (
                          <>
                            <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-white/70 mr-2"></div>
                            Saving...
                          </>
                        ) : (
                          <>
                            <Check className="mr-2 h-3 w-3" />
                            Save
                          </>
                        )}
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={handleCancelEdit}
                        disabled={isEditing}
                      >
                        <X className="mr-2 h-3 w-3" />
                        Cancel
                      </Button>
                    </div>
                  </div>
                ) : (
                  <>
                    {/* Comment Text */}
                    <div className="prose prose-sm dark:prose-invert max-w-none">
                      <p className="text-sm text-foreground leading-relaxed whitespace-pre-wrap">
                        {comment.content}
                      </p>
                    </div>

                    {/* Comment Actions */}
                    <div className="flex items-center gap-4 pt-1">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleReply(comment.id)}
                        className="h-6 px-2 text-xs text-muted-foreground hover:text-theme-600 dark:hover:text-theme-400 transition-colors hover:bg-theme-50 dark:hover:bg-theme-950/50"
                      >
                        <Reply className="mr-1 h-3 w-3" />
                        Reply
                      </Button>
                    </div>

                    {/* Reply Form */}
                    {isReplyingToThis && (
                      <div className="mt-4 space-y-3 animate-fade-in">
                        <div className="module-card bg-gradient-to-br from-muted/30 to-muted/10 border border-border/60">
                          <div className="p-3">
                            <div className="flex items-start gap-3">
                              <div className="flex shrink-0 size-8 rounded-full overflow-hidden bg-gradient-to-br from-theme-100 to-theme-200 dark:from-theme-800 dark:to-theme-700 shadow-elevation-1">
                                <img
                                  className="max-h-8 w-auto object-cover"
                                  src={`https://api.dicebear.com/9.x/initials/svg?seed=${user?.id || "user"}&backgroundColor=6366f1&textColor=ffffff`}
                                  alt="Your avatar"
                                />
                              </div>
                              <div className="flex-1">
                                <Textarea
                                  placeholder="Write a thoughtful reply..."
                                  value={replyContent}
                                  onChange={(e) =>
                                    setReplyContent(e.target.value)
                                  }
                                  onKeyDown={handleKeyDown}
                                  className="min-h-[60px] max-h-32 resize-none border-0 p-0 text-sm focus-visible:ring-0 bg-transparent placeholder:text-muted-foreground/70"
                                />
                              </div>
                            </div>
                            <div className="flex justify-between items-center mt-3 pt-3 border-t border-border/60">
                              <div className="text-xs text-muted-foreground">
                                Press{" "}
                                <kbd className="px-1 py-0.5 text-xs font-mono bg-muted/60 rounded">
                                  Enter
                                </kbd>{" "}
                                to reply
                              </div>
                              <div className="flex gap-2">
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={handleCancelReply}
                                  className="text-muted-foreground hover:text-foreground"
                                >
                                  Cancel
                                </Button>
                                <Button
                                  size="sm"
                                  onClick={handleSubmitReply}
                                  disabled={!replyContent.trim() || isReplying}
                                  className="btn-gradient shadow-elevation-1"
                                >
                                  {isReplying ? (
                                    <>
                                      <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-white/70 mr-2"></div>
                                      Posting...
                                    </>
                                  ) : (
                                    <>
                                      <Send className="mr-2 h-3 w-3" />
                                      Reply
                                    </>
                                  )}
                                </Button>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Delete Confirmation Dialog */}
      <AlertDialog
        open={deleteCommentId !== null}
        onOpenChange={() => setDeleteCommentId(null)}
      >
        <AlertDialogContent className="shadow-elevation-4">
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center gap-2">
              <Trash2 className="h-5 w-5 text-destructive" />
              Delete Comment
            </AlertDialogTitle>
            <AlertDialogDescription className="text-muted-foreground">
              Are you sure you want to delete this comment? This action cannot
              be undone and will remove the comment from the discussion.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={handleCancelDelete}>
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleConfirmDelete}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90 shadow-elevation-1"
            >
              <Trash2 className="mr-2 h-3 w-3" />
              Delete Comment
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}

export function CommentList({
  onStartDiscussion,
}: {
  onStartDiscussion?: () => void;
}) {
  const { segment } = useLoaderData({ from: "/learn/$slug/_layout/" });
  const { data: comments } = useSuspenseQuery(getCommentsQuery(segment.id));
  const user = useAuth();

  if (comments.length === 0) {
    return (
      <div className="text-center py-16">
        <div className="max-w-md mx-auto space-y-6">
          {/* Visual Hero */}
          <div className="relative">
            <div className="flex justify-center mb-4">
              <div className="relative">
                <div className="p-4 rounded-2xl bg-gradient-to-br from-theme-100 to-theme-200 dark:from-theme-900 dark:to-theme-800 shadow-elevation-2">
                  <MessageSquare className="h-8 w-8 text-theme-600 dark:text-theme-400" />
                </div>
                {/* Floating accent icons */}
                <div className="absolute -top-1 -right-1 p-1.5 rounded-full bg-gradient-to-br from-blue-100 to-blue-200 dark:from-blue-900 dark:to-blue-800 shadow-elevation-1">
                  <Users className="h-3 w-3 text-blue-600 dark:text-blue-400" />
                </div>
                <div className="absolute -bottom-1 -left-1 p-1.5 rounded-full bg-gradient-to-br from-green-100 to-green-200 dark:from-green-900 dark:to-green-800 shadow-elevation-1">
                  <Heart className="h-3 w-3 text-green-600 dark:text-green-400" />
                </div>
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="space-y-3">
            <h3 className="text-xl font-semibold text-foreground">
              Start the Discussion
            </h3>
            <div className="space-y-2 text-muted-foreground">
              <p className="text-sm leading-relaxed">
                Be the first to share your thoughts on this lesson! Ask
                questions, share insights, or help others learn.
              </p>
              <div className="flex items-center justify-center gap-4 text-xs">
                <div className="flex items-center gap-1">
                  <Lightbulb className="h-3 w-3" />
                  <span>Share insights</span>
                </div>
                <div className="flex items-center gap-1">
                  <MessageSquare className="h-3 w-3" />
                  <span>Ask questions</span>
                </div>
                <div className="flex items-center gap-1">
                  <Users className="h-3 w-3" />
                  <span>Help others</span>
                </div>
              </div>
            </div>
          </div>

          {/* Call to action */}
          {user ? (
            <div className="pt-2">
              <Button
                onClick={onStartDiscussion}
                className="btn-gradient shadow-elevation-2 hover:shadow-elevation-3 transition-all duration-200"
                size="lg"
              >
                <MessageSquare className="mr-2 h-4 w-4" />
                Start Discussion
              </Button>
            </div>
          ) : (
            <div className="pt-2">
              <div className="p-3 rounded-xl bg-gradient-to-r from-amber-50 to-orange-50 dark:from-amber-950 dark:to-orange-950 border border-amber-200 dark:border-amber-800">
                <p className="text-sm font-medium text-foreground mb-1">
                  Join the community
                </p>
                <p className="text-xs text-muted-foreground">
                  Sign in to share your thoughts and connect with other learners
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }

  const renderCommentTree = (
    commentTree: CommentsWithUser,
    level: number = 0
  ) => {
    return commentTree.map((comment) => (
      <div key={comment.id} className="space-y-4">
        <CommentItem comment={comment} level={level} />
        {comment.children && comment.children.length > 0 && (
          <div className="space-y-3">
            {comment.children.map((child) => (
              <div key={child.id}>
                <CommentItem comment={child} level={level + 1} />
              </div>
            ))}
          </div>
        )}
      </div>
    ));
  };

  return (
    <div className="space-y-6 mt-8">
      <div className="flex items-center justify-between">
        <h4 className="text-lg font-semibold text-foreground flex items-center gap-2">
          <MessageSquare className="h-5 w-5 text-theme-600 dark:text-theme-400" />
          {comments.length === 1 ? "1 Comment" : `${comments.length} Comments`}
        </h4>
        <div className="text-sm text-muted-foreground">Latest activity</div>
      </div>

      <div className="space-y-4">{renderCommentTree(comments)}</div>
    </div>
  );
}
