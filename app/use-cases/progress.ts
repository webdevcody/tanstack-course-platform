import { Segment } from "~/db/schema";
import { UserId } from "./types";
import { getProgress, markAsWatched } from "~/data-access/progress";

export async function markAsWatchedUseCase(
  userId: UserId,
  segmentId: Segment["id"]
) {
  const progress = await getProgress(userId, segmentId);
  if (!progress) {
    return markAsWatched(userId, segmentId);
  }
}
