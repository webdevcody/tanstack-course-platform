import { createServerFn } from "@tanstack/start";
import { getSegments } from "~/data-access/segments";
import { adminMiddleware } from "~/lib/auth";
import { z } from "zod";
import { reorderSegmentsUseCase } from "~/use-cases/segments";

export const getFirstSegmentFn = createServerFn().handler(async () => {
  const segments = await getSegments();
  return segments[0] ?? null;
});

export const reorderSegmentsFn = createServerFn()
  .middleware([adminMiddleware])
  .validator(z.array(z.object({ id: z.number(), order: z.number() })))
  .handler(async ({ data }) => {
    return reorderSegmentsUseCase(data);
  });
