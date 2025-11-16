import { useQuery, queryOptions } from "@tanstack/react-query";

import { api } from "@/lib/api-client";
import { QueryConfig } from "@/lib/react-query";
import { Criterion } from "@/types/api";

export const getCriterion = ({
  criterionId,
}: {
  criterionId: number;
}): Promise<{ data: Criterion }> => {
  return api.get(`/criterions/${criterionId}`);
};

export const getCriterionQueryOptions = (criterionId: number) => {
  return queryOptions({
    queryKey: ["criterions", criterionId],
    queryFn: () => getCriterion({ criterionId }),
  });
};

type UseCriterionOptions = {
  criterionId: number;
  queryConfig?: QueryConfig<typeof getCriterionQueryOptions>;
};

export const useCriterion = ({ criterionId, queryConfig }: UseCriterionOptions) => {
  return useQuery({
    ...getCriterionQueryOptions(criterionId),
    ...queryConfig,
  });
};

