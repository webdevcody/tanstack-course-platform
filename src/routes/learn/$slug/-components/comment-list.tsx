import { getTimeAgo } from "~/lib/utils";
import { useSuspenseQuery } from "@tanstack/react-query";
import { getCommentsQuery } from "~/lib/queries/comments";
import { useLoaderData } from "@tanstack/react-router";
import { useAuth } from "~/hooks/use-auth";
import { MoreHorizontal, Edit, Trash2 } from "lucide-react";
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
import { useState } from "react";
import { useDeleteComment } from "~/hooks/mutations/use-delete-comment";
import { toast } from "~/hooks/use-toast";

export function CommentList() {
  const { segment } = useLoaderData({ from: "/learn/$slug/_layout/" });
  const { data: comments } = useSuspenseQuery(getCommentsQuery(segment.id));
  const user = useAuth();
  const [deleteCommentId, setDeleteCommentId] = useState<number | null>(null);
  const { mutate: deleteComment, isPending: isDeleting } = useDeleteComment();

  if (comments.length === 0) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        <p>No comments yet. Be the first to comment!</p>
      </div>
    );
  }

  const handleEdit = (commentId: number) => {
    console.log("Edit comment:", commentId);
    // TODO: Implement edit functionality
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
      setDeleteCommentId(null);
    }
  };

  const handleCancelDelete = () => {
    setDeleteCommentId(null);
  };

  return (
    <>
      <div className="space-y-4">
        {comments.map((comment) => (
          <div key={comment.id} className="flex gap-4 p-2">
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
                      <DropdownMenuItem onClick={() => handleEdit(comment.id)}>
                        <Edit className="mr-2 h-4 w-4" />
                        Edit
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => handleDeleteClick(comment.id)}
                        className="text-destructive"
                      >
                        <Trash2 className="mr-2 h-4 w-4" />
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                )}
              </div>
              <p className="text-sm">{comment.content}</p>
            </div>
          </div>
        ))}
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
