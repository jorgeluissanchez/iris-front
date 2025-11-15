import { queryOptions, useQuery } from "@tanstack/react-query";

import { api } from "@/lib/api-client";
import { QueryConfig } from "@/lib/react-query";
import { Meta, Criterion } from "@/types/api";

export const getCriteria = (
  { page, eventId, courseIds }: { page?: number; eventId?: number; courseIds?: number[] } = { page: 1 }
): Promise<{ data: Criterion[]; meta: Meta }> => {
  return api.get(`/criterions`, {
    params: {
      page,
      ...(eventId ? { eventId } : {}),
      ...(courseIds && courseIds.length ? { courseIds: courseIds.join(",") } : {}),
    },
  });
};

export const getCriteriaQueryOptions = ({ page = 1, eventId, courseIds }: { page?: number; eventId?: number; courseIds?: number[] } = {}) => {
  return queryOptions({
    queryKey: ["criterion", { page, eventId, courseIds }],
    queryFn: () => getCriteria({ page, eventId, courseIds }),
  });
};

type UseCriteriaOptions = {
  page?: number;
  eventId?: number;
  courseIds?: number[];
  queryConfig?: QueryConfig<typeof getCriteriaQueryOptions>;
};

export const useCriteria = ({ queryConfig, page, eventId, courseIds }: UseCriteriaOptions = {}) => {
  return useQuery({
    ...getCriteriaQueryOptions({ page, eventId, courseIds }),
    ...queryConfig,
  });
};
