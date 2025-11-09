import { useMutation, useQueryClient } from "@tanstack/react-query";
import { z } from "zod";

import { api } from "@/lib/api-client";
import { MutationConfig } from "@/lib/react-query";
import { Jury } from "@/types/api";

import { getJuriesQueryOptions } from "./get-juries";

export const createJuryInputSchema = z.object({
  email: z.string().min(1, "Required").email("Invalid email address"),
  eventId: z.string().min(1, "Required"),
});

export type CreateJuryInput = z.infer<typeof createJuryInputSchema>;

export const createJury = ({
  data,
}: {
  data: CreateJuryInput;
}): Promise<{ data: Jury }> => {
  return api.post("/juries", data);
};

type UseCreateJuryOptions = {
  mutationConfig?: MutationConfig<typeof createJury>;
};

export const useCreateJury = ({
  mutationConfig,
}: UseCreateJuryOptions = {}) => {
  const queryClient = useQueryClient();
  const { onSuccess, ...restConfig } = mutationConfig || {};

  return useMutation({
    onSuccess: (data, variables, ...args) => {
      queryClient.invalidateQueries({
        queryKey: ["juries"],
      });
      onSuccess?.(data, variables, ...args);
    },
    ...restConfig,
    mutationFn: createJury,
  });
};
