import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createCommentFn, CreateCommentSchema } from "~/fn/comments";
import { getCommentsQuery } from "~/lib/queries/comments";
import { useLoaderData } from "@tanstack/react-router";
import { CommentsWithUser } from "~/data-access/comments";
import { useAuth } from "../use-auth";

export function useCreateComment() {
  const queryClient = useQueryClient();
  const user = useAuth();
  const { segment } = useLoaderData({ from: "/learn/$slug/_layout/" });
  return useMutation({
    mutationFn: (variables: CreateCommentSchema) =>
      createCommentFn({ data: variables }),
    onSuccess: () => {
      queryClient.invalidateQueries(getCommentsQuery(segment.id));
    },
    onMutate: (variables) => {
      if (!user || !navigator.onLine) throw new Error("Something went wrong");
      const previousComments = queryClient.getQueryData(
        getCommentsQuery(segment.id).queryKey
      );
      const newComment: CommentsWithUser[number] = {
        id: Math.random(),
        content: variables.content,
        userId: user.id,
        profile: {
          id: user.id,
          displayName: user.email,
          image: null,
          userId: user.id,
          imageId: null,
          bio: "",
        },
        segmentId: segment.id,
        createdAt: new Date(),
        updatedAt: new Date(),
        parentId: variables.parentId ?? null,
        repliedToId: variables.repliedToId ?? null,
        children: [],
      };
      queryClient.setQueryData(getCommentsQuery(segment.id).queryKey, (old) => [
        newComment,
        ...(old ?? []),
      ]);
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
