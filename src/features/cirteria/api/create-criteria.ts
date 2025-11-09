import { useMutation, useQueryClient } from "@tanstack/react-query";
import { z } from "zod";

import { api } from "@/lib/api-client";
import { MutationConfig } from "@/lib/react-query";
import { EvaluationCriteria } from "@/types/api";

import { getCriteriaQueryOptions } from "./get-criteria";

export const createCriteriaInputSchema = z.object({
  name: z.string().min(1, "Required"),
  description: z.string().min(1, "Required"),
  weight: z.number().min(0, "Weight must be greater than or equal to 0"),
});

export type CreateCriteriaInput = z.infer<typeof createCriteriaInputSchema>;

export const createCriteria = ({
  data,
}: {
  data: CreateCriteriaInput;
}): Promise<{ data: EvaluationCriteria }> => {
  return api.post("/criteria", data);
};

type UseCreateCriteriaOptions = {
  mutationConfig?: MutationConfig<typeof createCriteria>;
};

export const useCreateCriteria = ({
  mutationConfig,
}: UseCreateCriteriaOptions = {}) => {
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
    mutationFn: createCriteria,
  });
};

