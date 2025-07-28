import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { adminMiddleware, authenticatedMiddleware } from "~/lib/auth";
import {
  getSegmentBySlugUseCase,
  updateSegmentUseCase,
} from "~/use-cases/segments";
import { getModuleById } from "~/data-access/modules";
import { getModulesUseCase } from "~/use-cases/modules";

export const updateSegmentFn = createServerFn()
  .middleware([adminMiddleware])
  .validator(
    z.object({
      segmentId: z.number(),
      updates: z.object({
        title: z.string(),
        content: z.string().optional(),
        videoKey: z.string().optional(),
        moduleTitle: z.string(),
        slug: z.string(),
        length: z.string().optional(),
        isPremium: z.boolean(),
      }),
    })
  )
  .handler(async ({ data }) => {
    const { segmentId, updates } = data;
    return updateSegmentUseCase(segmentId, updates);
  });

export const getSegmentFn = createServerFn()
  .middleware([authenticatedMiddleware])
  .validator(z.object({ slug: z.string() }))
  .handler(async ({ data }) => {
    const segment = await getSegmentBySlugUseCase(data.slug);
    if (!segment) throw new Error("Segment not found");

    const module = await getModuleById(segment.moduleId);
    if (!module) throw new Error("Module not found");

    return { segment: { ...segment, moduleTitle: module.title } };
  });

export const getUniqueModuleNamesFn = createServerFn()
  .middleware([authenticatedMiddleware])
  .handler(async () => {
    const modules = await getModulesUseCase();
    return modules.map(module => module.title);
  });
