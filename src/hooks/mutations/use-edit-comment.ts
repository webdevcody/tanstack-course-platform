import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateCommentFn, UpdateCommentSchema } from "~/fn/comments";
import { useLoaderData } from "@tanstack/react-router";
import { useAuth } from "../use-auth";
import { getCommentsQuery } from "~/lib/queries/comments";

export function useEditComment() {
  const { segment } = useLoaderData({ from: "/learn/$slug/_layout/" });
  const user = useAuth();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (variables: UpdateCommentSchema) =>
      updateCommentFn({ data: variables }),
    onSuccess: () => {
      queryClient.invalidateQueries(getCommentsQuery(segment.id));
    },
    onMutate: (variables) => {
      if (!user || !navigator.onLine) throw new Error("Something went wrong");
      const previousComments = queryClient.getQueryData(
        getCommentsQuery(segment.id).queryKey
      );
      queryClient.setQueryData(getCommentsQuery(segment.id).queryKey, (old) =>
        old?.map((comment) =>
          comment.id === variables.commentId
            ? { ...comment, content: variables.content }
            : comment
        )
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
