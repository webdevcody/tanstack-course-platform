import { createServerFn } from "@tanstack/react-start";
import { authenticatedMiddleware, unauthenticatedMiddleware } from "~/lib/auth";
import { z } from "zod";
import {
  createComment,
  deleteComment,
  getComments,
} from "~/data-access/comments";

export const getCommentsFn = createServerFn()
  .middleware([unauthenticatedMiddleware])
  .validator(z.object({ segmentId: z.number() }))
  .handler(async ({ data }) => {
    return getComments(data.segmentId);
  });

const createCommentSchema = z.object({
  segmentId: z.number(),
  content: z.string(),
});

export type CreateCommentSchema = z.infer<typeof createCommentSchema>;

export const createCommentFn = createServerFn({ method: "POST" })
  .middleware([authenticatedMiddleware])
  .validator(createCommentSchema)
  .handler(async ({ data, context }) => {
    return createComment({
      userId: context.userId,
      segmentId: data.segmentId,
      content: data.content,
    });
  });

export const deleteCommentFn = createServerFn({ method: "POST" })
  .middleware([authenticatedMiddleware])
  .validator(z.object({ commentId: z.number() }))
  .handler(async ({ data, context }) => {
    return deleteComment(data.commentId);
  });
