import { createServerFn } from '@tanstack/react-start';
import { getSegmentCompletedProgressUseCase } from '~/use-cases/progress';
import { getTotalUsersUseCase } from '~/use-cases/users';
import { z } from 'zod';
import { unauthenticatedMiddleware } from '~/lib/auth';
import { getSegmentByIdUseCase } from '~/use-cases/segments';

export const getCompletedUserProgressForSegmentFn = createServerFn()
  .validator(
    z.object({
      segmentId: z.number(),
    })
  )
  .middleware([unauthenticatedMiddleware])
  .handler(async ({ data }) => {
    const segment = await getSegmentByIdUseCase(data.segmentId);
    const [segmentProgress, totalUsers] = await Promise.all([
      getSegmentCompletedProgressUseCase(data.segmentId),
      getTotalUsersUseCase(segment.isPremium),
    ]);
    return (segmentProgress / totalUsers) * 100;
  });
