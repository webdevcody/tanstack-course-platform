import { getTimeAgo } from "~/lib/utils";
import { useSuspenseQuery } from "@tanstack/react-query";
import { getCommentsQuery } from "~/lib/queries/comments";
import { useLoaderData } from "@tanstack/react-router";
import { useAuth } from "~/hooks/use-auth";
import { MoreHorizontal, Edit, Trash2, Check, X, Reply } from "lucide-react";
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
          repliedToId: comment.user.id,
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
      <div className={`flex gap-4 p-2 ${level > 0 ? "ml-8" : ""}`}>
        <div className="flex shrink-0 size-8 rounded-full overflow-hidden">
          <img
            className="max-h-8 w-auto object-cover"
            src={`https://api.dicebear.com/9.x/initials/svg?seed=${comment.user.email}`}
            alt="User"
          />
        </div>
        <div className="flex flex-col gap-2 flex-1">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <p className="text-sm font-bold">{comment.user.email}</p>
              <p className="text-sm text-muted-foreground">
                {getTimeAgo(comment.createdAt)}
                {comment.repliedTo && (
                  <span className="ml-2">
                    • replying to{" "}
                    <span className="font-medium">
                      ({comment.repliedTo.email})
                    </span>
                  </span>
                )}
              </p>
            </div>
            {user && comment.user.email === user.email && (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                    <MoreHorizontal className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem
                    onClick={() => handleEdit(comment.id)}
                    disabled={isEditing}
                  >
                    <Edit className="mr-2 h-4 w-4" />
                    Edit
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => handleDeleteClick(comment.id)}
                    className="text-destructive"
                    disabled={isDeleting}
                  >
                    <Trash2 className="mr-2 h-4 w-4" />
                    Delete
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            )}
          </div>
          {isEditingThis ? (
            <div className="space-y-2">
              <textarea
                value={editContent}
                onChange={(e) => setEditContent(e.target.value)}
                className="w-full p-2 border rounded-md resize-none text-sm"
                rows={3}
                autoFocus
              />
              <div className="flex gap-2">
                <Button
                  size="sm"
                  onClick={() => handleSaveEdit(comment.id)}
                  disabled={isEditing || !editContent.trim()}
                >
                  <Check className="mr-2 h-4 w-4" />
                  {isEditing ? "Saving..." : "Save"}
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={handleCancelEdit}
                  disabled={isEditing}
                >
                  <X className="mr-2 h-4 w-4" />
                  Cancel
                </Button>
              </div>
            </div>
          ) : (
            <>
              <p className="text-sm">{comment.content}</p>
              <div className="flex items-center gap-4 pt-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleReply(comment.id)}
                  className="h-8 px-2 text-xs text-muted-foreground hover:text-foreground"
                >
                  <Reply className="mr-1 h-3 w-3" />
                  Reply
                </Button>
              </div>
              {isReplyingToThis && (
                <div className="space-y-4 mt-4">
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
                          placeholder="Write a reply..."
                          value={replyContent}
                          onChange={(e) => setReplyContent(e.target.value)}
                          onKeyDown={handleKeyDown}
                          className="min-h-[32px] max-h-32 resize-none border-0 border-b border-muted-foreground/25 rounded-none px-0 py-2 focus-visible:ring-0 focus-visible:border-primary"
                          style={{ height: "auto" }}
                        />
                      </div>
                    </div>
                    <div className="flex justify-end gap-2 mt-4">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={handleCancelReply}
                      >
                        Cancel
                      </Button>
                      <Button
                        size="sm"
                        onClick={handleSubmitReply}
                        disabled={!replyContent.trim()}
                      >
                        {isReplying ? "Posting..." : "Reply"}
                      </Button>
                    </div>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>

      <AlertDialog
        open={deleteCommentId !== null}
        onOpenChange={() => setDeleteCommentId(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Comment</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this comment? This action cannot
              be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={handleCancelDelete}>
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleConfirmDelete}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}

export function CommentList() {
  const { segment } = useLoaderData({ from: "/learn/$slug/_layout/" });
  const { data: comments } = useSuspenseQuery(getCommentsQuery(segment.id));

  if (comments.length === 0) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        <p>No comments yet. Be the first to comment!</p>
      </div>
    );
  }

  const renderCommentTree = (
    commentTree: CommentsWithUser,
    level: number = 0
  ) => {
    return commentTree.map((comment) => (
      <div key={comment.id}>
        <CommentItem comment={comment} level={level} />
        {comment.children && comment.children.length > 0 && (
          <div className="border-l-2 border-muted ml-4">
            {comment.children.map((child) => (
              <CommentItem key={child.id} comment={child} level={1} />
            ))}
          </div>
        )}
      </div>
    ));
  };

  return <div className="space-y-4">{renderCommentTree(comments)}</div>;
}
