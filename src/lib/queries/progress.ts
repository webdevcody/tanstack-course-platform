import { queryOptions } from '@tanstack/react-query';
import { getCompletedUserProgressForSegmentFn } from '~/fn/progress';

export const getCompletedUserProgressQuery = (segmentId: number) =>
  queryOptions({
    queryKey: ['progress', segmentId] as const,
    queryFn: ({ queryKey }) =>
      getCompletedUserProgressForSegmentFn({
        data: { segmentId: queryKey[1] },
      }),
  });
