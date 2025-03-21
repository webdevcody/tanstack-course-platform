import {
  createSegment,
  deleteSegment,
  getSegmentById,
  getSegments,
  updateSegment,
  getSegmentAttachments,
  deleteAttachment,
} from "~/data-access/segments";
import type { Segment, SegmentCreate, User } from "~/db/schema";
import { deleteFile } from "~/storage";

export async function getSegmentsUseCase() {
  return getSegments();
}

export async function getSegmentUseCase(segmentId: Segment["id"]) {
  return getSegmentById(segmentId);
}

export async function addSegmentUseCase(segment: SegmentCreate) {
  return createSegment(segment);
}

export async function editSegmentUseCase(
  id: number,
  segment: Partial<SegmentCreate>
) {
  return updateSegment(id, segment);
}

export async function removeSegmentUseCase(id: number) {
  return deleteSegment(id);
}

export async function updateSegmentUseCase(
  segmentId: number,
  data: { title: string; content: string; videoKey?: string }
) {
  const { title, content, videoKey } = data;

  const segment = await getSegmentById(segmentId);
  if (!segment) throw new Error("Segment not found");

  if (segment.videoKey && videoKey) {
    await deleteFile(segment.videoKey);
  }

  return await updateSegment(segmentId, { title, content, videoKey });
}

export async function deleteSegmentUseCase(segmentId: number) {
  const segment = await getSegmentById(segmentId);
  if (!segment) throw new Error("Segment not found");

  // Delete video file if it exists
  if (segment.videoKey) {
    await deleteFile(segment.videoKey);
  }

  // Get and delete all attachment files
  const attachments = await getSegmentAttachments(segmentId);
  await Promise.all(
    attachments.map(async (attachment) => {
      await deleteFile(attachment.fileKey);
      await deleteAttachment(attachment.id);
    })
  );

  // Finally delete the segment (this will cascade delete attachments due to foreign key)
  return deleteSegment(segmentId);
}
