import { eq } from "drizzle-orm";
import { database } from "~/db";
import { attachments } from "~/db/schema";

export function getAttachment(attachmentId: number) {
  return database.query.attachments.findFirst({
    where: eq(attachments.id, attachmentId),
  });
}
