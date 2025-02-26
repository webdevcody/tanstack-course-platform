import { redirect } from "@tanstack/react-router";
import { createServerFn } from "@tanstack/react-start";
import { validateRequest } from "~/utils/auth";

export const isAuthenticatedFn = createServerFn().handler(async () => {
  const { user } = await validateRequest();
  return !!user;
});

export const assertAuthenticatedFn = createServerFn().handler(async () => {
  const { user } = await validateRequest();

  if (!user) {
    throw redirect({
      to: "/unauthenticated",
    });
  }

  return user;
});
