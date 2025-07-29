import { and, desc, eq, isNull } from "drizzle-orm";
import { database } from "~/db";
import { CommentCreate, comments } from "~/db/schema";

export type CommentsWithUser = Awaited<ReturnType<typeof getComments>>;

export async function getComments(segmentId: number) {
  return database.query.comments.findMany({
    where: and(eq(comments.segmentId, segmentId), isNull(comments.parentId)),
    with: {
      user: true,
      children: {
        with: {
          user: true,
          repliedTo: true,
        },
      },
    },
    orderBy: [desc(comments.createdAt)],
  });
}

export async function createComment(comment: CommentCreate) {
  return database.insert(comments).values(comment);
}

export async function deleteComment(commentId: number, userId: number) {
  return database
    .delete(comments)
    .where(and(eq(comments.id, commentId), eq(comments.userId, userId)));
}

export async function updateComment(
  commentId: number,
  content: string,
  userId: number
) {
  return database
    .update(comments)
    .set({ content })
    .where(and(eq(comments.id, commentId), eq(comments.userId, userId)));
}
