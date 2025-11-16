import { useQuery, queryOptions } from "@tanstack/react-query";

import { api } from "@/lib/api-client";
import { QueryConfig } from "@/lib/react-query";
import { Criterion } from "@/types/api";

export const getCriterion = ({
  criterionId,
}: {
  criterionId: string;
}): Promise<{ data: Criterion }> => {
  return api.get(`/criterion/${criterionId}`);
};

export const getCriterionQueryOptions = (criterionId: string) => {
  return queryOptions({
    queryKey: ["criteria", criterionId],
    queryFn: () => getCriterion({ criterionId }),
  });
};

type UseCriterionOptions = {
  criterionId: string;
  queryConfig?: QueryConfig<typeof getCriterionQueryOptions>;
};

export const useCriterion = ({ criterionId, queryConfig }: UseCriterionOptions) => {
  return useQuery({
    ...getCriterionQueryOptions(criterionId),
    ...queryConfig,
  });
};

