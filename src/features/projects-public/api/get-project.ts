import { useQuery, queryOptions } from "@tanstack/react-query";

import { api } from "@/lib/api-client";
import { QueryConfig } from "@/lib/react-query";
import { ProjectPublic } from "@/types/api";

export const getProject = ({
  projectId,
}: {
  projectId: string;
}): Promise<{ data: ProjectPublic }> => {
  return api.get(`/projects-public/${projectId}`);
};

export const getProjectPublicQueryOptions = (projectId: string) => {
  return queryOptions({
    queryKey: ["projects-public", projectId],
    queryFn: () => getProject({ projectId }),
  });
};

type UseProjectPublicOptions = {
  projectId: string;
  queryConfig?: QueryConfig<typeof getProjectPublicQueryOptions>;
};

export const useProjectPublic = ({ projectId, queryConfig }: UseProjectPublicOptions) => {
  return useQuery({
    ...getProjectPublicQueryOptions(projectId),
    ...queryConfig,
  });
};
