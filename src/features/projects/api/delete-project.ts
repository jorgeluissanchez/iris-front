import { useMutation, useQueryClient } from "@tanstack/react-query";

import { api } from "@/lib/api-client";
import { Project } from "@/types/api";
import { MutationConfig } from "@/lib/react-query";

import { getProjectsQueryOptions } from "./get-projects";

export const deleteProject = ({ projectId }: { projectId: string }): Promise<{ data: Project }> => {
  return api.delete(`/projects/${projectId}`);
};

type UseDeleteProjectOptions = {
  mutationConfig?: MutationConfig<typeof deleteProject>;
};

export const useDeleteProject = ({
  mutationConfig,
}: UseDeleteProjectOptions = {}) => {
  const queryClient = useQueryClient();

  const { onSuccess, ...restConfig } = mutationConfig || {};

  return useMutation({
    onSuccess: (data, variables, ...args) => {
      queryClient.invalidateQueries({
        queryKey: ["projects"],
      });
      onSuccess?.(data, variables, ...args);
    },
    ...restConfig,
    mutationFn: deleteProject,
  });
};
