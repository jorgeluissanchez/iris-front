import { queryOptions, useQuery } from '@tanstack/react-query';

import { api } from '@/lib/api-client';
import { QueryConfig } from '@/lib/react-query';
import { CriterionPublic } from '@/types/api';

export const getCourseCriteria = ({ courseId }: { courseId: string }): Promise<CriterionPublic[]> => {
  return api.get(`/criterion-public/${courseId}` );
};

export const getCourseCriterionQueryOptions = ({ courseId }: { courseId: string }) => {
  return queryOptions({
    queryKey: ['courses', 'event', { courseId }],
    queryFn: () => getCourseCriteria({ courseId }),
  });
};

type UseCourseCriteriaOptions = {
  courseId: string;
  queryConfig?: QueryConfig<typeof getCourseCriterionQueryOptions>;
};

export const useCourseCriteria = ({ courseId, queryConfig }: UseCourseCriteriaOptions) => {
  return useQuery({
    ...getCourseCriterionQueryOptions({ courseId }),
    ...queryConfig,
  });
};