import { useQuery, queryOptions } from "@tanstack/react-query";
import { z } from "zod";

import { api } from "@/lib/api-client";
import { QueryConfig } from "@/lib/react-query";
import { Project } from "@/types/api";

export const getProjectInputSchema = z.object({
  projectId: z.string().min(1, "Project ID is required"),
});

export type GetProjectInput = z.infer<typeof getProjectInputSchema>;

export const getProject = ({
  projectId,
}: GetProjectInput): Promise<{ data: Project }> => {
  const validatedInput = getProjectInputSchema.parse({ projectId });
  return api.get(`/projects/${validatedInput.projectId}`);
};

export const getProjectQueryOptions = (projectId: string) => {
  return queryOptions({
    queryKey: ["projects", projectId],
    queryFn: () => getProject({ projectId }),
  });
};

type UseProjectOptions = {
  projectId: string;
  queryConfig?: QueryConfig<typeof getProjectQueryOptions>;
};

export const useProject = ({ projectId, queryConfig }: UseProjectOptions) => {
  return useQuery({
    ...getProjectQueryOptions(projectId),
    ...queryConfig,
  });
};
