import { useMutation, useQueryClient } from "@tanstack/react-query";

import { api } from "@/lib/api-client";
import { EvaluationCriteria } from "@/types/api";
import { MutationConfig } from "@/lib/react-query";

import { getCriteriaQueryOptions } from "./get-criteria";

export const deleteCriteria = ({
  criterionId,
}: {
  criterionId: string;
}): Promise<{ data: EvaluationCriteria }> => {
  return api.delete(`/criteria/${criterionId}`);
};

type UseDeleteCriteriaOptions = {
  mutationConfig?: MutationConfig<typeof deleteCriteria>;
};

export const useDeleteCriteria = ({
  mutationConfig,
}: UseDeleteCriteriaOptions = {}) => {
  const queryClient = useQueryClient();

  const { onSuccess, ...restConfig } = mutationConfig || {};

  return useMutation({
    onSuccess: (data, variables, ...args) => {
      queryClient.invalidateQueries({
        queryKey: ["criteria"],
      });
      onSuccess?.(data, variables, ...args);
    },
    ...restConfig,
    mutationFn: deleteCriteria,
  });
};

