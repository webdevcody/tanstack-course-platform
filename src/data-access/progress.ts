import { and, eq } from "drizzle-orm";
import { progress, Progress } from "~/db/schema";
import { UserId } from "~/use-cases/types";
import { database } from "~/db";

export async function getProgress(
  userId: UserId,
  segmentId: Progress["segmentId"]
) {
  const progressEntry = await database.query.progress.findFirst({
    where: and(eq(progress.segmentId, segmentId), eq(progress.userId, userId)),
  });
  return progressEntry;
}

export async function getAllProgressForUser(userId: UserId) {
  return database.query.progress.findMany({
    where: eq(progress.userId, userId),
  });
}

export async function markAsWatched(
  userId: UserId,
  segmentId: Progress["segmentId"]
) {
  await database.insert(progress).values({ segmentId, userId });
}
