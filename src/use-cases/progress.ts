import { Segment } from '~/db/schema';
import { UserId } from './types';
import {
  getProgress,
  markAsWatched,
  getAllProgressForUser,
  getSegmentCompletedProgress,
} from '~/data-access/progress';

export async function markAsWatchedUseCase(
  userId: UserId,
  segmentId: Segment['id']
) {
  const progress = await getProgress(userId, segmentId);
  if (!progress) {
    return markAsWatched(userId, segmentId);
  }
}

export async function getAllProgressForUserUseCase(userId: UserId) {
  return getAllProgressForUser(userId);
}

export async function getSegmentCompletedProgressUseCase(
  segmentId: Segment['id']
) {
  return getSegmentCompletedProgress(segmentId);
}
