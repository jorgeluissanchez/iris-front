import { api } from "@/lib/api-client";
import { ProjectPublic } from "@/types/api";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { MutationConfig } from "@/lib/react-query";
import { getProjectsQueryOptions } from "./get-projects";
import { z } from "zod";

export const createProjectInputSchema = z.object({
  name: z.string().min(2).max(100),
  description: z.string().max(500).optional(),
  eventId: z.string(),
  logo: z.string(),
  courseId: z.string(),
});
export type CreateProjectInput = z.infer<typeof createProjectInputSchema>;

export const createProject = ({ data }: { data: CreateProjectInput }): Promise<ProjectPublic> => {
    return api.post(`/projects-public`, data);
};

type UseCreateProjectOptions = {
  mutationConfig?: MutationConfig<typeof createProject>;
};
export const useCreateProject = ({ mutationConfig }: UseCreateProjectOptions = {}) => {
  const queryClient = useQueryClient();
    const { onSuccess, ...restConfig } = mutationConfig || {};
    return useMutation({
      onSuccess: (...args) => {
        queryClient.invalidateQueries({
            queryKey: getProjectsQueryOptions().queryKey,
        });
        onSuccess?.(...args);
      },
      ...restConfig,
      mutationFn: createProject,
    });
};

