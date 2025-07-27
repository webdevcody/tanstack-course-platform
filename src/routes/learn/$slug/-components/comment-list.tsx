import { getTimeAgo } from "~/lib/utils";
import { useSuspenseQuery } from "@tanstack/react-query";
import { getCommentsQuery } from "~/lib/queries/comments";
import { useLoaderData } from "@tanstack/react-router";

export function CommentList() {
  const { segment } = useLoaderData({ from: "/learn/$slug/_layout/" });
  const { data: comments } = useSuspenseQuery(getCommentsQuery(segment.id));

  if (comments.length === 0) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        <p>No comments yet. Be the first to comment!</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {comments.map((comment) => (
        <div key={comment.id} className="flex gap-4 p-2">
          <div className="flex shrink-0 size-8 rounded-full overflow-hidden">
            <img
              className="max-h-8 w-auto object-cover"
              src={`https://api.dicebear.com/9.x/initials/svg?seed=${comment.user.email}`}
              alt="User"
            />
          </div>
          <div className="flex flex-col gap-2">
            <div className="flex items-center gap-2">
              <p className="text-sm font-bold">{comment.user.email}</p>
              <p className="text-sm text-muted-foreground">
                {getTimeAgo(comment.createdAt)}
              </p>
            </div>
            <p className="text-sm">{comment.content}</p>
          </div>
        </div>
      ))}
    </div>
  );
}
