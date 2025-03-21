import { useQuery } from "@tanstack/react-query";
import { createServerFn } from "@tanstack/start";
import { getSegments } from "~/data-access/segments";

const getFirstSegmentFn = createServerFn().handler(async () => {
  const segments = await getSegments();
  return segments[0];
});

export function useFirstSegment() {
  return useQuery({ queryKey: ["first-segment"], queryFn: getFirstSegmentFn });
}
