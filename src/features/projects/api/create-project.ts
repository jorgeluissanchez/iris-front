import { useMutation, useQueryClient } from "@tanstack/react-query";
import { z } from "zod";

import { api } from "@/lib/api-client";
import { MutationConfig } from "@/lib/react-query";
import { Project } from "@/types/api";

import { getProjectsQueryOptions } from "./get-projects";
import { getProjectQueryOptions } from "./get-project";
import { getProjectsByEventQueryOptions } from "./get-projects-by-event";

export const createProjectInputSchema = z.object({
  title: z.string().min(1, "Required"),
  description: z.string().min(1, "Required"),
  eventId: z.string().min(1, "Required"),
  teamId: z.string().optional(),
  isPublic: z.boolean().optional(),
});

export type CreateProjectInput = z.infer<typeof createProjectInputSchema>;

export const createProject = ({
  data,
}: {
  data: CreateProjectInput;
}): Promise<{ data: Project }> => {
  return api.post("/projects", data);
};

type UseCreateProjectOptions = {
  mutationConfig?: MutationConfig<typeof createProject>;
};

export const useCreateProject = ({
  mutationConfig,
}: UseCreateProjectOptions = {}) => {
  const queryClient = useQueryClient();

  const { onSuccess, ...restConfig } = mutationConfig || {};

  return useMutation({
    onSuccess: (data, variables, ...args) => {
      queryClient.invalidateQueries({
        queryKey: getProjectsQueryOptions().queryKey,
      });
      const eventId = data?.data?.eventId || variables?.data?.eventId;
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
    mutationFn: createProject,
  });
};
