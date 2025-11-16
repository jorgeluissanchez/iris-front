import { queryOptions, useQuery } from "@tanstack/react-query";

import { api } from "@/lib/api-client";
import { QueryConfig } from "@/lib/react-query";
import { Meta, Event } from "@/types/api";

export const getEventsPublic = async (
  { page }: { page?: number } = { page: 1 }
): Promise<{ data: Event[]; meta: Meta }> => {
  const response = await api.get<{
    events: Event[];
    meta: {
      total: number;
      itemsOnCurrentPage: number;
      itemsPerPage: number;
      currentPage: number;
      totalPages: number;
    };
  }>(`/events/public`, { params: { page } });
    
  return {
    data: response.events || [],
    meta: {
      page: response.meta.currentPage,
      total: response.meta.total,
      totalPages: response.meta.totalPages,
    },
  };
};

export const getEventsQueryOptions = ({ page = 1 }: { page?: number } = {}) => {
  return queryOptions({
    queryKey: ["events", { page }],
    queryFn: () => getEventsPublic({ page }),
  });
};

type UseEventsOptions = {
  page?: number;
  queryConfig?: QueryConfig<typeof getEventsQueryOptions>;
};

export const useEventsPublic = ({ queryConfig, page }: UseEventsOptions) => {
  return useQuery({
    ...getEventsQueryOptions({ page }),
    ...queryConfig,
  });
};
