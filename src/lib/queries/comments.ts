import { queryOptions } from "@tanstack/react-query";
import { getCommentsFn } from "~/fn/comments";

export const getCommentsQuery = (segmentId: number) =>
  queryOptions({
    queryKey: ["comments", segmentId] as const,
    queryFn: ({ queryKey: [, sId] }) =>
      getCommentsFn({ data: { segmentId: sId } }),
  });
