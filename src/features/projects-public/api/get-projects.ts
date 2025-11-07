import { queryOptions, useQuery } from "@tanstack/react-query";

import { api } from "@/lib/api-client";
import { QueryConfig } from "@/lib/react-query";
import { Meta, ProjectPublic } from "@/types/api";

export const getProjects = (
  { page }: { page?: number } = { page: 1 }
): Promise<{ data: ProjectPublic[]; meta: Meta }> => {
  return api.get(`/projects-public`, { params: { page } });
};

export const getProjectsQueryOptions = ({ page = 1 }: { page?: number } = {}) => {
  return queryOptions({
    queryKey: ["projects", { page }],
    queryFn: () => getProjects({ page }),
  });
};

type UseProjectsOptions = {
  page?: number;
  queryConfig?: QueryConfig<typeof getProjectsQueryOptions>;
};

export const useProjects = ({ queryConfig, page }: UseProjectsOptions) => {
  return useQuery({
    ...getProjectsQueryOptions({ page }),
    ...queryConfig,
  });
};
