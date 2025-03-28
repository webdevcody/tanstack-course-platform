import {
  createSegment,
  deleteSegment,
  getSegmentById,
  getSegments,
  updateSegment,
  getSegmentAttachments,
  deleteAttachment,
  getSegmentBySlug,
} from "~/data-access/segments";
import type { Segment, SegmentCreate, User } from "~/db/schema";
import { deleteFile } from "~/storage";
import { eq } from "drizzle-orm";
import { getOrCreateModuleUseCase } from "./modules";
import { database } from "~/db";
import type { Transaction } from "drizzle-orm";
import { segments } from "~/db/schema";

export async function getSegmentsUseCase() {
  return getSegments();
}

export async function getSegmentBySlugUseCase(slug: Segment["slug"]) {
  return getSegmentBySlug(slug);
}

export async function getSegmentByIdUseCase(id: Segment["id"]) {
  return getSegmentById(id);
}

export async function addSegmentUseCase(
  segment: SegmentCreate & { moduleTitle: string }
) {
  // Get or create the module
  const module = await getOrCreateModuleUseCase(segment.moduleTitle);

  // Create the segment with the module's ID
  return createSegment({ ...segment, moduleId: module.id });
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

export type SegmentUpdate = Partial<
  Omit<Segment, "id" | "createdAt" | "updatedAt">
>;

export async function updateSegmentUseCase(
  segmentId: number,
  data: SegmentUpdate & { moduleTitle: string }
) {
  const segment = await getSegmentById(segmentId);
  if (!segment) throw new Error("Segment not found");

  // Handle video deletion if updating video
  if (segment.videoKey && data.videoKey) {
    await deleteFile(segment.videoKey);
  }

  // Get or create the module
  const module = await getOrCreateModuleUseCase(data.moduleTitle);

  // Update the segment with the module's ID
  return await updateSegment(segmentId, { ...data, moduleId: module.id });
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

export async function reorderSegmentsUseCase(
  updates: { id: number; order: number }[]
) {
  return database.transaction(async (tx) => {
    const results = [];
    for (const update of updates) {
      const [result] = await tx
        .update(segments)
        .set({ order: update.order, updatedAt: new Date() })
        .where(eq(segments.id, update.id))
        .returning();
      results.push(result);
    }
    return results;
  });
}
