import { createServerFn } from "@tanstack/react-start";
import { unauthenticatedMiddleware } from "~/lib/auth";
import { z } from "zod";
import { database } from "~/db";
import { getComments } from "~/data-access/comments";

export const getCommentsFn = createServerFn()
  .middleware([unauthenticatedMiddleware])
  .validator(z.object({ segmentId: z.number() }))
  .handler(async ({ data }) => {
    return getComments({ segmentId: data.segmentId });
  });
