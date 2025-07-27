import { desc, eq } from "drizzle-orm";
import { database } from "~/db";
import { CommentCreate, comments } from "~/db/schema";

export type CommentsWithUser = Awaited<ReturnType<typeof getComments>>;

export async function getComments(segmentId: number) {
  return database.query.comments.findMany({
    where: eq(comments.segmentId, segmentId),
    with: {
      user: true,
    },
    orderBy: [desc(comments.createdAt)],
  });
}

export async function createComment(comment: CommentCreate) {
  return database.insert(comments).values(comment);
}
