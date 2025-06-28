import { createServerFn } from "@tanstack/react-start";
import { adminMiddleware } from "~/lib/auth";
import { z } from "zod";
import { reorderModulesUseCase } from "~/use-cases/modules";

export const reorderModulesFn = createServerFn()
  .middleware([adminMiddleware])
  .validator(z.array(z.object({ id: z.number(), order: z.number() })))
  .handler(async ({ data }) => {
    return reorderModulesUseCase(data);
  });
