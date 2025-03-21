import { getAttachment } from "~/data-access/attachments";
import { createAttachment, deleteAttachment } from "~/data-access/segments";
import { Segment, User } from "~/db/schema";
import { deleteFile } from "~/storage";

export async function deleteAttachmentUseCase(attachmentId: number) {
  const attachment = await getAttachment(attachmentId);

  if (!attachment) {
    throw new Error("Attachment not found");
  }

  await deleteFile(attachment.fileKey);
  return deleteAttachment(attachmentId);
}

export async function createAttachmentUseCase(attachment: {
  segmentId: Segment["id"];
  fileName: string;
  fileKey: string;
}) {
  return createAttachment({
    segmentId: attachment.segmentId,
    fileName: attachment.fileName,
    fileKey: attachment.fileKey,
  });
}
