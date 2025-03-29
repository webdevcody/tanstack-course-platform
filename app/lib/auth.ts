import { createMiddleware } from "@tanstack/start";
import { validateRequest } from "~/utils/auth";
import { redirect } from "@tanstack/react-router";
import { type User } from "~/db/schema";

export function isAdmin(user: User | null) {
  return user?.isAdmin ?? false;
}

export const logMiddleware = createMiddleware().server(
  async ({ next, context, functionId }) => {
    const now = Date.now();

    const result = await next();

    const duration = Date.now() - now;
    console.log("Server Req/Res:", { duration: `${duration}ms`, functionId });

    return result;
  }
);

export const authenticatedMiddleware = createMiddleware()
  .middleware([logMiddleware])
  .server(async ({ next }) => {
    const { user } = await validateRequest();

    if (!user) {
      throw redirect({ to: "/unauthenticated" });
    }

    return next({ context: { userId: user.id, isAdmin: isAdmin(user) } });
  });

export const adminMiddleware = createMiddleware()
  .middleware([logMiddleware])
  .server(async ({ next }) => {
    const { user } = await validateRequest();

    if (!user) {
      throw redirect({ to: "/unauthenticated" });
    }

    if (!isAdmin(user)) {
      throw redirect({ to: "/unauthorized" });
    }

    return next({ context: { userId: user.id } });
  });

export const userIdMiddleware = createMiddleware()
  .middleware([logMiddleware])
  .server(async ({ next }) => {
    const { user } = await validateRequest();

    return next({ context: { userId: user?.id } });
  });

export const unauthenticatedMiddleware = createMiddleware()
  .middleware([logMiddleware])
  .server(async ({ next }) => {
    const { user } = await validateRequest();

    return next({
      context: { userId: user?.id, isAdmin: isAdmin(user), user },
    });
  });
