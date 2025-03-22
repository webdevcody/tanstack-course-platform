import { createServerFn } from "@tanstack/start";
import { getSegments } from "~/data-access/segments";

export const getFirstSegmentFn = createServerFn().handler(async () => {
  const segments = await getSegments();
  return segments[0] ?? null;
});
