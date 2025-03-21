import { createMiddleware } from "@tanstack/start";
import { validateRequest } from "~/utils/auth";
import { redirect } from "@tanstack/react-router";
import { type User } from "~/db/schema";

export function isAdmin(user: User | null) {
  return user?.email === process.env.ADMIN_EMAIL;
}

export const authenticatedMiddleware = createMiddleware().server(
  async ({ next }) => {
    const { user } = await validateRequest();

    if (!user) {
      throw redirect({ to: "/unauthenticated" });
    }

    console.log("user", user);

    return next({ context: { userId: user.id, isAdmin: isAdmin(user) } });
  }
);

export const adminMiddleware = createMiddleware().server(async ({ next }) => {
  const { user } = await validateRequest();

  if (!user) {
    throw redirect({ to: "/unauthenticated" });
  }

  if (!isAdmin(user)) {
    throw redirect({ to: "/unauthorized" });
  }

  return next({ context: { userId: user.id } });
});

export const userIdMiddleware = createMiddleware().server(async ({ next }) => {
  const { user } = await validateRequest();

  return next({ context: { userId: user?.id } });
});

export const unauthenticatedMiddleware = createMiddleware().server(
  async ({ next }) => {
    const { user } = await validateRequest();

    return next({
      context: { userId: user?.id, isAdmin: isAdmin(user), user },
    });
  }
);
