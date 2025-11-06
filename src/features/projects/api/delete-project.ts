import { useMutation, useQueryClient } from "@tanstack/react-query";

import { api } from "@/lib/api-client";
import { Project } from "@/types/api";
import { MutationConfig } from "@/lib/react-query";

import { getProjectsQueryOptions } from "./get-projects";
import { getProjectsByEventQueryOptions } from "./get-projects-by-event";

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
        queryKey: getProjectsQueryOptions().queryKey,
      });
      const eventId = data?.data?.eventId;
      if (eventId) {
        queryClient.invalidateQueries({
          queryKey: getProjectsByEventQueryOptions({ eventId, page: 1 }).queryKey,
        });
      } else {
        queryClient.invalidateQueries({ queryKey: ["projects", "by-event"] });
      }
      onSuccess?.(data, variables, ...args);
    },
    ...restConfig,
    mutationFn: deleteProject,
  });
};
