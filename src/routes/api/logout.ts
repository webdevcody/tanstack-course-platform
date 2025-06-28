import { createServerFileRoute } from "@tanstack/react-start/server";
import { invalidateSession, validateRequest } from "~/utils/auth";
import { deleteSessionTokenCookie } from "~/utils/session";

export const ServerRoute = createServerFileRoute("/api/logout").methods({
  GET: async ({ request, params }) => {
    const { session } = await validateRequest();
    if (!session) {
      return new Response(null, { status: 302, headers: { Location: "/" } });
    }
    await invalidateSession(session?.id);
    await deleteSessionTokenCookie();
    return new Response(null, { status: 302, headers: { Location: "/" } });
  },
});
