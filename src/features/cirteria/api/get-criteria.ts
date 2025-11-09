import { queryOptions, useQuery } from "@tanstack/react-query";

import { api } from "@/lib/api-client";
import { QueryConfig } from "@/lib/react-query";
import { Meta, Criterion } from "@/types/api";

export const getCriteria = (
  { page, eventId, courseIds }: { page?: number; eventId?: string; courseIds?: string[] } = { page: 1 }
): Promise<{ data: Criterion[]; meta: Meta }> => {
  return api.get(`/criterion`, {
    params: {
      page,
      ...(eventId ? { eventId } : {}),
      ...(courseIds && courseIds.length ? { courseIds: courseIds.join(",") } : {}),
    },
  });
};

export const getCriteriaQueryOptions = ({ page = 1, eventId, courseIds }: { page?: number; eventId?: string; courseIds?: string[] } = {}) => {
  return queryOptions({
    queryKey: ["criterion", { page, eventId, courseIds }],
    queryFn: () => getCriteria({ page, eventId, courseIds }),
  });
};

type UseCriteriaOptions = {
  page?: number;
  eventId?: string;
  courseIds?: string[];
  queryConfig?: QueryConfig<typeof getCriteriaQueryOptions>;
};

export const useCriteria = ({ queryConfig, page, eventId, courseIds }: UseCriteriaOptions = {}) => {
  return useQuery({
    ...getCriteriaQueryOptions({ page, eventId, courseIds }),
    ...queryConfig,
  });
};
