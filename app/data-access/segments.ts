import { database } from "~/db";
import { segments, attachments } from "~/db/schema";
import { eq } from "drizzle-orm";
import type { Segment, SegmentCreate } from "~/db/schema";

export async function getSegments() {
  return database.select().from(segments).orderBy(segments.order);
}

export async function getSegmentBySlug(slug: Segment["slug"]) {
  const result = await database
    .select()
    .from(segments)
    .where(eq(segments.slug, slug))
    .limit(1);
  return result[0];
}
export async function getSegmentById(segmentId: Segment["id"]) {
  const result = await database
    .select()
    .from(segments)
    .where(eq(segments.id, segmentId))
    .limit(1);
  return result[0];
}

export async function createSegment(segment: SegmentCreate) {
  const result = await database.insert(segments).values(segment).returning();
  return result[0];
}

export async function updateSegment(
  id: number,
  segment: Partial<SegmentCreate>
) {
  const result = await database
    .update(segments)
    .set(segment)
    .where(eq(segments.id, id))
    .returning();
  return result[0];
}

export async function deleteSegment(id: number) {
  const result = await database
    .delete(segments)
    .where(eq(segments.id, id))
    .returning();
  return result[0];
}

export async function getSegmentAttachments(segmentId: Segment["id"]) {
  return database
    .select()
    .from(attachments)
    .where(eq(attachments.segmentId, segmentId));
}

export async function createAttachment(attachment: {
  segmentId: Segment["id"];
  fileName: string;
  fileKey: string;
}) {
  const result = await database
    .insert(attachments)
    .values(attachment)
    .returning();
  return result[0];
}

export async function deleteAttachment(id: number) {
  const result = await database
    .delete(attachments)
    .where(eq(attachments.id, id))
    .returning();
  return result[0];
}
