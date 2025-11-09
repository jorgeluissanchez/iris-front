import { useMutation, useQueryClient } from "@tanstack/react-query";
import { z } from "zod";

import { api } from "@/lib/api-client";
import { MutationConfig } from "@/lib/react-query";
import { EvaluationCriteria } from "@/types/api";

import { getCriterionQueryOptions } from "./get-criterion";
import { getCriteriaQueryOptions } from "./get-criteria";

export const updateCriteriaInputSchema = z.object({
  name: z.string().min(1, "Required").optional(),
  description: z.string().min(1, "Required").optional(),
  weight: z.number().min(0, "Weight must be greater than or equal to 0").optional(),
});

export type UpdateCriteriaInput = z.infer<typeof updateCriteriaInputSchema>;

export const updateCriteria = ({
  data,
  criterionId,
}: {
  data: UpdateCriteriaInput;
  criterionId: string;
}): Promise<{ data: EvaluationCriteria }> => {
  return api.patch(`/criteria/${criterionId}`, data);
};

type UseUpdateCriteriaOptions = {
  mutationConfig?: MutationConfig<typeof updateCriteria>;
};

export const useUpdateCriteria = ({
  mutationConfig,
}: UseUpdateCriteriaOptions = {}) => {
  const queryClient = useQueryClient();

  const { onSuccess, ...restConfig } = mutationConfig || {};

  return useMutation({
    onSuccess: (data, variables, ...args) => {
      queryClient.invalidateQueries({
        queryKey: ["criteria"],
      });
      queryClient.refetchQueries({
        queryKey: getCriterionQueryOptions(data.data.id).queryKey,
      });
      onSuccess?.(data, variables, ...args);
    },
    ...restConfig,
    mutationFn: updateCriteria,
  });
};

