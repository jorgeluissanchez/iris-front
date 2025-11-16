import { queryOptions, useQuery } from "@tanstack/react-query";

import { api } from "@/lib/api-client";
import { QueryConfig } from "@/lib/react-query";
import { Meta, Project } from "@/types/api";

export const getProjects = async (
  { page, eventId }: { page?: number; eventId?: number } = { page: 1 }
): Promise<{ data: Project[]; meta: Meta }> => {
  console.log("Fetching projects for eventId:", eventId, "page:", page);
  const response = await api.get<{
    items: Project[];
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  }>(`/projects/review`, { params: { page, eventId } });

  console.log("Received response:", response);
  
  return {
    data: response.items || [],
    meta: {
      page: response.page,
      total: response.total,
      totalPages: response.totalPages,
    },
  };
};


export const getProjectsQueryOptions = ({
  page = 1,
  eventId,
}: { page?: number; eventId?: number } = {}) => {
  return queryOptions({
    queryKey: [
      "projects",
      { page, eventId},
    ],
    queryFn: () => getProjects({ page, eventId }),
  });
};

type UseProjectsOptions = {
  page?: number;
  eventId?: number;
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
