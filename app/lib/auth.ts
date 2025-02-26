import { createMiddleware } from "@tanstack/react-start";
import { validateRequest } from "~/utils/auth";
import { redirect } from "@tanstack/react-router";
import { z } from "zod";
import { isCourseAdminUseCase } from "~/use-cases/courses";

export const authenticatedMiddleware = createMiddleware().server(
  async ({ next }) => {
    const { user } = await validateRequest();

    if (!user) {
      throw redirect({
        to: "/unauthenticated",
      });
    }

    return next({
      context: {
        userId: user.id,
      },
    });
  }
);

export const userIdMiddleware = createMiddleware().server(async ({ next }) => {
  const { user } = await validateRequest();

  return next({
    context: {
      userId: user?.id,
    },
  });
});

export const isCourseAdminMiddleware = createMiddleware()
  .validator(z.object({ courseId: z.number() }))
  .server(async ({ next, data }) => {
    const { user } = await validateRequest();

    if (!user) {
      throw new Error("User not found");
    }

    const isAdmin = await isCourseAdminUseCase(user.id, data.courseId);

    if (!isAdmin) {
      throw new Error("Not authorized");
    }

    return next({
      context: {
        userId: user.id,
      },
    });
  });
