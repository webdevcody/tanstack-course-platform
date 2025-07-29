import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { adminMiddleware, authenticatedMiddleware } from "~/lib/auth";
import { addSegmentUseCase } from "~/use-cases/segments";
import { getSegments } from "~/data-access/segments";
import { getModulesUseCase } from "~/use-cases/modules";

export const createSegmentFn = createServerFn()
  .middleware([adminMiddleware])
  .validator(
    z.object({
      title: z.string(),
      content: z.string().optional(),
      videoKey: z.string().optional(),
      slug: z.string(),
      moduleTitle: z.string(),
      length: z.string().optional(),
      isPremium: z.boolean(),
    })
  )
  .handler(async ({ data }) => {
    // Get all segments to determine the next order number
    const segments = await getSegments();
    const maxOrder = segments.reduce(
      (max, segment) => Math.max(max, segment.order),
      -1
    );
    const nextOrder = maxOrder + 1;

    const segment = await addSegmentUseCase({
      title: data.title,
      content: data.content,
      slug: data.slug,
      order: nextOrder,
      moduleTitle: data.moduleTitle,
      videoKey: data.videoKey,
      length: data.length,
      isPremium: data.isPremium,
    });

    return segment;
  });

export const getUniqueModuleNamesFn = createServerFn()
  .middleware([authenticatedMiddleware])
  .handler(async () => {
    const modules = await getModulesUseCase();
    return modules.map(module => module.title);
  });
