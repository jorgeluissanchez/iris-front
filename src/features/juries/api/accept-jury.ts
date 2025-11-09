import { useMutation, useQueryClient } from "@tanstack/react-query";

import { api } from "@/lib/api-client";
import { MutationConfig } from "@/lib/react-query";
import { Jury } from "@/types/api";

import { getJuriesQueryOptions } from "./get-juries";

export const acceptJury = ({
  juryId,
}: {
  juryId: string;
}): Promise<{ data: Jury }> => {
  return api.patch(`/juries/${juryId}`, {
    invitationStatus: "accepted",
  });
};

type UseAcceptJuryOptions = {
  mutationConfig?: MutationConfig<typeof acceptJury>;
};

export const useAcceptJury = ({
  mutationConfig,
}: UseAcceptJuryOptions = {}) => {
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
    mutationFn: acceptJury,
  });
};

