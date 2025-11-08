import { queryOptions, useQuery } from "@tanstack/react-query";

import { api } from "@/lib/api-client";
import { QueryConfig } from "@/lib/react-query";
import { Meta, Project } from "@/types/api";

export const getProjects = (
  { page, eventId }: { page?: number; eventId?: string } = { page: 1 }
): Promise<{ data: Project[]; meta: Meta }> => {
  if (eventId) {
    if (eventId.includes(",")) {
      return api.get(`/projects`, { params: { page, event: eventId } });
    }

    return api.get(`/projects/by-event/${eventId}`, { params: { page } });
  }
  return api.get(`/projects`, { params: { page } });
};

export const getProjectsQueryOptions = ({
  page = 1,
  eventId,
}: { page?: number; eventId?: string } = {}) => {
  return queryOptions({
    queryKey: ["projects", { page, eventId: eventId ?? null }],
    queryFn: () => getProjects({ page, eventId }),
  });
};

type UseProjectsOptions = {
  page?: number;
  eventId?: string;
  queryConfig?: QueryConfig<typeof getProjectsQueryOptions>;
};

export const useProjects = ({
  queryConfig,
  page,
  eventId,
}: UseProjectsOptions) => {
  return useQuery({
    ...getProjectsQueryOptions({ page, eventId }),
    ...queryConfig,
  });
};
