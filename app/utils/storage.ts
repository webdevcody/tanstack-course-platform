import { Segment } from "~/db/schema";

export function getStorageUrl(segmentId: Segment["id"]) {
  return `/api/segments/${segmentId}/video`;
}
