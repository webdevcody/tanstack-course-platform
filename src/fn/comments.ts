import { createServerFn } from "@tanstack/react-start";
import { authenticatedMiddleware, unauthenticatedMiddleware } from "~/lib/auth";
import { z } from "zod";
import {
  createComment,
  deleteComment,
  getComments,
  updateComment,
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
  parentId: z.number().nullable(),
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
      parentId: data.parentId,
    });
  });

export const deleteCommentFn = createServerFn({ method: "POST" })
  .middleware([authenticatedMiddleware])
  .validator(z.object({ commentId: z.number() }))
  .handler(async ({ data, context }) => {
    return deleteComment(data.commentId, context.userId);
  });

const updateCommentSchema = z.object({
  commentId: z.number(),
  content: z.string(),
});

export type UpdateCommentSchema = z.infer<typeof updateCommentSchema>;

export const updateCommentFn = createServerFn({ method: "POST" })
  .middleware([authenticatedMiddleware])
  .validator(updateCommentSchema)
  .handler(async ({ data, context }) => {
    return updateComment(data.commentId, data.content, context.userId);
  });
