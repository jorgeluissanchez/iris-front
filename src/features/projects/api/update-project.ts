import { useMutation, useQueryClient } from "@tanstack/react-query";
import { z } from "zod";

import { api } from "@/lib/api-client";
import { MutationConfig } from "@/lib/react-query";
import { Project } from "@/types/api";

import { getProjectsQueryOptions } from "./get-projects";

export const updateProjectInputSchema = z.object({
  title: z.string().min(1, "Required"),
  description: z.string().min(1, "Required"),
  eventId: z.string().optional(),
  teamId: z.string().optional(),
  isPublic: z.boolean().optional(),
});

export type UpdateProjectInput = z.infer<typeof updateProjectInputSchema>;

export const updateProject = ({
  data,
  projectId,
}: {
  data: UpdateProjectInput;
  projectId: string;
}): Promise<{ data: Project }> => {
  return api.patch(`/projects/${projectId}`, data);
};

type UseUpdateProjectOptions = {
  mutationConfig?: MutationConfig<typeof updateProject>;
};

export const useUpdateProject = ({
  mutationConfig,
}: UseUpdateProjectOptions = {}) => {
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
    mutationFn: updateProject,
  });
};

