import { queryOptions, useQuery } from "@tanstack/react-query";

import { api } from "@/lib/api-client";
import { QueryConfig } from "@/lib/react-query";
import { Meta, Project } from "@/types/api";

export const getJuryProjects = (
  { page, eventId }: { page?: number; eventId?: string } = { page: 1 }
): Promise<{ data: Project[]; meta: Meta }> => {
  return api.get(`/events/${eventId}/projects`, { params: { page } });
};

export const getJuryProjectsQueryOptions = ({ page = 1, eventId }: { page?: number; eventId?: string } = {}) => {
  return queryOptions({
    queryKey: ["projects", { page, eventId }],
    queryFn: () => getJuryProjects({ page, eventId }),
  });
};

type UseProjectsOptions = {
  page?: number;
  eventId?: string;
  queryConfig?: QueryConfig<typeof getJuryProjectsQueryOptions>;
};

export const useJuryProjects = ({ queryConfig, page, eventId }: UseProjectsOptions) => {
  return useQuery({
    ...getJuryProjectsQueryOptions({ page, eventId }),
    ...queryConfig,
  });
};
