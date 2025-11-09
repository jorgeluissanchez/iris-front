import { queryOptions, useQuery } from "@tanstack/react-query";

import { api } from "@/lib/api-client";
import { QueryConfig } from "@/lib/react-query";
import { Meta, EvaluationCriteria } from "@/types/api";

export const getCriteria = (
  { page }: { page?: number } = { page: 1 }
): Promise<{ data: EvaluationCriteria[]; meta: Meta }> => {
  return api.get(`/criteria`, { params: { page } });
};

export const getCriteriaQueryOptions = ({ page = 1 }: { page?: number } = {}) => {
  return queryOptions({
    queryKey: ["criteria", { page }],
    queryFn: () => getCriteria({ page }),
  });
};

type UseCriteriaOptions = {
  page?: number;
  queryConfig?: QueryConfig<typeof getCriteriaQueryOptions>;
};

export const useCriteria = ({ queryConfig, page }: UseCriteriaOptions = {}) => {
  return useQuery({
    ...getCriteriaQueryOptions({ page }),
    ...queryConfig,
  });
};
