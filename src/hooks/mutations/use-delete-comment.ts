import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useLoaderData } from "@tanstack/react-router";
import { deleteCommentFn } from "~/fn/comments";
import { getCommentsQuery } from "~/lib/queries/comments";
import { useAuth } from "../use-auth";

export function useDeleteComment() {
  const queryClient = useQueryClient();
  const { segment } = useLoaderData({ from: "/learn/$slug/_layout/" });
  const user = useAuth();
  return useMutation({
    mutationFn: (commentId: { commentId: number }) =>
      deleteCommentFn({ data: commentId }),
    onSuccess: () => {
      queryClient.invalidateQueries(getCommentsQuery(segment.id));
    },
    onMutate: (variables) => {
      if (!user || !navigator.onLine) throw new Error("Something went wrong");
      const previousComments = queryClient.getQueryData(
        getCommentsQuery(segment.id).queryKey
      );
      queryClient.setQueryData(getCommentsQuery(segment.id).queryKey, (old) =>
        old?.filter((comment) => comment.id !== variables.commentId)
      );
      return { previousComments };
    },
    onError: (_, __, context) => {
      queryClient.setQueryData(
        getCommentsQuery(segment.id).queryKey,
        context?.previousComments
      );
    },
  });
}
