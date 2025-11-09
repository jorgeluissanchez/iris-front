import { queryOptions, useQuery } from '@tanstack/react-query';

import { api } from '@/lib/api-client';
import { QueryConfig } from '@/lib/react-query';
import { CoursePublic } from '@/types/api';

export const getEventCourses = ({ eventId }: { eventId: string }): Promise<CoursePublic[]> => {
  return api.get(`/courses-public`, {
    params: { eventId },
  });
};

export const getEventCoursesQueryOptions = ({ eventId }: { eventId: string }) => {
  return queryOptions({
    queryKey: ['courses', 'event', { eventId }],
    queryFn: () => getEventCourses({ eventId }),
  });
};

type UseEventCoursesOptions = {
  eventId: string;
  queryConfig?: QueryConfig<typeof getEventCoursesQueryOptions>;
};

export const useEventCourses = ({ eventId, queryConfig }: UseEventCoursesOptions) => {
  return useQuery({
    ...getEventCoursesQueryOptions({ eventId }),
    ...queryConfig,
  });
};