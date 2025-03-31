import { createAPIFileRoute } from "@tanstack/react-start/api";
import { invalidateSession, validateRequest } from "~/utils/auth";
import { deleteSessionTokenCookie } from "~/utils/session";

export const APIRoute = createAPIFileRoute("/api/logout")({
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
