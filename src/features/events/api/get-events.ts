import { queryOptions, useQuery } from "@tanstack/react-query";

import { api } from "@/lib/api-client";
import { QueryConfig } from "@/lib/react-query";
import { Meta, Event } from "@/types/api";

export const getEvents = async (
  { page }: { page?: number } = { page: 1 }
): Promise<{ data: Event[]; meta: Meta }> => {
  const response = await api.get<{
    events: Event[];
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  }>(`/events`, { params: { page } });
  
  return {
    data: response.events || [],
    meta: {
      page: response.page,
      total: response.total,
      totalPages: response.totalPages,
    },
  };
};

export const getEventsQueryOptions = ({ page = 1 }: { page?: number } = {}) => {
  return queryOptions({
    queryKey: ["events", { page }],
    queryFn: () => getEvents({ page }),
  });
};

type UseEventsOptions = {
  page?: number;
  queryConfig?: QueryConfig<typeof getEventsQueryOptions>;
};

export const useEvents = ({ queryConfig, page }: UseEventsOptions) => {
  return useQuery({
    ...getEventsQueryOptions({ page }),
    ...queryConfig,
  });
};
