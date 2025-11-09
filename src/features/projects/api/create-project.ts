import { useMutation, useQueryClient } from "@tanstack/react-query";
import { z } from "zod";

import { api } from "@/lib/api-client";
import { MutationConfig } from "@/lib/react-query";
import { Project } from "@/types/api";

import { getProjectsQueryOptions } from "./get-projects";

export const createProjectInputSchema = z.object({
  eventId: z.string().min(1, "Required"),
  courseId: z.string().min(1, "Required"),
  name: z.string().min(1, "Required"),
  logo: z.string().min(1, "Required"),
  description: z.string().optional(),
  state: z.string().optional(),
  documents: z.array(z.object({
    type: z.string(),
    url: z.string(),
  })).optional(),
  participants: z.array(z.object({
    firstName: z.string(),
    lastName: z.string(),
    email: z.string(),
    studentCode: z.string().optional(),
  })).optional(),
  jurorAssignments: z.array(z.object({
    memberUserId: z.string(),
  })).optional(),
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
        queryKey: ["projects"],
      });
      onSuccess?.(data, variables, ...args);
    },
    ...restConfig,
    mutationFn: createProject,
  });
};
